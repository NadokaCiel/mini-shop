export interface MenuCategoryItem {
  categoryId: string
  categoryName: string
  sort: number
  status?: 'on' | 'off'
}

export interface QueryMenuCategoryListRequest {
  storeId: string
}

export type QueryMenuCategoryListResponse = MenuCategoryItem[]

export interface QueryMenuSpuListByCategoryRequest {
  storeId: string
  categoryId: string
  pageNum?: number
  pageSize?: number
}

export interface MenuSpuListItem {
  spuId: string
  title: string
  subTitle?: string
  basePrice: number
  coverUrl?: string
  hasSku: boolean
  status?: 'on' | 'off'
  menuTags?: string[]
}

export interface QueryMenuSpuListByCategoryResponse {
  total: number
  list: MenuSpuListItem[]
}

export interface QueryMenuIndexDataRequest {
  storeId: string
}

export interface QueryMenuIndexDataResponse {
  storeId: string
  categories: MenuCategoryItem[]
  defaultCategoryId: string
  defaultCategorySpuList: MenuSpuListItem[]
}
