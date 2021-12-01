<template>
  <van-popup
    v-model:show="isShowDate"
    position="bottom"
    round
    :style="{ height: '46%' }"
  >
    <van-datetime-picker
      v-model="selectedDate"
      type="year-month"
      title="选择年月"
      :min-date="minDate"
      :max-date="maxDate"
      :formatter="formatter"
      @confirm="selectDate"
      @cancel="isShowDate = false"
      @change="changeDate"
    />
  </van-popup>
</template>

<script lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
export default {
  emits: ['select-date'],
  setup(props, ctx) {
    const minDate = ref(new Date(2015, 0, 1))
    const maxDate = ref(new Date())
    const isShowDate = ref(false)
    const selectedDate = ref(new Date())

    const selectDate = (item: Date) => {
      selectedDate.value = item
      isShowDate.value = false
      ctx.emit('select-date', dayjs(item).format('YYYY-MM'))
    }

    const formatter = (type: string, val: string) => {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      }
      return val
    }

    const changeDate = () => {}

    return {
      minDate,
      maxDate,
      isShowDate,
      selectedDate,
      selectDate,
      formatter,
      changeDate
    }
  }
}
</script>
