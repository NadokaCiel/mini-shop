import type { HealthRequest, HealthResponse } from './types'

import { defineApiType } from '@/api/core/contract'

export const healthContract = defineApiType<HealthRequest, HealthResponse>({
  name: 'common.health',
  path: '/health',
})
