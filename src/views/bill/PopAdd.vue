<template>
  <van-popup
    v-model:show="isShowAdd"
    position="bottom"
    round
    @close="clearPopAdd"
  >
    <div class="add-wrap">
      <!-- 添加账单头部 -->
      <header class="header">
        <span class="close-wrap">
          <van-icon name="cross" @click="isShowAdd = false" />
        </span>
      </header>
      <!-- 筛选类型和日期 -->
      <div class="filter-wrap">
        <div class="type">
          <span
            @click="changeType('expense')"
            :class="{ expense: true, active: payType === 'expense' }"
            >支出</span
          >
          <span
            @click="changeType('income')"
            :class="{ income: true, active: payType === 'income' }"
            >收入</span
          >
        </div>
        <van-button class="date" @click="isShowAddDate = true">
          <span>{{ formattedDate }}</span>
          <svg class="icon icon-sort-down">
            <use xlink:href="#icon-sort-down" />
          </svg>
        </van-button>
      </div>
      <!-- 日历选择弹出层 -->
      <van-config-provider :theme-vars="calendarThemeVars">
        <van-calendar
          v-model:show="isShowAddDate"
          :show-confirm="false"
          @confirm="chooseDate"
          @open="openCalendar"
          :row-height="60"
          :max-date="maxDate"
          :min-date="minDate"
          ref="calendarRef"
        />
      </van-config-provider>
      <!-- 金额显示框 -->
      <div class="numberPad">
        <span class="prefix">￥</span>
        <span class="amount animation">{{ billAmount }}</span>
      </div>
      <!-- 收支类型图标 -->
      <div class="type-wrap">
        <div class="type-body" v-if="payType == 'expense'">
          <van-button
            class="type-item"
            v-for="item in expenseList"
            :key="item.id"
            @click="chooseTypeIcon(item)"
          >
            <div
              :class="{
                'icon-wrap': true,
                expense: true,
                active: selectedType?.id === item.id
              }"
            >
              <svg class="type-icon icon">
                <use v-bind:xlink:href="getHref(item)" />
              </svg>
            </div>
            <div>{{ item.name }}</div>
          </van-button>
        </div>
        <div class="type-body income-type-body" v-else>
          <van-button
            class="type-item"
            v-for="item in incomeList"
            :key="item.id"
            @click="chooseTypeIcon(item)"
          >
            <span
              :class="{
                'icon-wrap': true,
                income: true,
                active: selectedType?.id === item.id
              }"
            >
              <svg class="type-icon icon">
                <use v-bind:xlink:href="getHref(item)" />
              </svg>
            </span>
            <span>{{ item.name }}</span>
          </van-button>
        </div>
      </div>
      <!-- 备注输入框 -->
      <div class="remark">
        <van-field
          v-model="remark"
          label="备注"
          placeholder="添加记账备注"
          maxlength="15"
          clearable
          show-word-limit
        />
      </div>

      <!-- 数字键盘 -->
      <van-number-keyboard
        :show="true"
        theme="custom"
        extra-key="."
        close-button-text="确定"
        @delete="handleDelete"
        @input="handleInput"
        @close="addBill"
      />
    </div>
  </van-popup>
</template>

<script lang="ts">
import { onMounted, ref, computed, watch, PropType, reactive } from 'vue'
import dayjs from 'dayjs'
import { Toast } from 'vant'
import type { CalendarInstance } from 'vant'

import axios from 'axios'
import { changeConfirmButtonColor, typeMap } from '@/utils/index'
import { BillType, BillTypeList, DayBillItem } from '@/api/bill'
import useInput from '@/hooks/useInput'

