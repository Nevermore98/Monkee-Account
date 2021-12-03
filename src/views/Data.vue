<template>
  <div
    class="header"
    :class="{
      'expense-background': totalType == 'expense',
      'income-background': totalType == 'income'
    }"
  >
    <!-- 筛选日期收支类型 -->
    <div class="filter-wrap">
      <span class="date" @click="popDateRef.isShowDate = true">
        {{ dayjs(selectedDate).format('YYYY年MM月') }}
        <svg class="icon">
          <use xlink:href="#icon-calendar" />
        </svg>
      </span>
      <span class="type-tab">
        <span
          class="expense"
          :class="{ active: totalType == 'expense' }"
          @click="changeTotalType('expense')"
          >支出</span
        >
        <span
          class="income"
          :class="{ active: totalType == 'income' }"
          @click="changeTotalType('income')"
          >收入</span
        >
      </span>
    </div>
    <!-- 总收支展示 -->
    <div class="total-wrap">
      <div class="title">
        {{ totalType === 'expense' ? '共支出' : '共收入' }}
      </div>
      <div class="total-amount">
        ¥{{ totalType === 'expense' ? totalExpense : totalIncome }}
      </div>
    </div>
  </div>

  <!-- 收支构成图表明细 -->
  <div class="structure">
    <div class="title">
      {{ totalType === 'expense' ? '支出构成' : '收入构成' }}
    </div>
    <!-- 账单占比饼图 -->
    <div id="pie-chart" style="width: 100%; height: 200px"></div>
    <!-- 账单占比条形图 -->
    <div class="bar-chart">
      <div
        class="bill-item"
        v-for="item in totalType === 'expense' ? expenseList : incomeList"
        :key="item.type_id"
      >
        <!-- 类型图标和名字 -->
        <div class="type-item">
          <span
            class="icon-wrap"
            :class="{
              expense: totalType == 'expense',
              income: totalType == 'income'
            }"
          >
            <svg class="type-icon icon">
              <use v-bind:xlink:href="getHref(item)" />
            </svg>
          </span>
          <span>{{ item.type_name }}</span>
        </div>

        <span class="progress">
          <van-progress
            :percentage="
              Number(
                (item.number /
                  Number(totalType == 'expense' ? totalExpense : totalIncome)) *
                  100
              )
            "
            stroke-width="6px"
            :show-pivot="false"
            track-color="#ffffff"
            :color="totalType === 'expense' ? '#39be77' : '#ecbe25'"
          />
        </span>
        <span class="amount">￥{{ Number(item.number).toFixed(2) || 0 }}</span>
      </div>
    </div>
  </div>
  <PopDate ref="popDateRef" @select-date="handleSelectDate" />
</template>

<script lang="ts">
import { ref, onMounted, reactive, toRefs } from 'vue'
import PopDate from '@/components/PopDate.vue'
import dayjs from 'dayjs'
import axios from '@/utils/axios'
import { typeMap } from '@/utils'
import { DayBillItem } from '@/api/bill'
import * as echarts from 'echarts'

