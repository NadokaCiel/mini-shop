<script setup lang="ts">
import { computed } from 'vue'

import { authApi } from '@/api'
import { ROUTE_PATH } from '@/router/route-map'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const nickname = computed(() => authStore.profile?.nickname || '未登录用户')

async function handleLogout() {
  const result = await authApi.logout()
  if (!result.isOk) {
    uni.showToast({
      title: result.getMsg(),
      icon: 'none',
    })
  }
  authStore.clearSession()
  uni.switchTab({ url: ROUTE_PATH.tabHome })
}
</script>

<template>
  <view class="min-h-100vh px-32rpx py-32rpx">
    <view class="mb-20rpx text-36rpx font-600">
      个人中心
    </view>
    <view class="mb-24rpx">
      当前用户：{{ nickname }}
    </view>
    <button type="warn" @click="handleLogout">
      退出登录
    </button>
  </view>
</template>
