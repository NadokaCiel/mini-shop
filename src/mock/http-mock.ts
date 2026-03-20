import type { HttpResponse, RequestOptions } from '@/api/core/types'

interface MockSpuItem {
  spuId: string
  title: string
  subTitle: string
  basePrice: number
  hasSku: boolean
  coverUrl: string
  status: 'on' | 'off'
  menuTags: string[]
}

interface MockCartItem {
  cartItemId: string
  spuId: string
  skuId: string
  quantity: number
  unitFinalPrice: number
  lineAmount: number
  spuSnapshot: {
    title: string
    subTitle: string
    coverUrl: string
  }
  skuSnapshot: {
    skuName: string
    priceDelta: number
  }
  selectedAttributes: Array<{
    groupName: string
    itemName: string
    priceDelta: number
  }>
  selectedToppings: Array<{
    name: string
    priceDelta: number
  }>
}

type MockResolver = (options: RequestOptions<unknown>) => HttpResponse<unknown>

const mockCategories = [
  { categoryId: 'cat_hot', categoryName: '热销', sort: 1 },
  { categoryId: 'cat_new', categoryName: '新品', sort: 2 },
  { categoryId: 'cat_coffee', categoryName: '咖啡', sort: 3 },
  { categoryId: 'cat_non_coffee', categoryName: '非咖', sort: 4 },
  { categoryId: 'cat_snack', categoryName: '甜品', sort: 5 },
  { categoryId: 'cat_peripheral', categoryName: '周边', sort: 6 },
]

const mockSpuMap: Record<string, MockSpuItem[]> = {
  cat_hot: [
    {
      spuId: 'spu_latte_vanilla',
      title: '香草拿铁',
      subTitle: '奶香顺滑',
      basePrice: 18,
      hasSku: true,
      coverUrl: '',
      status: 'on',
      menuTags: ['hot', 'recommend'],
    },
    {
      spuId: 'spu_mint_tea',
      title: '薄荷轻体果蔬茶',
      subTitle: '清爽低负担',
      basePrice: 22,
      hasSku: false,
      coverUrl: '',
      status: 'on',
      menuTags: ['seasonal'],
    },
  ],
  cat_new: [
    {
      spuId: 'spu_dragon_well',
      title: '钱塘龙井拿铁',
      subTitle: '龙井清香与奶香融合',
      basePrice: 21,
      hasSku: true,
      coverUrl: '',
      status: 'on',
      menuTags: ['new'],
    },
  ],
  cat_coffee: [
    {
      spuId: 'spu_latte_vanilla',
      title: '香草拿铁',
      subTitle: '奶香顺滑',
      basePrice: 18,
      hasSku: true,
      coverUrl: '',
      status: 'on',
      menuTags: ['classic'],
    },
    {
      spuId: 'spu_americano',
      title: '美式咖啡',
      subTitle: '清爽回甘',
      basePrice: 15,
      hasSku: true,
      coverUrl: '',
      status: 'on',
      menuTags: ['classic'],
    },
  ],
  cat_non_coffee: [
    {
      spuId: 'spu_mint_tea',
      title: '薄荷轻体果蔬茶',
      subTitle: '清爽低负担',
      basePrice: 22,
      hasSku: false,
      coverUrl: '',
      status: 'on',
      menuTags: ['health'],
    },
  ],
  cat_snack: [
    {
      spuId: 'spu_croissant',
      title: '黄油可颂',
      subTitle: '酥脆香甜',
      basePrice: 12,
      hasSku: false,
      coverUrl: '',
      status: 'on',
      menuTags: ['snack'],
    },
  ],
  cat_peripheral: [
    {
      spuId: 'spu_mug',
      title: '联名马克杯',
      subTitle: '限量周边',
      basePrice: 59,
      hasSku: false,
      coverUrl: '',
      status: 'on',
      menuTags: ['peripheral'],
    },
  ],
}

