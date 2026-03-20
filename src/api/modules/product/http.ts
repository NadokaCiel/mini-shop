import type {
  CreateCartItemRequest,
  QuerySkuStockRequest,
  QuerySpuDetailRequest,
  QuerySpuListRequest,
  RemoveCartItemRequest,
  UpdateCartItemRequest,
  ValidateCartForCheckoutRequest,
} from './types'

import { get, post } from '@/api/core/http-client'

import {
  createCartItemContract,
  queryCartContract,
  queryCategoryListContract,
  querySkuStockContract,
  querySpuDetailContract,
  querySpuListContract,
  removeCartItemContract,
  updateCartItemContract,
  validateCartForCheckoutContract,
} from './contracts'

export function queryCategoryList() {
  return get(queryCategoryListContract)
}

export function querySpuList(payload: QuerySpuListRequest) {
  return post(querySpuListContract, payload, {
    retry: 1,
  })
}

export function querySpuDetail(payload: QuerySpuDetailRequest) {
  return get(querySpuDetailContract, {
    data: payload,
  })
}

export function querySkuStock(payload: QuerySkuStockRequest) {
  return post(querySkuStockContract, payload)
}

export function createCartItem(payload: CreateCartItemRequest) {
  return post(createCartItemContract, payload)
}

export function updateCartItem(payload: UpdateCartItemRequest) {
  return post(updateCartItemContract, payload)
}

export function removeCartItem(payload: RemoveCartItemRequest) {
  return post(removeCartItemContract, payload)
}

export function queryCart() {
  return get(queryCartContract)
}

export function validateCartForCheckout(payload: ValidateCartForCheckoutRequest) {
  return post(validateCartForCheckoutContract, payload)
}

// 兼容历史调用，后续统一迁移到 querySpuList
export function getProductList(payload: QuerySpuListRequest) {
  return querySpuList(payload)
}
