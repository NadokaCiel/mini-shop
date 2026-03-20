import { get } from '@/api/core/http-client'

import { healthContract } from './contracts'

export function getHealthStatus() {
  return get(healthContract, {
    retry: 1,
  })
}
