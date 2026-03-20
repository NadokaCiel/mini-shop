import type { LoginRequest, LoginResponse, LogoutRequest, LogoutResponse } from './types'

import { defineApiType } from '@/api/core/contract'

export const loginContract = defineApiType<LoginRequest, LoginResponse>({
  name: 'auth.login',
  path: '/auth/login',
})

export const logoutContract = defineApiType<LogoutRequest, LogoutResponse>({
  name: 'auth.logout',
  path: '/auth/logout',
})
