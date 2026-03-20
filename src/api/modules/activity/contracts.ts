import type { QueryActivityHomeRequest, QueryActivityHomeResponse } from './types'
import { defineApiType } from '@/api/core/contract'
import activityHomeRequestSchema from '@/api/schemas/activity-home.request.schema.json'

import activityHomeResponseSchema from '@/api/schemas/activity-home.response.schema.json'

export const queryActivityHomeContract = defineApiType<QueryActivityHomeRequest, QueryActivityHomeResponse>({
  name: 'activity.queryActivityHome',
  path: '/activity/home',
  requestShape: activityHomeRequestSchema,
  responseShape: activityHomeResponseSchema,
})
