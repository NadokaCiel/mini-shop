import type { QueryActivityHomeRequest } from './types'

import { post } from '@/api/core/http-client'
import { queryActivityHomeContract } from './contracts'

export function queryActivityHome(payload: QueryActivityHomeRequest) {
  return post(queryActivityHomeContract, payload, {
    retry: 1,
  })
}
