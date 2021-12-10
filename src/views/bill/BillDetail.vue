<template>
  <Header title="账单详情" />
  <!-- <div class="detail" v-if="Object.keys(detail).length"></div> -->
  <div class="detail">
    <div class="card">
      <!-- 收支类型图标和名称 -->
      <div class="type-wrap">
        <span
          :class="{
            expense: detail.pay_type === 1,
            income: detail.pay_type === 2
          }"
          class="icon-wrap"
          ><svg class="icon">
            <use v-bind:xlink:href="getHref(detail)" />
          </svg>
        </span>
        <span class="type-name">{{ detail.type_name || '' }}</span>
      </div>
      <!-- 收支金额 -->
      <div class="amount expense" v-if="detail.pay_type === 1">
        -{{ detail.amount }}
      </div>
      <div class="amount income" v-else>+{{ detail.amount }}</div>
      <!-- 记录时间和备注 -->
      <div class="info">
        <van-field
          label="记录时间"
          :model-value="dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')"
          readonly
        />
        <van-field label="备注" :model-value="detail.remark || '-'" readonly />
      </div>
      <!-- 删除和编辑按钮 -->
      <div class="operation van-hairline--top">
        <span class="van-hairline--right" @click="deleteDetail"
          ><van-icon name="delete" />删除</span
        >
        <span @click="popAddRef.isShowAdd = true"
          ><van-icon name="edit" />编辑</span
        >
      </div>
      <PopAdd
        v-if="detail.id"
        ref="popAddRef"
        :initData="detail"
        @refresh="getDetail"
      />
    </div>
  </div>
  <!-- <div v-else>
    <van-empty image="network" description="暂无该账单数据" />
  </div> -->
</template>
<script lang="ts">
import { onMounted, reactive, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import dayjs from 'dayjs'
import { typeMap } from '@/utils'
import axios from '@/utils/axios'
import { Toast, Dialog } from 'vant'
import { DayBillItem, ReqDetail } from '@/api/bill'
import PopAdd from '@/views/bill/PopAdd.vue'

export default {
  name: 'Detail',
  components: {
    Header,
    PopAdd
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { id } = route.query
    const detail = reactive<ReqDetail>({})
    const popAddRef = ref(null)

    onMounted(async () => {
      getDetail()
    })
    // 获取账单详情
    const getDetail = async () => {
      const { data } = await axios.get(`/bill/detail?id=${id}`)
      console.log(data)
      try {
        Object.assign(detail, data)
      } catch (error) {
        console.log(error)
      }
    }

    // 删除账单详情
    const deleteDetail = () => {
      Dialog.confirm({
        message: '删除后无法恢复，是否删除？'
      })
        .then(async () => {
          const { data } = await axios.post('/bill/delete', { id })
          Toast.success('删除成功')
          setTimeout(() => {
            router.push('/')
          }, 200)
        })
        .catch(() => {})
    }
    // 获取类型对应图标名
    const getHref = (item: DayBillItem) => {
      // 这里与其他 getHref 的不同在于要加问号，尚不明确原因...
      let iconName = typeMap[item.type_id]?.icon
      return `#icon-${iconName}`
    }

    return {
      dayjs,
      detail,
      typeMap,
      deleteDetail,
      getDetail,
      getHref,
      popAddRef
    }
  }
}
</script>
<style lang="less" scoped>
@import url('@/config/custom.less');
.detail {
  height: calc(~'(100% - 46px)');
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 12px 24px 0 24px;
}
.card {
  border-radius: 12px;
  background-color: #fff;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .type-wrap {
    padding: 24px 0 12px 0;
    display: flex;
    align-items: center;

    .icon-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      color: #fff;
      border-radius: 50%;
      text-align: center;
      font-size: 20px;
      margin-right: 8px;
    }
    .type-name {
      font-size: 14px;
    }

    .expense {
      background-color: @primary;
    }
    .income {
      background-color: @text-warning;
    }
  }
  .amount {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
  }
  .info {
    width: 100%;
    font-size: 14px;
    text-align: left;
    // .time {
    //   display: flex;
    //   align-items: center;
    //   justify-content: flex-start;
    //   margin-bottom: 12px;
    //   span:nth-of-type(1) {
    //     flex: 3;
    //     color: @color-text-caption;
    //   }
    //   span:nth-of-type(2) {
    //     flex: 9;
    //   }
    // }
    // .remark {
    //   display: flex;
    //   align-items: center;
    //   justify-content: flex-start;
    //   margin-bottom: 12px;
    //   span:nth-of-type(1) {
    //     flex: 3;
    //     color: @color-text-caption;
    //   }
    //   span:nth-of-type(2) {
    //     flex: 9;
    //     color: @color-text-base;
    //   }
    // }
  }
  .operation {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 16px;
    .van-icon {
      margin-right: 4px;
    }
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      flex: 1;
    }
    span:nth-of-type(1) {
      color: red;
    }
  }
}
</style>
<style lang="less">
.van-cell::after {
  display: none;
}
.van-cell {
  padding: 6px;
}
.van-field__label {
  width: 58px;
  margin-right: 14px;
}
</style>
