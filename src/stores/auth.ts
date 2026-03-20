import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { STORAGE_KEYS } from '@/constants/storage'

interface UserProfile {
  id: string
  nickname: string
}

interface PersistedAuthState {
  token: string
  profile: UserProfile | null
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')
  const profile = ref<UserProfile | null>(null)
  const isHydrated = ref(false)
  const isLoggedIn = computed(() => Boolean(token.value))

  function persist() {
    const payload: PersistedAuthState = {
      token: token.value,
      profile: profile.value,
    }
    uni.setStorageSync(STORAGE_KEYS.auth, payload)
  }

  function hydrate() {
    const cache = uni.getStorageSync(STORAGE_KEYS.auth) as PersistedAuthState | undefined
    if (cache?.token) {
      token.value = cache.token
      profile.value = cache.profile || null
    }
    isHydrated.value = true
  }

  function setSession(nextToken: string, nextProfile?: UserProfile | null) {
    token.value = nextToken
    profile.value = nextProfile || null
    persist()
  }

  function updateProfile(nextProfile: UserProfile) {
    profile.value = nextProfile
    persist()
  }

  function clearSession() {
    token.value = ''
    profile.value = null
    uni.removeStorageSync(STORAGE_KEYS.auth)
  }

  return {
    token,
    profile,
    isHydrated,
    isLoggedIn,
    hydrate,
    setSession,
    updateProfile,
    clearSession,
  }
})
