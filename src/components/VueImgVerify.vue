<template>
  <div class="verify-canvas">
    <canvas
      ref="verifyCanvasRef"
      :width="width"
      :height="height"
      @click="handleDraw"
    ></canvas>
  </div>
</template>
<script lang="ts">
import { reactive, onMounted, ref, toRefs } from 'vue'
export default {
  setup() {
    const verifyCanvasRef = ref(null)
    const state = reactive({
      pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', // 字符串
      width: 100,
      height: 50,
      verifyCode: ''
    })
    onMounted(() => {
      // 初始化绘制图片验证码
      state.verifyCode = draw()
    })

    // 点击图片重新绘制
    const handleDraw = () => {
      state.verifyCode = draw()
    }

    // 随机数
    const randomNum = (min, max) => {
      return parseInt(Math.random() * (max - min) + min)
    }
    // 随机颜色
    const randomColor = (min, max) => {
      const r = randomNum(min, max)
      const g = randomNum(min, max)
      const b = randomNum(min, max)
      return `rgb(${r},${g},${b})`
    }

    // 绘制验证码
    const draw = () => {
      const ctx = verifyCanvasRef.value.getContext('2d')
      ctx.fillStyle = randomColor(180, 230)
      ctx.fillRect(0, 0, state.width, state.height)
      let verifyCode = ''
      // 随机产生字符串，并且随机旋转
      for (let i = 0; i < 4; i++) {
        // 随机四字验证码
        const text = state.pool[randomNum(0, state.pool.length)]
        verifyCode += text
        // 随机的字体大小
        const fontSize = randomNum(20, 30)
        // 字体随机的旋转角度
        const deg = randomNum(-35, 35)

        ctx.font = fontSize + 'px Simhei'
        ctx.textBaseline = 'top'
        ctx.fillStyle = randomColor(80, 150)

        ctx.save()
        ctx.translate(25 * i + 15, 25)
        ctx.rotate((deg * Math.PI) / 180)
        ctx.fillText(text, -15 + 5, -15)
        ctx.restore()
      }
      // 随机产生5条干扰线
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(randomNum(0, state.width), randomNum(0, state.height))
        ctx.lineTo(randomNum(0, state.width), randomNum(0, state.height))
        ctx.strokeStyle = randomColor(180, 230)
        ctx.closePath()
        ctx.stroke()
      }
      // 6.随机产生50个干扰的小点
      for (let i = 0; i < 50; i++) {
        ctx.beginPath()
        ctx.arc(
          randomNum(0, state.width),
          randomNum(0, state.height),
          1,
          0,
          2 * Math.PI
        )
        ctx.closePath()
        ctx.fillStyle = randomColor(150, 200)
        ctx.fill()
      }
      return verifyCode
    }

    return {
      ...toRefs(state),
      verifyCanvasRef,
      handleDraw
    }
  }
}
</script>
<style lang="less" scoped>
.verify-canvas {
  height: 50px;

  canvas {
    cursor: pointer;
  }
}
</style>
