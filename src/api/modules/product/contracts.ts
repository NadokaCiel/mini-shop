import type { ProductItem, ProductListRequest } from './types'
import { defineApiType } from '@/api/core/contract'

import productListResponseSchema from '@/api/schemas/product-list.response.schema.json'

export const productListContract = defineApiType<ProductListRequest, ProductItem[]>({
  name: 'product.list',
  path: '/products',
  responseShape: productListResponseSchema,
})
