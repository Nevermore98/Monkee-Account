<template>
  <van-cell-group class="item-wrap">
    <div class="item-header">
      <div>{{ createAtDate }} {{ createAtDay }}</div>
      <div class="today-total">
        <span>
          <b>支</b>
          {{ dayTotalExpense.toFixed(2) }}
        </span>
        <span>
          <b>收</b>
          {{ dayTotalIncome.toFixed(2) }}
        </span>
      </div>
    </div>
    <van-cell
      class="bill-item"
      center
      :class="{ expense: item.pay_type === 1, income: item.pay_type === 2 }"
      v-for="item in dayBillList.bills"
      :key="item.id"
      @click="goToDetail(item)"
      :title="item.type_name"
      :value="`${item.pay_type == 1 ? '-' : '+'}${item.amount}`"
      :label="`${dayjs(Number(item.date)).format('HH:mm')}${
        item.remark ? ' | ' + item.remark : ''
      }`"
      ><template #icon>
        <div
          class="icon-wrap"
          :class="{ expense: item.pay_type === 1, income: item.pay_type === 2 }"
        >
          <svg class="icon">
            <use v-bind:xlink:href="getHref(item)" />
          </svg>
        </div>
      </template>
    </van-cell>
  </van-cell-group>
</template>

<script lang="ts">
import { computed, PropType, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { DayBillItem, DayBillItems, DayBillList } from '@/api/bill'
import dayjs from 'dayjs'
import { typeMap } from '@/utils/index'
import { BillType } from '@/api/bill'

export default {
  name: 'CardItem',
  props: {
    dayBillList: {
      type: Object as PropType<DayBillList>
    }
  },
  setup(props) {
    const router = useRouter()
    enum Days {
      星期一 = 1,
      星期二,
      星期三,
      星期四,
      星期五,
      星期六,
      星期日
    }

    const dayBillList = props.dayBillList
    const createAtDay = Days[dayjs(dayBillList.date).get('day')]
    // 可以改为 计算属性
    const createAtDate = dayjs(dayBillList.date).format('M月D日')

    const dayTotalExpense = computed(() => {
      return props.dayBillList.bills.reduce(
        (cur: number, dayBillItem: DayBillItem) => {
          if (dayBillItem.pay_type === 1) cur += Number(dayBillItem?.amount)
          return cur
        },
        0
      )
    })
    const dayTotalIncome = computed(() => {
      return props.dayBillList.bills.reduce(
        (cur: number, dayBillItem: DayBillItem) => {
          if (dayBillItem.pay_type === 2) cur += Number(dayBillItem?.amount)
          return cur
        },
        0
      )
    })

    const goToDetail = (item: DayBillItem) => {
      router.push({
        path: '/detail',
        query: {
          id: item.id
        }
      })
    }
    const getHref = (item: DayBillItem) => {
      // 偶现 typeMap[item.type_id] 为 undefined 的 bug，使用 ?. 确保无报错
      let iconName = typeMap[item.type_id]?.icon
      return `#icon-${iconName}`
    }

    return {
      createAtDate,
      createAtDay,
      dayTotalExpense,
      dayTotalIncome,
      goToDetail,
      dayjs,
      getHref
    }
  }
}
</script>

<style lang="less" scoped>
@import url('@/config/custom.less');
.item-wrap {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  .item-header {
    height: 60px;
    display: flex;
    background-color: #f9f9f9;
    font-size: 12px;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    div {
      color: @color-text-base;
    }
    .today-total {
      span {
        margin-left: 10px;
        b {
          color: @color-text-caption;
          font-weight: normal;
          background-color: #f5f5f5;
          padding: 3px;
          border-radius: 2px;
        }
      }
    }
  }
  .bill-item {
    .icon-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
      border-radius: 50%;
      height: 36px;
      width: 36px;
      margin-right: 10px;
      .icon {
        font-size: 22px;
      }
    }
    .expense {
      background-color: @primary;
      color: @color-text-caption;
      .icon {
        color: #fff;
      }
    }
    .income {
      background-color: @text-warning;
      .icon {
        color: #fff;
      }
    }
  }
}
</style>
<style lang="less">
@import url('@/config/custom.less');
.expense {
  .van-cell__value {
    color: @color-text-base!important;
  }
}
.income {
  .van-cell__value {
    color: @text-warning!important;
  }
}
</style>
