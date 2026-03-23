<script setup lang="ts">
import { ROUTE_PATH } from '@/router/route-map'

function goOrderList() {
  uni.navigateTo({
    url: ROUTE_PATH.orderList,
  })
}
</script>

<template>
  <view class="min-h-100vh px-32rpx py-32rpx">
    <view class="mb-20rpx text-36rpx font-600">
      购物车
    </view>
    <view class="mb-24rpx text-gray-500">
      此页已设置 requiresAuth，未登录会被路由守卫拦截。
    </view>
    <button type="primary" @click="goOrderList">
      查看订单列表（分包）
    </button>
  </view>
</template>
