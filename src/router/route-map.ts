export const ROUTE_PATH = {
  tabHome: '/pages/tabbar/home/index',
  tabCategory: '/pages/tabbar/category/index',
  tabCart: '/pages/tabbar/cart/index',
  tabMine: '/pages/tabbar/mine/index',
  login: '/pages-subpkg/auth/login/index',
  orderList: '/pages-subpkg/order/list/index',
  productDetail: '/pages-subpkg/product/detail/index',
} as const

interface RouteMeta {
  requiresAuth?: boolean
  guestOnly?: boolean
}

export const ROUTE_META: Record<string, RouteMeta> = {
  [ROUTE_PATH.tabHome]: {},
  [ROUTE_PATH.tabCategory]: {},
  [ROUTE_PATH.tabCart]: { requiresAuth: true },
  [ROUTE_PATH.tabMine]: { requiresAuth: true },
  [ROUTE_PATH.login]: { guestOnly: true },
  [ROUTE_PATH.orderList]: { requiresAuth: true },
  [ROUTE_PATH.productDetail]: {},
}
