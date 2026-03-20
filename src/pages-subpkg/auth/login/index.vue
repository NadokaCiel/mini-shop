<script setup lang="ts">
import { ref } from 'vue'

import { authApi } from '@/api'
import { ROUTE_PATH } from '@/router/route-map'
import { useAuthStore } from '@/stores/auth'

const username = ref('demo')
const password = ref('123456')
const authStore = useAuthStore()

function resolveRedirect() {
  const pages = getCurrentPages()
  const current = pages.at(-1) as { options?: Record<string, string> } | undefined
  const redirect = decodeURIComponent(current?.options?.redirect || '')
  if (redirect) {
    return redirect
  }
  return ROUTE_PATH.tabMine
}

async function handleLogin() {
  const [result, _typeDeclaration] = await authApi.login({
    username: username.value,
    password: password.value,
  })
  if (!result.isOk) {
    uni.showModal({
      title: '登录失败',
      content: result.getMsg(),
      showCancel: false,
    })
    return
  }
  const loginData = result.getData()
  if (!loginData) {
    return
  }
  authStore.setSession(loginData.token, loginData.user)
  const nextPath = resolveRedirect()

  if (nextPath.startsWith('/pages/tabbar/')) {
    uni.switchTab({ url: nextPath })
    return
  }

  uni.redirectTo({ url: nextPath })
}
</script>

<template>
  <view class="page">
    <view class="title">
      登录
    </view>
    <input v-model="username" class="input" placeholder="用户名">
    <input v-model="password" class="input" placeholder="密码" password>
    <button type="primary" @click="handleLogin">
      登录并继续
    </button>
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 40rpx 32rpx;
}

.title {
  margin-bottom: 28rpx;
  font-size: 40rpx;
  font-weight: 700;
}

.input {
  height: 80rpx;
  margin-bottom: 16rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background: #fff;
}
</style>
