<template>
  <div class="header">
    <!-- 筛选日期收支类型 -->
    <div class="filter-wrap">
      <span class="date" @click="popDateRef.isShowDate = true">
        {{ dayjs(selectedDate).format('YYYY年MM月') }}
        <van-icon name="notes-o" />
      </span>
      <span class="type">
        <span class="expense">支出</span>
        <span class="income">收入</span>
      </span>
    </div>
    <!-- 总收支展示 -->
    <div class="total-wrap">
      <div class="title">共支出 共收入</div>
      <div class="total-amount">¥{{ totalExpense || 0 }}</div>
      <div class="total-amount">¥{{ totalIncome || 0 }}</div>
    </div>
  </div>

  <!-- 收支构成图表明细 -->
  <div class="structure"></div>
  <PopDate ref="popDateRef" @select-date="handleSelectDate" />
</template>

<script lang="ts">
import { ref, onMounted, reactive, toRefs } from 'vue'
import PopDate from '@/components/PopDate.vue'
import dayjs from 'dayjs'
import axios from '@/utils/axios'

export default {
  name: 'Data',
  components: {
    PopDate
  },
  setup() {
    const popDateRef = ref(null)
    const selectedDate = ref(new Date())
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
        const { data } = await axios.get(
          `/bill/data?date=${selectedDate.value}`
        )
        monthBillData.totalExpense = data.total_expense
        monthBillData.totalIncome = data.total_income
        // Object.assign(monthBillData, data) 无效
      } catch (error) {
        console.log('error:', error)
      }
    }

    const handleSelectDate = (date: Date) => {
      selectedDate.value = date
      getMouthBillData()
    }

    return {
      ...toRefs(monthBillData),
      dayjs,
      selectedDate,
      popDateRef,
      handleSelectDate
    }
  }
}
</script>
<style lang="less" scoped>
@import url('@/config/custom.less');
.header {
  background-color: @primary;
  color: #fff;
  padding: 40px 20px;

  .filter-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    .date {
      font-weight: 500;
      .van-icon-notes-o {
        font-size: 16px;
        color: #fff;
      }
    }
    .type {
      span {
        display: inline-block;
        background: #f5f5f5;
        padding: 4px 10px;
        font-size: 12px;
        border-radius: 8px;
        background-color: lighten(@primary, 4%);
        // border: 1px solid #f5f5f5;
      }

      .expense {
        margin-right: 6px;
        &.active {
          background-color: #eafbf6;
          border-color: @primary;
          color: @primary;
        }
      }
      .income {
        &.active {
          background-color: #fbf8f0;
          border-color: @text-warning;
          color: @text-warning;
        }
      }
    }
  }
  .total-wrap {
    display: flex;
    flex-direction: column;
    margin-top: 20px;

    .title {
      color: @color-text-secondary;
    }
    .total-amount {
      margin-top: 10px;
      font-size: 24px;
      font-weight: 600;
    }
  }
}
</style>
