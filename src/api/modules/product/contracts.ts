import type {
  CreateCartItemRequest,
  CreateCartItemResponse,
  QueryCartRequest,
  QueryCartResponse,
  QueryCategoryListRequest,
  QueryCategoryListResponse,
  QuerySkuStockRequest,
  QuerySkuStockResponse,
  QuerySpuDetailRequest,
  QuerySpuDetailResponse,
  QuerySpuListRequest,
  QuerySpuListResponse,
  RemoveCartItemRequest,
  RemoveCartItemResponse,
  UpdateCartItemRequest,
  UpdateCartItemResponse,
  ValidateCartForCheckoutRequest,
  ValidateCartForCheckoutResponse,
} from './types'

import { defineApiType } from '@/api/core/contract'
import productCategoryListResponseSchema from '@/api/schemas/product-category-list.response.schema.json'
import productCreateCartItemRequestSchema from '@/api/schemas/product-create-cart-item.request.schema.json'
import productQueryCartResponseSchema from '@/api/schemas/product-query-cart.response.schema.json'
import productSpuDetailResponseSchema from '@/api/schemas/product-spu-detail.response.schema.json'
import productSpuListResponseSchema from '@/api/schemas/product-spu-list.response.schema.json'

export const queryCategoryListContract = defineApiType<QueryCategoryListRequest, QueryCategoryListResponse>({
  name: 'product.queryCategoryList',
  path: '/product/category/list',
  responseShape: productCategoryListResponseSchema,
})

export const querySpuListContract = defineApiType<QuerySpuListRequest, QuerySpuListResponse>({
  name: 'product.querySpuList',
  path: '/product/spu/list',
  responseShape: productSpuListResponseSchema,
})

export const querySpuDetailContract = defineApiType<QuerySpuDetailRequest, QuerySpuDetailResponse>({
  name: 'product.querySpuDetail',
  path: '/product/spu/detail',
  responseShape: productSpuDetailResponseSchema,
})

export const querySkuStockContract = defineApiType<QuerySkuStockRequest, QuerySkuStockResponse>({
  name: 'product.querySkuStock',
  path: '/product/sku/stock/query',
})

export const createCartItemContract = defineApiType<CreateCartItemRequest, CreateCartItemResponse>({
  name: 'product.createCartItem',
  path: '/cart/item/create',
  requestShape: productCreateCartItemRequestSchema,
})

export const updateCartItemContract = defineApiType<UpdateCartItemRequest, UpdateCartItemResponse>({
  name: 'product.updateCartItem',
  path: '/cart/item/update',
})

export const removeCartItemContract = defineApiType<RemoveCartItemRequest, RemoveCartItemResponse>({
  name: 'product.removeCartItem',
  path: '/cart/item/remove',
})

export const queryCartContract = defineApiType<QueryCartRequest, QueryCartResponse>({
  name: 'product.queryCart',
  path: '/cart/query',
  responseShape: productQueryCartResponseSchema,
})

export const validateCartForCheckoutContract = defineApiType<ValidateCartForCheckoutRequest, ValidateCartForCheckoutResponse>({
  name: 'product.validateCartForCheckout',
  path: '/cart/checkout/validate',
})
