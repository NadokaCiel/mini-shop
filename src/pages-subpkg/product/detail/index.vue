<script setup lang="ts">
import { ref } from 'vue'

const productId = ref('')

const pages = getCurrentPages()
const current = pages.at(-1) as { options?: Record<string, string> } | undefined
productId.value = current?.options?.id || 'unknown'
</script>

<template>
  <view class="page">
    <view class="title">
      商品详情
    </view>
    <view class="desc">
      当前商品ID：{{ productId }}
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

.desc {
  color: #6b7280;
}
</style>
