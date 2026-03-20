import type { UserInfoRequest, UserInfoResponse } from './types'

import { defineApiType } from '@/api/core/contract'

export const userInfoContract = defineApiType<UserInfoRequest, UserInfoResponse>({
  name: 'user.me',
  path: '/user/me',
})
