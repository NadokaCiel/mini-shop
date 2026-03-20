import type {
  QueryMenuCategoryListRequest,
  QueryMenuCategoryListResponse,
  QueryMenuIndexDataRequest,
  QueryMenuIndexDataResponse,
  QueryMenuSpuListByCategoryRequest,
  QueryMenuSpuListByCategoryResponse,
} from './types'

import { defineApiType } from '@/api/core/contract'
import menuCategoryListResponseSchema from '@/api/schemas/menu-category-list.response.schema.json'
import menuIndexResponseSchema from '@/api/schemas/menu-index.response.schema.json'
import menuSpuListByCategoryResponseSchema from '@/api/schemas/menu-spu-list-by-category.response.schema.json'

export const queryMenuCategoryListContract = defineApiType<QueryMenuCategoryListRequest, QueryMenuCategoryListResponse>({
  name: 'menu.queryMenuCategoryList',
  path: '/menu/category/list',
  responseShape: menuCategoryListResponseSchema,
})

export const queryMenuSpuListByCategoryContract = defineApiType<QueryMenuSpuListByCategoryRequest, QueryMenuSpuListByCategoryResponse>({
  name: 'menu.queryMenuSpuListByCategory',
  path: '/menu/spu/list/by-category',
  responseShape: menuSpuListByCategoryResponseSchema,
})

export const queryMenuIndexDataContract = defineApiType<QueryMenuIndexDataRequest, QueryMenuIndexDataResponse>({
  name: 'menu.queryMenuIndexData',
  path: '/menu/index',
  responseShape: menuIndexResponseSchema,
})
