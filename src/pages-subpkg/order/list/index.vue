<script setup lang="ts">
const orders = [
  { id: 'o_1001', amount: 199, status: '待发货' },
  { id: 'o_1002', amount: 299, status: '已完成' },
]
</script>

<template>
  <view class="page">
    <view class="title">
      订单列表
    </view>
    <view v-for="item in orders" :key="item.id" class="order-item">
      订单 {{ item.id }} - ¥{{ item.amount }} - {{ item.status }}
    </view>
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 32rpx;
}

.title {
  margin-bottom: 24rpx;
  font-size: 36rpx;
  font-weight: 600;
}

.order-item {
  margin-bottom: 16rpx;
  padding: 18rpx;
  border-radius: 12rpx;
  background: #fff;
}
</style>
