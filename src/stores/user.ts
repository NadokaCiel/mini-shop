import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const nickname = ref('开发者')

  const setNickname = (value: string) => {
    nickname.value = value
  }

  return {
    nickname,
    setNickname,
  }
})
