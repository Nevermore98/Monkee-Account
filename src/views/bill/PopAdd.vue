<template>
  <van-popup
    v-model:show="isShowAdd"
    position="bottom"
    round
    @closed="clearPopAdd"
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
        <div class="date" @click="isShowAddDate = true">
          <span>{{ formattedDate }}</span>
          <svg class="icon icon-sort-down">
            <use xlink:href="#icon-sort-down" />
          </svg>
        </div>
      </div>
      <!-- 日历选择弹出层 -->
      <van-config-provider :theme-vars="calendarThemeVars">
        <van-calendar
          v-model:show="isShowAddDate"
          :show-confirm="false"
          @confirm="chooseDate"
          :row-height="60"
          :max-date="maxDate"
          :min-date="minDate"
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
          <div
            class="type-item"
            v-for="item in expenseList"
            :key="item.id"
            @click="chooseTypeIcon(item)"
          >
            <span
              :class="{
                'icon-wrap': true,
                expense: true,
                active: selectedType?.id === item.id
              }"
            >
              <svg class="type-icon icon">
                <use v-bind:xlink:href="getHref(item)" />
              </svg>
            </span>
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div class="type-body income-type-body" v-else>
          <div
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
          </div>
        </div>
      </div>
      <!-- 备注输入框 -->
      <div class="remark">
        <van-field v-model="remark" label="备注" placeholder="添加记账备注" />
      </div>

      <!-- 数字键盘 -->
      <van-config-provider :theme-vars="NumberPadThemeVars">
        <van-number-keyboard
          :show="true"
          theme="custom"
          extra-key="."
          close-button-text="确定"
          @delete="handleDelete"
          @input="handleInput"
          @close="addBill"
        />
      </van-config-provider>
    </div>
  </van-popup>
</template>

<script lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import { Icon, Toast } from 'vant'
import axios from 'axios'
import { typeMap } from '@/utils/index'
import { BillType } from '@/api/bill'
// import useCalculator from '@/hooks/useCalculator'

