import type { UserInfoRequest } from './types'

import { get } from '@/api/core/http-client'
import { userInfoContract } from './contracts'

export function getUserInfo(payload: UserInfoRequest = {}) {
  return get(userInfoContract, {
    data: payload,
  })
}
