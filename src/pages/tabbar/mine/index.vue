<script setup lang="ts">
import { computed } from 'vue'

import { authApi } from '@/api'
import { ROUTE_PATH } from '@/router/route-map'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const nickname = computed(() => authStore.profile?.nickname || '未登录用户')

async function handleLogout() {
  const [result] = await authApi.logout()
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
  <view class="page">
    <view class="title">
      个人中心
    </view>
    <view class="desc">
      当前用户：{{ nickname }}
    </view>
    <button type="warn" @click="handleLogout">
      退出登录
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
}
</style>
