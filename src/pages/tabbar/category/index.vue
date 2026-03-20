<script setup lang="ts">
import { ref } from 'vue'

import { productApi } from '@/api'

const loading = ref(false)
const products = ref<productApi.ProductItem[]>([])

async function fetchProducts() {
  loading.value = true
  const [result] = await productApi.getProductList({
    pageNum: 1,
    pageSize: 20,
  })
  if (!result.isOk) {
    products.value = [
      { id: 'sku_1001', title: '演示商品 A', price: 199 },
      { id: 'sku_1002', title: '演示商品 B', price: 299 },
    ]
    loading.value = false
    return
  }
  products.value = result.getData() || []
  loading.value = false
}

fetchProducts()
</script>

<template>
  <view class="page">
    <view class="title">
      商品分类
    </view>
    <view v-if="loading">
      加载中...
    </view>
    <view v-else>
      <view v-for="item in products" :key="item.id" class="product-item">
        {{ item.title }} - ¥{{ item.price }}
      </view>
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

.product-item {
  margin-bottom: 16rpx;
  padding: 20rpx;
  border-radius: 12rpx;
  background: #fff;
}
</style>