const mockSpuDetailMap = {
  spu_latte_vanilla: {
    availableToppings: [
      { name: '奶盖', priceDelta: 2, sort: 1, status: 'on', toppingId: 'tp_cream' },
      { name: '燕麦奶', priceDelta: 3, sort: 2, status: 'on', toppingId: 'tp_oat' },
    ],
    attributeGroups: [
      {
        groupId: 'g_temp',
        groupName: '温度',
        items: [
          { groupId: 'g_temp', isDefault: true, itemId: 'hot', itemName: '热', priceDelta: 0, sort: 1 },
          { groupId: 'g_temp', isDefault: false, itemId: 'ice', itemName: '冰', priceDelta: 0, sort: 2 },
        ],
        multiSelect: false,
        required: true,
        sort: 1,
        spuId: 'spu_latte_vanilla',
      },
      {
        groupId: 'g_sugar',
        groupName: '甜度',
        items: [
          { groupId: 'g_sugar', isDefault: true, itemId: 'full', itemName: '全糖', priceDelta: 0, sort: 1 },
          { groupId: 'g_sugar', isDefault: false, itemId: 'half', itemName: '半糖', priceDelta: 0, sort: 2 },
          { groupId: 'g_sugar', isDefault: false, itemId: 'zero', itemName: '无糖', priceDelta: 0, sort: 3 },
        ],
        multiSelect: false,
        required: true,
        sort: 2,
        spuId: 'spu_latte_vanilla',
      },
    ],
    basePrice: 18,
    coverUrl: '',
    hasSku: true,
    skuList: [
      { priceDelta: 0, skuId: 'sku_latte_m', skuName: '中杯', spuId: 'spu_latte_vanilla', status: 'on', stockCount: 88 },
      { priceDelta: 3, skuId: 'sku_latte_l', skuName: '大杯', spuId: 'spu_latte_vanilla', status: 'on', stockCount: 88 },
    ],
    spuId: 'spu_latte_vanilla',
    status: 'on',
    subTitle: '奶香顺滑',
    title: '香草拿铁',
  },
}

let cartSequence = 1000
const mockCartItems: MockCartItem[] = []

function ok<T>(data: T, message = 'ok'): HttpResponse<T> {
  return {
    code: 0,
    data,
    message,
  }
}

function fail(message: string, code = 500): HttpResponse<null> {
  return {
    code,
    data: null,
    message,
  }
}

