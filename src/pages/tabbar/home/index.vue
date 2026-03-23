<script setup lang="ts">
import { getActivityHttp } from '@/api'
import { ROUTE_PATH } from '@/router/route-map'

async function handlePing() {
  const result = await getActivityHttp().queryActivityHome({
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
  <view class="min-h-100vh box-border px-32rpx py-48rpx">
    <view class="mb-24rpx text-44rpx font-700">
      Mini Shop
    </view>
    <button class="mb-20rpx" type="primary" @click="handlePing">
      活动首页接口测试
    </button>
    <button class="mb-20rpx" @click="goProductDetail">
      打开商品详情（分包页）
    </button>
  </view>
</template>
