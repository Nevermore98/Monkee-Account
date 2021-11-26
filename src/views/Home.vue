<template>
  <div class="home">
    <div class="header">
      <div class="type-wrap" @click="toggle">
        <span class="all-type">{{ selectedType.name || '全部类型' }}</span>
        <svg class="icon">
          <use xlink:href="#icon-type" />
        </svg>
      </div>

      <div class="data-wrap">
        <span class="time" @click="monthToggle">
          {{ currentDate }}
          <svg class="icon icon-sort-down">
            <use xlink:href="#icon-sort-down" />
          </svg>
        </span>
        <span class="expense">总支出 ￥{{ totalExpense }}</span>
        <span class="income">总收入 ￥{{ totalIncome }}</span>
      </div>
    </div>

    <div class="content-wrap">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <BillItem
            v-for="dayBillList in billList"
            :dayBillList="dayBillList"
            :key="dayBillList.date"
          />
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- <van-popup v-model:show="showType" position="bottom" round :style="{ height: '70%' }">
      <PopType />
    </van-popup>-->

    <PopType ref="popTypeRef" @select-type="handleSelectType" />
    <PopDate ref="popMonthRef" @select-date="handleSelectDate" />
  </div>
</template>

<script lang="ts">
import { reactive, ref, toRefs, onMounted } from 'vue'
import PopType from '../components/PopType.vue'
import PopDate from '../components/PopDate.vue'
import axios from '../utils/axios'
import BillItem from '../components/BillItem.vue'
import type { BillList, BillType } from '../api/bill'
import dayjs from 'dayjs'


export default {
  components: {
    PopType,
    PopDate,
    BillItem,
  },
  setup() {
    const popTypeRef = ref(null)
    const popMonthRef = ref(null)
    const showType = ref(false) // 选择账单类型弹窗
    let billList = ref<BillList>([])

    const state = reactive({
      totalExpense: 0,
      totalIncome: 0,
      page: 1,
      totalPage: 0,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      currentDate: dayjs().format('YYYY-MM')
    })
    const selectedType = reactive<BillType>({
      id: 0,
      name: "全部类型",
    })

    const toggle = () => {
      popTypeRef.value.toggle()
    }

    const handleSelectType = (item: BillType) => {
      Object.assign(selectedType, item)
      // 等价于
      // selectedType.id = item.id
      // selectedType.name = item.name
      onRefresh()
    }

    const monthToggle = () => {
      popMonthRef.value.toggle()
    }

    const handleSelectDate = (item) => {
      state.currentDate = item
      onRefresh()
    }

    const getBillList = async () => {
      const { data } = await axios.get(
        `/bill/list?date=${state.currentDate}&type_id=${selectedType.id || 'all'
        }&page=${state.page}&page_size=5`
      )
      console.log('筛选后的账单列表：', data.list)

      if (state.refreshing) {
        billList.value = []
        state.refreshing = false
      }
      state.loading = false
      billList.value = billList.value.concat(data.list)
      state.totalExpense = data.totalExpense.toFixed(2)
      state.totalIncome = data.totalIncome.toFixed(2)
      state.totalPage = data.totalPage
      if (state.page >= state.totalPage) {
        state.finished = true
      }
    }

    const onLoad = () => {
      if (!state.refreshing && state.page < state.totalPage) {
        state.page = state.page + 1
      }
      getBillList()
    }

    const onRefresh = () => {
      // 清空列表数据
      state.finished = false
      // 页数重制
      state.page = 1
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      state.refreshing = true
      state.loading = true
      onLoad()
    }

    return {
      ...toRefs(state),
      billList,
      selectedType,
      popTypeRef,
      popMonthRef,
      toggle,
      handleSelectType,
      monthToggle,
      handleSelectDate,
      onRefresh,

      showType,
      onLoad,
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../config/custom.less");
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 80px;
  .header {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 80px;
    background-color: @primary;
    color: #fff;
    font-size: 14px;
    padding-left: 20px;
    z-index: 100;
    .type-wrap {
      background-color: lighten(@primary, 10%);
      display: inline-block;
      padding: 6px;
      border-radius: 4px;
      position: relative;
      align-self: baseline;
      .all-type {
        margin-right: 22px;
      }
      .all-type::after {
        content: "";
        position: absolute;
        top: 12px;
        bottom: 11px;
        right: 32px;
        width: 1px;
        background-color: #e9e9e9;
      }
    }
    .data-wrap {
      display: flex;
      margin-top: 10px;
      font-size: 13px;
      .time {
        margin-right: 12px;
        line-height: 18px;
        .icon-sort-down {
          // 目前只能想到这种笨方法，实现 svg 近似垂直居中
          margin-bottom: 2px;
        }
      }
      .expense {
        margin-right: 10px;
      }
    }
  }
  .content-wrap {
    height: calc(~"(100% - 50px)");
    overflow: hidden;
    overflow-y: scroll;
    background-color: #f5f5f5;
    padding: 10px;
    // padding-bottom: 50px;
  }
}
</style>