function sumCart(items: MockCartItem[]) {
  return {
    cartTotalAmount: items.reduce((sum, item) => sum + item.lineAmount, 0),
    cartTotalCount: items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

function resolveQuerySpuList(options: RequestOptions<unknown>) {
  const payload = (options.data || {}) as { categoryId?: string, pageNum?: number, pageSize?: number }
  const source = mockSpuMap[payload.categoryId || 'cat_hot'] || []
  const pageNum = payload.pageNum || 1
  const pageSize = payload.pageSize || 20
  const start = (pageNum - 1) * pageSize
  return ok({
    list: source.slice(start, start + pageSize),
    total: source.length,
  })
}

function resolveQuerySpuDetail(options: RequestOptions<unknown>) {
  const payload = (options.data || {}) as { spuId?: string }
  const detail = payload.spuId ? mockSpuDetailMap[payload.spuId as keyof typeof mockSpuDetailMap] : undefined
  if (!detail) {
    return fail('商品详情不存在', 404)
  }
  return ok(detail)
}

function resolveCreateCartItem(options: RequestOptions<unknown>) {
  const payload = options.data as {
    quantity: number
    remark?: string
    selectedAttributeItems?: Array<{ groupId: string, itemId: string }>
    selectedToppingIds?: string[]
    skuId: string
    spuId: string
  }

  const detail = mockSpuDetailMap[payload.spuId as keyof typeof mockSpuDetailMap]
  if (!detail) {
    return fail('商品不存在', 404)
  }

  const sku = detail.skuList.find(item => item.skuId === payload.skuId) || detail.skuList[0]
  const quantity = payload.quantity || 1
  const unitFinalPrice = detail.basePrice + sku.priceDelta

  const cartItem: MockCartItem = {
    cartItemId: `ci_${cartSequence++}`,
    lineAmount: unitFinalPrice * quantity,
    quantity,
    selectedAttributes: (payload.selectedAttributeItems || []).map(item => ({
      groupName: item.groupId,
      itemName: item.itemId,
      priceDelta: 0,
    })),
    selectedToppings: (payload.selectedToppingIds || []).map(id => ({
      name: id,
      priceDelta: 0,
    })),
    skuId: sku.skuId,
    skuSnapshot: {
      priceDelta: sku.priceDelta,
      skuName: sku.skuName,
    },
    spuId: detail.spuId,
    spuSnapshot: {
      coverUrl: detail.coverUrl,
      subTitle: detail.subTitle,
      title: detail.title,
    },
    unitFinalPrice,
  }
  mockCartItems.push(cartItem)
  const summary = sumCart(mockCartItems)

  return ok({
    cartItemId: cartItem.cartItemId,
    cartTotalAmount: summary.cartTotalAmount,
    cartTotalCount: summary.cartTotalCount,
  })
}

function resolveUpdateCartItem(options: RequestOptions<unknown>) {
  const payload = options.data as { cartItemId: string, quantity: number }
  const target = mockCartItems.find(item => item.cartItemId === payload.cartItemId)
  if (!target) {
    return fail('购物车项不存在', 404)
  }
  target.quantity = payload.quantity
  target.lineAmount = target.unitFinalPrice * target.quantity
  const summary = sumCart(mockCartItems)
  return ok({
    cartItemId: target.cartItemId,
    cartTotalAmount: summary.cartTotalAmount,
    cartTotalCount: summary.cartTotalCount,
  })
}

function resolveRemoveCartItem(options: RequestOptions<unknown>) {
  const payload = options.data as { cartItemIds: string[] }
  const ids = new Set(payload.cartItemIds || [])
  const before = mockCartItems.length
  for (let index = mockCartItems.length - 1; index >= 0; index--) {
    if (ids.has(mockCartItems[index].cartItemId)) {
      mockCartItems.splice(index, 1)
    }
  }
  const summary = sumCart(mockCartItems)
  return ok({
    cartTotalAmount: summary.cartTotalAmount,
    cartTotalCount: summary.cartTotalCount,
    removedCount: before - mockCartItems.length,
  })
}

function resolveQueryCart() {
  const summary = sumCart(mockCartItems)
  return ok({
    cartTotalAmount: summary.cartTotalAmount,
    cartTotalCount: summary.cartTotalCount,
    items: mockCartItems,
    storeId: 'store_001',
  })
}

function resolveValidateCartForCheckout(options: RequestOptions<unknown>) {
  const payload = options.data as { cartItemIds: string[] }
  if (!payload.cartItemIds?.length) {
    return ok({
      invalidReasons: ['未选择购物车商品'],
      isValid: false,
      priceDiffItems: [],
    })
  }
  return ok({
    invalidReasons: [],
    isValid: true,
    priceDiffItems: [],
  })
}

function resolveQuerySkuStock(options: RequestOptions<unknown>) {
  const payload = options.data as { skuIds: string[] }
  return ok({
    list: (payload.skuIds || []).map(skuId => ({
      skuId,
      stockCount: 99,
    })),
  })
}

const mockResolvers: Record<string, MockResolver> = {
  'GET /menu/category/list': () => ok(mockCategories),
  'GET /menu/index': () =>
    ok({
      categories: mockCategories,
      defaultCategoryId: 'cat_hot',
      defaultCategorySpuList: mockSpuMap.cat_hot,
      storeId: 'store_001',
    }),
  'GET /product/category/list': () => ok(mockCategories),
  'GET /product/spu/detail': resolveQuerySpuDetail,
  'GET /cart/query': resolveQueryCart,
  'POST /menu/spu/list/by-category': resolveQuerySpuList,
  'POST /product/spu/list': resolveQuerySpuList,
  'POST /product/sku/stock/query': resolveQuerySkuStock,
  'POST /cart/checkout/validate': resolveValidateCartForCheckout,
  'POST /cart/item/create': resolveCreateCartItem,
  'POST /cart/item/remove': resolveRemoveCartItem,
  'POST /cart/item/update': resolveUpdateCartItem,
}

function createMockKey(method: RequestOptions['method'], url: string) {
  const upperMethod = String(method || 'GET').toUpperCase()
  const path = url.split('?')[0]
  return `${upperMethod} ${path}`
}

export function resolveMockResponse(options: RequestOptions<unknown>) {
  const key = createMockKey(options.method, options.url)
  const resolver = mockResolvers[key]
  if (!resolver) {
    return null
  }
  return resolver(options)
}
