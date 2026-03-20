import type { LoginRequest, LogoutRequest } from './types'

import { post } from '@/api/core/http-client'
import { loginContract, logoutContract } from './contracts'

export function login(payload: LoginRequest) {
  return post(loginContract, payload, {
    skipAuth: true,
  })
}

export function logout(payload: LogoutRequest = {}) {
  return post(logoutContract, payload)
}
