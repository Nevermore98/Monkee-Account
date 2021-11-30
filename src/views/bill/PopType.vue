<template>
  <van-popup v-model:show="isShowType" position="bottom" round>
    <div class="pop">
      <div class="header van-hairline--bottom">
        请选择类型
        <van-icon name="cross" class="cross" @click="isShowType = false" />
      </div>
      <div class="content">
        <div
          @click="selectType({ id: 0, name: '全部类型' })"
          class="type-item"
          :class="{ active: active === 0 }"
        >全部类型</div>

        <div class="title">支出</div>
        <div class="expense-wrap">
          <p
            @click="selectType(item)"
            class="type-item"
            :class="{ active: active === item.id }"
            v-for="item in expenseTypes"
            :key="item"
          >{{ item.name }}</p>
        </div>

        <div class="title">收入</div>
        <div class="income-wrap">
          <p
            class="type-item"
            @click="selectType(item)"
            :class="{ active: active == item.id }"
            v-for="item in incomeTypes"
            :key="item"
          >{{ item.name }}</p>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs, PropType, computed } from 'vue'
import axios from '@/utils/axios'

import type { BillType } from '@/api/bill'
type BillList = BillType[]

export default {
  emits: ['select-type'],
  setup(props, ctx) {
    const state = reactive({
      active: 0,
      isShowType: false,
      expenseTypes: [],
      incomeTypes: []
    })
    onMounted(async () => {
      const { data: { list } } = await axios.get('/type/list')
      state.expenseTypes = list.filter(i => i.type === '1')
      state.incomeTypes = list.filter(i => i.type === '2')
    })

    const selectType = (item: BillType) => {
      state.active = item.id
      state.isShowType = false
      ctx.emit('select-type', item)
    }

    return {
      ...toRefs(state),
      selectType,
    }
  }
}
</script>

<style lang="less" scoped>
@import url("@/config/custom.less");
.pop {
  position: relative;
  background-color: #f5f5f5;
  .header {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 56px;
    text-align: center;
    font-size: 14px;
    line-height: 56px;
    color: @color-text-base;
    background-color: #fff;
    .cross {
      position: absolute;
      left: 10px;
      top: 50%;
      font-size: 20px;
      transform: translateY(-50%);
      color: @color-text-secondary;
    }
  }
  .content {
    padding: 20px;

    .type-item {
      width: calc(~"(100% - 20px) / 3");
      text-align: center;
      padding: 12px 0;
      margin-bottom: 10px;
      background-color: #fff;
      font-size: 16px;
    }
    .all {
      display: inline-block;
      padding: 12px 20px;
      font-size: 16px;
      color: @color-text-base;
      background-color: #fff;
    }
    .title {
      color: @color-text-caption;
      margin: 10px 0;
      font-size: 14px;
    }
    .expense-wrap,
    .income-wrap {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .active {
      background-color: @primary!important;
      color: #fff;
    }
  }
}
</style>


