import { ref } from 'vue'
import { Toast } from 'vant'

// 目前还不会使用 hook
const useCalculator = (inputValue: '.' | number) => {
  const billAmount = ref('')
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
    if (billAmount.value.length >= 6 && billAmount.value.indexOf('.') === -1) {
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
export default useCalculator
