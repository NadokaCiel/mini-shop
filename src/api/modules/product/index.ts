import {
  createCartItem,
  getProductList,
  queryCart,
  queryCategoryList,
  querySkuStock,
  querySpuDetail,
  querySpuList,
  removeCartItem,
  updateCartItem,
  validateCartForCheckout,
} from './http'

export * from './types'

export function getProductHttp() {
  return {
    queryCategoryList,
    querySpuList,
    querySpuDetail,
    querySkuStock,
    createCartItem,
    updateCartItem,
    removeCartItem,
    queryCart,
    validateCartForCheckout,
    getProductList,
  }
}

export {
  createCartItem,
  getProductList,
  queryCart,
  queryCategoryList,
  querySkuStock,
  querySpuDetail,
  querySpuList,
  removeCartItem,
  updateCartItem,
  validateCartForCheckout,
}
