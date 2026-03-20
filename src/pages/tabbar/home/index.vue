<script setup lang="ts">
import { getActivityHttp } from '@/api'
import { ROUTE_PATH } from '@/router/route-map'

async function handlePing() {
  const [result, _typeDeclaration] = await getActivityHttp().queryActivityHome({
    activitySn: 'ACT_20260320',
  })
  if (!result.isOk) {
    uni.showModal({
      title: '提示',
      content: result.getMsg(),
      showCancel: false,
    })
    return
  }
  uni.showToast({
    title: `活动页加载成功：${result.getData()?.activityName || ''}`,
    icon: 'none',
  })
}

function goProductDetail() {
  uni.navigateTo({
    url: `${ROUTE_PATH.productDetail}?id=sku_1001`,
  })
}
</script>

<template>
  <view class="page">
    <view class="title">
      Mini Shop
    </view>
    <button class="btn" type="primary" @click="handlePing">
      活动首页接口测试
    </button>
    <button class="btn" @click="goProductDetail">
      打开商品详情（分包页）
    </button>
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 48rpx 32rpx;
  box-sizing: border-box;
}

.title {
  margin-bottom: 24rpx;
  font-size: 44rpx;
  font-weight: 700;
}

.btn {
  margin-bottom: 20rpx;
}
</style>