export default {
  emits: ['refresh'],
  setup(props, ctx) {
    // const id = props.detail && props.detail.id // 外部传进来的账单详情 id
    const isShowAdd = ref(false)
    const isShowAddDate = ref(false)
    const payType = ref('expense')
    const selectedDate = ref(new Date())
    const billAmount = ref('')
    const selectedType = ref<BillType>()
    const expenseList = ref([])
    const incomeList = ref([])
    const remark = ref('')
    const numberPadButtonColor = ref('#39be77')

    onMounted(async () => {
      // 拿到请求到的对象里的 data 属性里的 list 属性
      const {
        data: { list }
      } = await axios.get('/type/list')
      expenseList.value = list.filter((i) => i.type == 1)
      incomeList.value = list.filter((i) => i.type == 2)
    })
    // 切换收支类型
    const changeType = (type: string) => {
      payType.value = type
    }
    // 选择收支类型具体图标
    const chooseTypeIcon = (item: BillType) => {
      selectedType.value = item
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
    // 自定义数字键盘主题
    //TODO 根据收支类型动态切换数字键盘确定键颜色
    // watch、函数都不能实现，暂时搁置
    // const getNumberButtonColor = () => {
    //   return payType.value === 'expense' ? '#39be77' : '#ecbe25'
    // }
    // watch(numberPadButtonColor, () => {
    //   numberPadButtonColor.value === 'expense' ? '#39be77' : '#ecbe25'
    // })

    const NumberPadThemeVars = {
      NumberKeyboardButtonBackgroundColor: '#39be77'
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
    // 处理数字键盘输入（暂时还不会抽离成 hook T_T）
    const handleInput = (inputValue: '.' | number) => {
      // 处理数字
      if (inputValue !== '.') {
        // 处理0
        if (inputValue === 0) {
          // 首位为 0，且不包含小数点，则重复输入 0 返回原值不变
          if (
            billAmount.value.substring(0, 1) === '0' &&
            billAmount.value.indexOf('.') === -1
          ) {
            return billAmount.value
          }
        }
        // 处理非零数字
        if (inputValue !== 0) {
          if (
            billAmount.value.substring(0, 1) === '0' &&
            billAmount.value.indexOf('.') === -1
          ) {
            return (billAmount.value = inputValue.toString())
          }
        }
        // 保留小数点前六位
        if (
          billAmount.value.length >= 6 &&
          billAmount.value.indexOf('.') === -1
        ) {
          Toast.fail('输入金额不能大于1,000,000')
          return billAmount.value
        }
        // 保留小数点后两位
        if (
          billAmount.value.includes('.') &&
          billAmount.value.split('.')[1].length >= 2
        ) {
          Toast.fail('仅保留小数点后两位')
          return billAmount.value
        }
        return (billAmount.value += inputValue)
      }
      // 处理小数点
      if (inputValue === '.') {
        // 首位输入小数点，返回 '0.'
        if (billAmount.value.substring(0, 1) === '') {
          return (billAmount.value = '0.')
        }
        // 已存在小数点，则重复输入小数点返回原值不变
        if (billAmount.value.includes('.')) {
          return billAmount.value
        }
        return (billAmount.value += '.')
      }
    }

    const addBill = async () => {
      if (!billAmount.value) {
        Toast.fail('请输入具体金额')
        return
      }
      if (Number(billAmount.value).toFixed() === '0') {
        Toast.fail('输入金额不能为零')
        return
      }
      if (!selectedType.value) {
        Toast.fail('请选择收支类型')
        return
      }

      const params = {
        amount: Number(billAmount.value).toFixed(2), // 金额
        type_id: selectedType.value.id, // 当前消费类型 id
        type_name: selectedType.value.name, // 当前消费类型 name
        date: dayjs(selectedDate.value).unix() * 1000, // 日期
        pay_type: payType.value == 'expense' ? 1 : 2, // 支出或收入
        remark: remark.value || ''
      }
      const result = await axios.post('/bill/add', params)
      // console.log('🚀 ~ addBill ~ result', result)
      // 调完接口之后清空数据
      clearPopAdd()
      Toast.success('添加成功')
      // 向首页发送事件，刷新账单页
      ctx.emit('refresh')
    }

    const handleDelete = () => {
      billAmount.value = billAmount.value.slice(0, billAmount.value.length - 1)
    }

    // 清空添加账单弹出层数据
    const clearPopAdd = () => {
      billAmount.value = ''
      selectedType.value = null
      payType.value = 'expense'
      isShowAdd.value = false
      selectedDate.value = new Date()
      remark.value = ''
    }

    return {
      isShowAdd,
      isShowAddDate,
      payType,
      changeType,
      selectedDate,
      minDate,
      maxDate,
      chooseDate,
      calendarThemeVars,
      NumberPadThemeVars,
      // getNumberButtonColor,
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
      clearPopAdd
    }
  }
}
</script>
<style lang="less" scoped>
@import url('@/config/custom.less');
.add-wrap {
  padding-top: 12px;
  .header {
    padding: 6px 20px;

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
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .type {
      span {
        display: inline-block;
        background: #f5f5f5;
        color: @color-text-caption;
        padding: 4px 10px;
        font-size: 12px;
        border-radius: 8px;
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
    .date {
      display: flex;
      justify-content: center;
      padding: 4px 6px;
      background-color: #f0f0f0;
      border-radius: 20px;
      color: @color-text-base;
      .icon-sort-down {
        margin-left: 2px;
      }
    }
  }
  .numberPad {
    // * {
    //   outline: red 1px solid;
    // }
    padding-bottom: 12px;
    border-bottom: 1px solid #e9e9e9;
    padding: 10px 20px;
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
    padding: 4px 2px;
    .type-body {
      display: flex;
      flex-wrap: wrap;
      .type-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: calc(100% / 6);
        padding: 16px 10px 0 10px;
        // margin: 2px;
        .icon-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          margin-bottom: 5px;
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
    .income-type-body {
      margin-bottom: 68px;
    }
  }
  .remark {
    padding: 0 4px;
  }
  .van-number-keyboard {
    position: unset;
  }
}
</style>
<style lang="less">
@import url('@/config/custom.less');
.van-field__label {
  width: 32px;
}
</style>
