<script setup lang="ts">
import { ROUTE_PATH } from '@/router/route-map'

function goOrderList() {
  uni.navigateTo({
    url: ROUTE_PATH.orderList,
  })
}
</script>

<template>
  <view class="page">
    <view class="title">
      购物车
    </view>
    <view class="desc">
      此页已设置 requiresAuth，未登录会被路由守卫拦截。
    </view>
    <button type="primary" @click="goOrderList">
      查看订单列表（分包）
    </button>
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 32rpx;
}

.title {
  margin-bottom: 20rpx;
  font-size: 36rpx;
  font-weight: 600;
}

.desc {
  margin-bottom: 24rpx;
  color: #6b7280;
}
</style>
