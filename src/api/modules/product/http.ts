import type { ProductListRequest } from './types'

import { get } from '@/api/core/http-client'
import { productListContract } from './contracts'

export function getProductList(payload: ProductListRequest = {}) {
  return get(productListContract, {
    data: payload,
    retry: 1,
  })
}
