<template>
  <div class="home">
    <!-- 账单顶部筛选总览区域 -->
    <!-- TODO 使用 keep alive 缓存组件，使得 selectedDate 缓存-->
    <div class="header">
      <van-button
        class="type-wrap"
        size="small"
        @click="popTypeRef.isShowType = true"
      >
        <span class="all-type">{{ selectedType.name || '全部类型' }}</span>
        <svg class="icon">
          <use xlink:href="#icon-type" />
        </svg>
      </van-button>
      <div class="data-wrap">
        <van-button
          class="time"
          size="mini"
          @click="popDateRef.isShowDate = true"
        >
          <span class="time" @click="popDateRef.isShowDate = true">
            <span>{{ selectedDate }}</span>
            <svg class="icon icon-sort-down">
              <use xlink:href="#icon-sort-down" />
            </svg>
          </span>
        </van-button>
        <span class="expense">总支出 ￥{{ monthTotalExpense }}</span>
        <span class="income">总收入 ￥{{ monthTotalIncome }}</span>
      </div>
    </div>
    <!-- 账单列表 -->
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
    <!-- 添加账单按钮 -->
    <van-button
      type="primary"
      round
      class="add-wrap"
      @click="popAddRef.isShowAdd = true"
    >
      <svg class="icon add-icon">
        <use xlink:href="#icon-add-bill" />
      </svg>
      记一笔
    </van-button>

    <PopType ref="popTypeRef" @select-type="handleSelectType" />
    <PopDate ref="popDateRef" @select-date="handleSelectDate" />
    <PopAdd ref="popAddRef" @refresh="onRefresh" />
  </div>
</template>

<script lang="ts">
import { reactive, ref, onActivated } from 'vue'
import PopType from '@/views/bill/PopType.vue'
import PopDate from '@/components/PopDate.vue'
import PopAdd from '@/views/bill/PopAdd.vue'

import axios from '@/utils/axios'
import BillItem from '@/views/bill/BillItem.vue'
import type { BillList, BillType } from '@/api/bill'
import dayjs from 'dayjs'

export default {
  components: {
    PopType,
    PopDate,
    BillItem,
    PopAdd
  },
  setup() {
    const popTypeRef = ref(null)
    const popDateRef = ref(null)
    const popAddRef = ref(null)

    const billList = ref<BillList>([])
    const monthTotalExpense = ref(0)
    const monthTotalIncome = ref(0)
    const page = ref(1)
    const totalPage = ref(0)
    const list = ref([])
    const loading = ref(false)
    const finished = ref(false)
    const refreshing = ref(false)
    const selectedDate = ref(dayjs().format('YYYY-MM'))

    const selectedType = reactive<BillType>({
      id: 0,
      name: '全部类型'
    })
    // onActivated(() => {
    //   console.log('进入')
    //   onRefresh()
    // })

    const handleSelectType = (item: BillType) => {
      Object.assign(selectedType, item)
      // 等价于
      // selectedType.id = item.id
      // selectedType.name = item.name
      onRefresh()
    }

    const handleSelectDate = (item: string) => {
      selectedDate.value = item
      onRefresh()
    }

    const getBillList = async () => {
      try {
        const { data } = await axios.get(
          `/bill/list?date=${selectedDate.value}&type_id=${
            selectedType.id || 'all'
          }&page=${page.value}&page_size=31`
        )
        if (refreshing.value) {
          billList.value = []
          refreshing.value = false
        }
        loading.value = false
        // 通过 id 倒序 data.list 的每项的 bills数组，尝试使用 reverse() 无效
        data.list.forEach((item) => {
          item.bills.sort((a, b) => b.id - a.id)
        })
        billList.value = billList.value.concat(data.list)
        monthTotalExpense.value = data.totalExpense.toFixed(2)
        monthTotalIncome.value = data.totalIncome.toFixed(2)
        totalPage.value = data.totalPage
      } catch (error) {
        console.log(error)
      } finally {
        if (page.value < totalPage.value) {
          page.value += 1
        } else {
          finished.value = true
        }
        loading.value = false
      }
    }

    const onLoad = () => {
      if (!refreshing.value && page.value < totalPage.value) {
        page.value = page.value + 1
      }
      getBillList()
    }

    const onRefresh = () => {
      // 清空列表数据
      finished.value = false
      // 页数重制
      page.value = 1
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      refreshing.value = true
      loading.value = true
      onLoad()
    }

    return {
      monthTotalExpense,
      monthTotalIncome,
      page,
      totalPage,
      list,
      loading,
      finished,
      refreshing,
      selectedDate,
      billList,
      selectedType,
      popTypeRef,
      popDateRef,
      popAddRef,
      handleSelectType,
      handleSelectDate,
      onRefresh,
      onLoad
    }
  }
}
</script>

<style lang="less" scoped>
@import url('@/config/custom.less');
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 90px;
  .header {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 90px;
    background-color: @primary;
    color: #fff;
    font-size: 14px;
    padding-left: 20px;
    z-index: 100;
    .type-wrap {
      background-color: lighten(@primary, 4%);
      display: flex;
      justify-content: center;
      align-content: center;
      padding: 6px;
      border: none;
      border-radius: 4px;
      position: relative;
      align-self: baseline;
      color: #fff;
      font-size: 14px;
      .all-type {
        margin-right: 12px;
      }
      .all-type::after {
        content: '';
        position: absolute;
        top: 11px;
        bottom: 12px;
        right: 26px;
        width: 1px;
        background-color: #fff;
      }
    }
    .data-wrap {
      display: flex;
      align-items: center;
      margin-top: 8px;
      font-size: 14px;
      .time {
        margin-right: 4px;
        line-height: 18px;
        font-size: 14px;
        color: #fff;
        background-color: @primary;
        border: none;
        border-radius: 4px;
        .icon-sort-down {
          margin-left: 2px;
          vertical-align: 0em;
        }
      }
      .expense {
        margin-right: 10px;
      }
    }
  }
  .content-wrap {
    height: calc(~'(100% - 50px)');
    overflow: hidden;
    overflow-y: scroll;
    background-color: #f5f5f5;
    padding: 8px;
  }
  .add-wrap {
    position: fixed;
    right: 20px;
    bottom: 100px;
    padding: 4px 12px;
    height: 42px;
    font-size: 14px;
    border: none;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    color: @primary;
    .add-icon {
      font-size: 24px;
      margin-right: 4px;
    }
  }
}
</style>
<style lang="less">
.home .add-wrap {
  .van-button__text {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
