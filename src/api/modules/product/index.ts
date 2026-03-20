import { getProductList } from './http'

export * from './types'

export function getProductHttp() {
  return {
    getProductList,
  }
}

export { getProductList }
