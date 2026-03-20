import { queryMenuCategoryList, queryMenuIndexData, queryMenuSpuListByCategory } from './http'

export * from './types'

export function getMenuHttp() {
  return {
    queryMenuCategoryList,
    queryMenuSpuListByCategory,
    queryMenuIndexData,
  }
}

export { queryMenuCategoryList, queryMenuIndexData, queryMenuSpuListByCategory }
