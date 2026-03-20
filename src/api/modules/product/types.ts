export interface ProductListRequest {
  pageNum?: number
  pageSize?: number
}

export interface ProductItem {
  id: string
  title: string
  price: number
  coverUrl?: string
  stockCount?: number
}
