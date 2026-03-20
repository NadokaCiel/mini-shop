export interface QueryActivityHomeRequest {
  activitySn: string
}

interface ActivityBanner {
  bannerId: string
  imageUrl: string
  targetUrl: string
}

interface RecommendGoods {
  productId: string
  productTitle: string
  salePrice: number
  tagList: string[]
}

export interface QueryActivityHomeResponse {
  activityName: string
  bannerList: ActivityBanner[]
  recommendGoods: RecommendGoods[]
}