export default {
  name: 'Data',
  components: {
    PopDate
  },
  setup() {
    const popDateRef = ref(null)
    const selectedDate = ref(new Date())
    const totalType = ref('expense')
    // const expenseColor = ref() 或许可以尝试使用变量设置类名
    // const totalExpense = ref(0)
    // const totalIncome = ref(0)
    const monthBillData = reactive({
      expenseList: [],
      incomeList: [],
      totalExpense: 0,
      totalIncome: 0
    })

    onMounted(() => {
      getMouthBillData()
    })

    const getMouthBillData = async () => {
      try {
        const { data, code } = await axios.get(
          `/bill/data?date=${selectedDate.value}`
        )
        if (code === 200) {
          monthBillData.totalExpense = data.total_expense
          monthBillData.totalIncome = data.total_income
          console.log(data)
          // Object.assign(monthBillData, data) 无效
          monthBillData.expenseList = data.total_data
            .filter((item) => item.pay_type === 1)
            .sort((a, b) => b.number - a.number)
          monthBillData.incomeList = data.total_data
            .filter((item) => item.pay_type === 2)
            .sort((a, b) => b.number - a.number)
          setPieChart()
        }
      } catch (error) {
        console.log('error:', error)
      }
    }

    const handleSelectDate = (date: Date) => {
      selectedDate.value = date
      getMouthBillData()
    }

    const changeTotalType = (type) => {
      totalType.value = type
      setPieChart()
    }

    // 获取类型对应图标名
    const getHref = (item: DayBillItem) => {
      let iconName = typeMap[item.type_id].icon
      return `#icon-${iconName}`
    }

    // 绘制饼图方法
    const setPieChart = () => {
      const pieChart = echarts.init(document.getElementById('pie-chart'))
      console.log(monthBillData.expenseList)
      const _data =
        totalType.value == 'expense'
          ? monthBillData.expenseList
          : monthBillData.incomeList
      pieChart.setOption({
        visualMap: {
          show: false,
          min: Math.min(..._data.map((item) => item.number)),
          max: Math.max(..._data.map((item) => item.number)),
          inRange: {
            colorLightness: [0.7, 0.5]
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['30%', '50%'],
            itemStyle: {
              color: totalType.value === 'expense' ? '#39be77' : '#ecbe25',
              borderColor: '#fff',
              borderWidth: 2
            },
            data: _data.map((item) => {
              return {
                value: item.number,
                name: item.type_name
              }
            }),
            label: {
              color: '#ccc',
              position: 'outside',
              formatter: '{b} {d}%',
              fontWeight: 500
            },
            labelLine: {
              lineStyle: {
                color: '#ccc'
              },
              showAbove: false,
              length: 10,
              length2: 15
            }
          }
        ]
      })
    }

    return {
      ...toRefs(monthBillData),
      totalType,
      dayjs,
      selectedDate,
      popDateRef,
      handleSelectDate,
      changeTotalType,
      getHref
    }
  }
}
</script>
<style lang="less" scoped>
@import url('@/config/custom.less');

.header {
  color: #fff;
  padding: 40px 20px;

  .filter-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    .date {
      font-weight: 500;
    }
    .type-tab {
      span {
        display: inline-block;
        padding: 4px 10px;
        font-size: 12px;
        border-radius: 2px;
        opacity: 0.5;
      }
      .expense {
        margin-right: 6px;
        &.active {
          background-color: lighten(@primary, 4%);
          border-color: @primary;
          color: #fff;
          opacity: 1;
        }
      }
      .income {
        &.active {
          background-color: lighten(@text-warning, 4%);
          border-color: @text-warning;
          color: #fff;
          opacity: 1;
        }
      }
    }
  }
  .total-wrap {
    display: flex;
    flex-direction: column;
    margin-top: 20px;

    .title {
      // color: @color-text-light;
      opacity: 0.5;
    }
    .total-amount {
      margin-top: 10px;
      font-size: 24px;
      font-weight: 600;
    }
  }
}
.structure {
  margin: 20px;
  background-color: #fff;

  .title {
    margin-bottom: 20px;
    font-size: 16px;
  }
  .bar-chart {
    padding-bottom: 100px;
    .bill-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      .type-item {
        display: flex;
        align-items: center;
        .icon-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
          border-radius: 50%;
          height: 22px;
          width: 22px;
          margin-right: 6px;
          .icon {
            font-size: 14px;
            color: #fff;
          }
        }
        .expense {
          background-color: @primary;
        }
        .income {
          background-color: @text-warning;
        }
      }

      .progress {
        margin-left: 20px;
        width: 160px;
      }
      .amount {
        width: 100px;
        text-align: right;
      }
    }
  }
}
</style>
<style lang="less">
@import url('@/config/custom.less');
.expense-background {
  background-color: @primary;
}
.income-background {
  background-color: @text-warning;
}
</style>
