<template>
  <van-skeleton title :row="10" :loading="loading">
    <div
      class="header"
      :class="{
        'expense-background': curPayType == 'expense',
        'income-background': curPayType == 'income'
      }"
    >
      <!-- 筛选日期收支类型 -->
      <div class="filter-wrap">
        <van-button class="date" @click="popDateRef.isShowDate = true">
          {{ dayjs(selectedDate).format('YYYY年MM月') }}
          <svg class="icon">
            <use xlink:href="#icon-calendar" />
          </svg>
        </van-button>
        <span class="type-tab">
          <span
            class="expense"
            :class="{ active: curPayType == 'expense' }"
            @click="changeCurPayType('expense')"
            >支出</span
          >
          <span
            class="income"
            :class="{ active: curPayType == 'income' }"
            @click="changeCurPayType('income')"
            >收入</span
          >
        </span>
      </div>
      <!-- 总收支展示 -->
      <div class="total-wrap">
        <div class="title">
          {{ curPayType === 'expense' ? '共支出' : '共收入' }}
        </div>
        <div class="total-amount">
          ¥{{ curPayType === 'expense' ? totalExpense : totalIncome }}
        </div>
      </div>
    </div>

    <!-- 收支构成图表明细 -->
    <div class="structure" v-if="curTotal > 0">
      <div class="title">
        {{ curPayType === 'expense' ? '支出构成' : '收入构成' }}
      </div>
      <!-- 账单占比饼图 -->
      <div
        id="pie-chart"
        style="width: 100%; height: 200px"
        v-if="curTotal > 0"
      ></div>
      <!-- 账单占比条形图 -->
      <div class="proportion-bar">
        <div
          class="bill-item"
          v-for="item in curPayType === 'expense' ? expenseList : incomeList"
          :key="item.type_id"
        >
          <!-- 类型图标和名字 -->
          <div class="type-item">
            <span
              class="icon-wrap"
              :class="{
                expense: curPayType == 'expense',
                income: curPayType == 'income'
              }"
            >
              <svg class="type-icon icon">
                <use v-bind:xlink:href="getHref(item)" />
              </svg>
            </span>
            <span class="icon-name">{{ item.type_name }}</span>
          </div>

          <span class="progress">
            <van-progress
              :percentage="
                Number(
                  (item.number /
                    Number(
                      curPayType == 'expense' ? totalExpense : totalIncome
                    )) *
                    100
                )
              "
              stroke-width="6px"
              :show-pivot="false"
              track-color="#ffffff"
              :color="curPayType === 'expense' ? '#39be77' : '#ecbe25'"
            />
          </span>
          <span class="amount"
            >￥{{ Number(item.number).toFixed(2) || 0 }}</span
          >
        </div>
      </div>
    </div>
    <div class="empty" v-else>
      <div class="icon-wrap">
        <svg class="icon">
          <use xlink:href="#icon-empty" />
        </svg>
      </div>
      {{ `暂无${curPayType === 'expense' ? '支出' : '收入'}账单` }}
      <van-button
        size="small"
        class="empty-button"
        :class="{
          'expense-background': curPayType == 'expense',
          'income-background': curPayType == 'income'
        }"
        @click="$router.push('/home')"
      >
        去记账
      </van-button>
    </div>
    <PopDate ref="popDateRef" @select-date="handleSelectDate" />
  </van-skeleton>
</template>

<script lang="ts">
import { ref, onMounted, reactive, toRefs, computed } from 'vue'
import PopDate from '@/components/PopDate.vue'
import dayjs from 'dayjs'
import axios from '@/utils/axios'
import { typeMap } from '@/utils'
import { DayBillItem } from '@/api/bill'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'

export default {
  name: 'Data',
  components: {
    PopDate
  },
  setup() {
    const popDateRef = ref(null)
    const selectedDate = ref(dayjs().format('YYYY-MM'))
    const curPayType = ref('expense')
    const router = useRouter()
    const monthBillData = reactive({
      expenseList: [],
      incomeList: [],
      totalExpense: 0,
      totalIncome: 0
    })
    const curTotal = computed(() => {
      return curPayType.value === 'expense'
        ? monthBillData.totalExpense
        : monthBillData.totalIncome
    })
    const loading = ref(true)

    onMounted(() => {
      getMouthBillData()
    })

    const getMouthBillData = async () => {
      try {
        // @ts-ignore
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
        }
      } catch (error) {
        console.log('error:', error)
      } finally {
        // DOM 还没挂载完成，延迟一会再初始化图表
        setTimeout(() => {
          setPieChart()
        }, 50)
        loading.value = false
      }
    }

    const handleSelectDate = (date: string) => {
      selectedDate.value = date
      getMouthBillData()
    }

    const changeCurPayType = (type: 'expense' | 'income') => {
      curPayType.value = type
      // DOM 还没挂载完成，延迟一会再初始化图表
      setTimeout(() => setPieChart(), 50)
    }

    // 获取类型对应图标名
    const getHref = (item: DayBillItem) => {
      let iconName = typeMap[item.type_id]?.icon
      return `#icon-${iconName}`
    }

    // 绘制饼图方法
    const setPieChart = () => {
      // 如果支出或者收入为 0，则不渲染
      if (curTotal.value === 0) {
        return
      }
      try {
        const pieChart = echarts.init(document.getElementById('pie-chart'))
        const _data =
          curPayType.value == 'expense'
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
              radius: ['40%', '65%'],
              itemStyle: {
                color: curPayType.value === 'expense' ? '#39be77' : '#ecbe25',
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
                showAbove: true,
                length: 20,
                length2: 5
              }
            }
          ]
        })
      } catch {}
    }

    return {
      ...toRefs(monthBillData),
      curPayType,
      dayjs,
      selectedDate,
      popDateRef,
      handleSelectDate,
      changeCurPayType,
      getHref,
      curTotal,
      loading
    }
  }
}
</script>
<style lang="less" scoped>
@import url('@/config/custom.less');

.header {
  color: #fff;

  .filter-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40px 30px 20px 20px;
    font-size: 14px;
    .date {
      height: 32px;
      padding: 6px 10px;
      background: transparent;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      font-size: 16px;
      color: #fff;
    }
    .type-tab {
      span {
        display: inline-block;
        padding: 6px 12px;
        font-size: 14px;
        border-radius: 4px;
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
    padding: 20px 30px;

    .title {
      opacity: 0.5;
      font-size: 14px;
    }
    .total-amount {
      padding: 20px 0;
      font-size: 32px;
      font-weight: 500;
    }
  }
}
.structure {
  background-color: #fff;
  font-size: 14px;

  .title {
    padding: 30px;
    font-size: 16px;
  }
  .proportion-bar {
    padding: 0 30px 100px 30px;
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
          height: 26px;
          width: 26px;
          margin-right: 8px;
          .type-icon {
            font-size: 16px;
            color: #fff;
          }
        }
        .icon-name {
          min-width: 40px;
        }
        .expense {
          background-color: @primary;
        }
        .income {
          background-color: @text-warning;
        }
      }

      .progress {
        margin-left: 22px;
        width: 160px;
      }
      .amount {
        width: 100px;
        text-align: right;
        font-weight: 500;
      }
    }
  }
}
.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: @color-text-caption;

  .icon-wrap {
    font-size: 40px;
  }
  .empty-button {
    margin-top: 20px;
    padding: 6px 12px;
    font-size: 14px;
    color: #fff;
    border: none;
    border-radius: 4px;
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
