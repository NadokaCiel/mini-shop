export interface ProductCategoryItem {
  categoryId: string
  categoryName: string
  sort: number
}

export interface QueryCategoryListRequest {}

export type QueryCategoryListResponse = ProductCategoryItem[]

export interface QuerySpuListRequest {
  categoryId: string
  pageNum?: number
  pageSize?: number
}

export interface ProductSpuListItem {
  spuId: string
  title: string
  subTitle?: string
  basePrice: number
  hasSku: boolean
  coverUrl?: string
  status?: 'on' | 'off'
  menuTags?: string[]
}

export interface QuerySpuListResponse {
  total: number
  list: ProductSpuListItem[]
}

export interface ProductSkuItem {
  skuId: string
  spuId: string
  skuName: string
  priceDelta: number
  stockCount: number
  status?: 'on' | 'off'
}

export interface ProductAttributeItem {
  itemId: string
  groupId: string
  itemName: string
  priceDelta: number
  isDefault?: boolean
  sort?: number
}

export interface ProductAttributeGroup {
  groupId: string
  spuId: string
  groupName: string
  required: boolean
  multiSelect: boolean
  sort?: number
  items: ProductAttributeItem[]
}

export interface ProductToppingItem {
  toppingId: string
  name: string
  priceDelta: number
  status?: 'on' | 'off'
  sort?: number
}

export interface QuerySpuDetailRequest {
  spuId: string
}

export interface QuerySpuDetailResponse {
  spuId: string
  title: string
  subTitle?: string
  basePrice: number
  coverUrl?: string
  status?: 'on' | 'off'
  hasSku: boolean
  skuList: ProductSkuItem[]
  attributeGroups: ProductAttributeGroup[]
  availableToppings: ProductToppingItem[]
}

export interface QuerySkuStockRequest {
  skuIds: string[]
}

export interface SkuStockItem {
  skuId: string
  stockCount: number
}

export interface QuerySkuStockResponse {
  list: SkuStockItem[]
}

export interface SelectedAttributeItem {
  groupId: string
  itemId: string
}

export interface CreateCartItemRequest {
  spuId: string
  skuId: string
  quantity: number
  selectedAttributeItems: SelectedAttributeItem[]
  selectedToppingIds?: string[]
  remark?: string
}

export interface CreateCartItemResponse {
  cartItemId: string
  cartTotalCount: number
  cartTotalAmount: number
}

export interface UpdateCartItemRequest {
  cartItemId: string
  quantity: number
}

export interface UpdateCartItemResponse {
  cartItemId: string
  cartTotalCount: number
  cartTotalAmount: number
}

export interface RemoveCartItemRequest {
  cartItemIds: string[]
}

export interface RemoveCartItemResponse {
  removedCount: number
  cartTotalCount: number
  cartTotalAmount: number
}

export interface CartSpuSnapshot {
  title: string
  subTitle?: string
  coverUrl?: string
}

export interface CartSkuSnapshot {
  skuName: string
  priceDelta: number
}

export interface CartSelectedAttribute {
  groupName: string
  itemName: string
  priceDelta: number
}

export interface CartSelectedTopping {
  name: string
  priceDelta: number
}

export interface CartItem {
  cartItemId: string
  spuId: string
  skuId: string
  quantity: number
  unitFinalPrice: number
  lineAmount: number
  spuSnapshot: CartSpuSnapshot
  skuSnapshot: CartSkuSnapshot
  selectedAttributes: CartSelectedAttribute[]
  selectedToppings: CartSelectedTopping[]
}

export interface QueryCartRequest {}

export interface QueryCartResponse {
  storeId?: string
  cartTotalCount: number
  cartTotalAmount: number
  items: CartItem[]
}

export interface ValidateCartForCheckoutRequest {
  cartItemIds: string[]
  deliveryType: 'pickup' | 'delivery'
}

export interface ValidateCartForCheckoutResponse {
  isValid: boolean
  invalidReasons: string[]
  priceDiffItems: string[]
}

// 兼容历史调用，保持渐进迁移
export type ProductListRequest = QuerySpuListRequest
export type ProductItem = ProductSpuListItem