export default {
  emits: ['refresh'],
  props: {
    initData: Object as PropType<DayBillItem>
  },
  setup(props, ctx) {
    const id = props.initData && props.initData.id // 外部传进来的账单详情 id
    const isShowAdd = ref(false)
    const isShowAddDate = ref(false)
    const payType = ref('expense')
    const selectedDate = ref(new Date())
    const selectedType = reactive<BillType>({
      id: 0,
      name: ''
    })
    const expenseList = ref<BillTypeList>([])
    const incomeList = ref<BillTypeList>([])
    const remark = ref('')
    const numberPadButtonColor = ref('#39be77')
    const calendarRef = ref<CalendarInstance>(null)
    // 使用 useInput hook
    const { billAmount, handleInput, handleDelete } = useInput()

    // 初始化添加账单弹出层
    const initAddBill = () => {
      billAmount.value = ''
      selectedType.id = 0
      selectedType.name = ''
      payType.value = 'expense'
      // 添加账单时，数字键盘确认键颜色默认为支出颜色
      changeConfirmButtonColor('expense')
      isShowAdd.value = false
      selectedDate.value = new Date()
      remark.value = ''
    }
    // 初始化编辑账单弹出层
    const initEditBill = () => {
      billAmount.value = props.initData.amount || ''
      selectedType.id = props.initData.type_id || 0
      selectedType.name = props.initData.type_name || ''
      // @ts-ignore
      selectedDate.value = dayjs(Number(props.initData.date)).$d
      remark.value = props.initData.remark || ''
      payType.value = props.initData.pay_type === 1 ? 'expense' : 'income'
    }
    watch(
      () => props.initData,
      () => {
        if (id) {
          initEditBill()
        }
      },
      { deep: true, immediate: true }
    )

    onMounted(async () => {
      // 拿到请求到的对象里的 data 属性里的 list 属性
      const {
        data: { list }
      } = await axios.get('/type/list')
      expenseList.value = list.filter((i) => i.type === '1')
      incomeList.value = list.filter((i) => i.type === '2')
      calendarRef.value?.reset()
    })
    // 切换收支类型
    const changeType = (type: string) => {
      payType.value = type
      selectedType.id = 0
      selectedType.name = ''
      changeConfirmButtonColor(type)
    }
    // 选择收支类型具体图标
    const chooseTypeIcon = (item: BillType) => {
      Object.assign(selectedType, item)
    }
    const getHref = (item: BillType) => {
      let iconName = typeMap[item.id].icon
      return `#icon-${iconName}`
    }

    // 自定义日历主题
    const calendarThemeVars = {
      calendarPopupHeight: '62%',
      calendarSelectedDayBackgroundColor: '#39be77',
      calendarHeaderTitleHeight: '40px'
    }
    // 弹出日历，如果是编辑账单，则默认选中当前账单的日期
    const openCalendar = () => {
      if (id) {
        initEditBill()
        calendarRef.value?.reset(dayjs(Number(props.initData.date)).$d)
      }
    }

    const minDate = new Date(2021, 5, 1)
    const maxDate = new Date()

    const formattedDate = computed(() =>
      dayjs(Number(selectedDate.value)).format('MM-DD')
    )

    const chooseDate = (value: Date) => {
      isShowAddDate.value = false
      selectedDate.value = value
    }

    const addBill = async () => {
      if (!billAmount.value) {
        Toast({
          message: '请输入具体金额',
          position: 'bottom'
        })
        return
      }
      if (Number(billAmount.value).toFixed(2) === '0.00') {
        Toast({
          message: '输入金额不能为零',
          position: 'bottom'
        })
        return
      }
      if (!selectedType.name) {
        Toast({
          message: '请选择收支类型',
          position: 'bottom'
        })
        return
      }

      const params: DayBillItem = {
        amount: Number(billAmount.value).toFixed(2), // 金额
        type_id: selectedType.id, // 当前消费类型 id
        type_name: selectedType.name, // 当前消费类型 name
        date: (dayjs(selectedDate.value).unix() * 1000).toString(), // 日期
        pay_type: payType.value == 'expense' ? 1 : 2, // 支出或收入
        remark: remark.value || ''
      }
      try {
        if (id) {
          params.id = id
          // 如果有 id 即是在编辑账单详情，需要调用详情更新接口
          const result = await axios.post('/bill/update', params)
          isShowAdd.value = false
          Toast.success('修改成功')
          ctx.emit('refresh')
        } else {
          const result = await axios.post('/bill/add', params)
          // 调完接口之后清空数据
          clearPopAdd()
          Toast.success('添加成功')
          // 向首页发送事件，刷新账单页
          ctx.emit('refresh')
        }
      } catch (error) {
        console.log(error)
      }
    }

    // 点击遮罩层关闭添加账单，若存在 id 即在详情页中则保持原值不变，否则在首页则清空
    const clearPopAdd = () => {
      if (id) {
        console.log(calendarRef.value)
        calendarRef.value?.reset(dayjs(Number(props.initData.date)).$d)
        initEditBill()
      } else {
        calendarRef.value?.reset()
        initAddBill()
      }
    }

    return {
      calendarRef,
      isShowAdd,
      isShowAddDate,
      payType,
      changeType,
      selectedDate,
      minDate,
      maxDate,
      chooseDate,
      openCalendar,
      calendarThemeVars,
      numberPadButtonColor,
      formattedDate,
      handleInput,
      handleDelete,
      billAmount,
      expenseList,
      incomeList,
      chooseTypeIcon,
      typeMap,
      selectedType,
      getHref,
      addBill,
      remark,
      clearPopAdd,
      clearPopAddInHome: initAddBill
    }
  }
}
</script>
<style lang="less" scoped>
@import url('@/config/custom.less');
.add-wrap {
  padding-top: 12px;
  .header {
    padding: 0 20px;

    .close-wrap {
      display: flex;
      align-items: center;

      .van-icon-cross {
        font-size: 26px;
        color: @color-text-secondary;
      }
    }

    .add-btn {
      padding: 0 12px;
      background-color: @primary;
      border-color: @primary;
    }
  }
  .filter-wrap {
    padding: 10px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .type {
      span {
        display: inline-block;
        background: #f5f5f5;
        color: @color-text-caption;
        padding: 6px 12px;
        font-size: 14px;
        border-radius: 4px;
      }
      .expense {
        margin-right: 8px;
        &.active {
          background-color: #dbf7ee;
          border-color: @primary;
          color: @primary;
        }
      }
      .income {
        &.active {
          background-color: #fff4d5;
          border-color: @text-warning;
          color: @text-warning;
        }
      }
    }
    .date {
      display: flex;
      align-items: center;
      height: 32px;
      padding: 8px 6px 8px 8px;
      background-color: #f0f0f0;
      border: none;
      border-radius: 4px;
      color: @color-text-base;
      font-size: 14px;
      .icon-sort-down {
        use {
          transform: translateY(-20%);
        }
      }
    }
  }
  .numberPad {
    padding-bottom: 12px;
    border-bottom: 1px solid #e9e9e9;
    padding: 0 20px;
    .prefix {
      font-size: 40px;
      font-weight: bold;
    }
    .amount {
      font-size: 40px;
      padding-left: 10px;
    }
  }
  .animation::after {
    content: '';
    display: inline-block;
    margin-left: 5px;
    width: 2px;
    height: 30px;
    animation: blink 1s infinite steps(1, start);
  }
  @keyframes blink {
    0% {
      background-color: white;
    }
    50% {
      background-color: @color-text-secondary;
    }
    100% {
      background-color: white;
    }
  }
  .type-wrap {
    .type-body {
      display: flex;
      flex-wrap: wrap;
      padding: 10px 6px 0 6px;
      height: 140px;
      .type-item {
        width: calc(100% / 6);
        height: 50%;
        padding: 10px 0;
        border: none;
        border-radius: 4px;
        .icon-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          margin-bottom: 4px;
          .type-icon {
            color: @color-text-caption;
            font-size: 22px;
          }
        }
        .expense {
          &.active {
            background-color: @primary;
            .type-icon {
              color: #fff;
            }
          }
        }
        .income {
          &.active {
            background-color: @text-warning;
            .type-icon {
              color: #fff;
            }
          }
        }
      }
    }
  }
  .remark {
    .van-cell {
      padding: 0;
    }
    padding: 14px 20px;
  }
  .van-number-keyboard {
    position: unset;
  }
}
</style>
<style lang="less">
@import url('@/config/custom.less');
.add-wrap {
  .van-field__label {
    width: 30px;
  }
  .van-field__body {
    position: relative;
  }
  .van-field__clear {
    position: absolute;
    right: 8%;
  }
  .van-field__word-limit {
    position: absolute;
    top: 0;
    right: 0;
  }
  // 初始化确认键颜色
  .van-key--blue {
    background: @primary;
  }
  .type-item {
    .van-button__text {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
