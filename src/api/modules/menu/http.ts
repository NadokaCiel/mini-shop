import type {
  QueryMenuCategoryListRequest,
  QueryMenuIndexDataRequest,
  QueryMenuSpuListByCategoryRequest,
} from './types'

import { get, post } from '@/api/core/http-client'

import {
  queryMenuCategoryListContract,
  queryMenuIndexDataContract,
  queryMenuSpuListByCategoryContract,
} from './contracts'

export function queryMenuCategoryList(payload: QueryMenuCategoryListRequest) {
  return get(queryMenuCategoryListContract, {
    data: payload,
  })
}

export function queryMenuSpuListByCategory(payload: QueryMenuSpuListByCategoryRequest) {
  return post(queryMenuSpuListByCategoryContract, payload)
}

export function queryMenuIndexData(payload: QueryMenuIndexDataRequest) {
  return get(queryMenuIndexDataContract, {
    data: payload,
  })
}
