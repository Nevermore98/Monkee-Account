<template>
  <van-popup v-model:show="isShowDate" position="bottom" round :style="{ height: '46%' }">
    <van-datetime-picker
      v-model="currentDate"
      type="year-month"
      title="选择年月"
      :min-date="minDate"
      :max-date="maxDate"
      :formatter="formatter"
      @confirm="selectDate"
      @cancel="toggle"
    />
  </van-popup>
</template>

<script lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
export default {
  emits: ['select-date'],
  setup(props, ctx) {
    const minDate = ref(new Date(2015, 0, 1))
    const maxDate = ref(new Date())
    const isShowDate = ref(false)
    const currentDate = ref(new Date())

    const toggle = () => {
      isShowDate.value = !isShowDate.value
    }

    const selectDate = (item: Date) => {
      currentDate.value = item
      isShowDate.value = false
      ctx.emit("select-date", dayjs(item).format("YYYY-MM"));
      console.log('选择日期：', dayjs(item).format("YYYY-MM"))
    };

    const formatter = (type: string, val: string) => {
      if (type === "year") {
        return `${val}年`
      } else if (type === "month") {
        return `${val}月`
      }
      return val
    };

    return {
      minDate, maxDate,
      isShowDate,
      currentDate,
      toggle,
      selectDate,
      formatter,
    };
  },
};
</script>
