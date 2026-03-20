import { getUserInfo } from './http'

export * from './types'

export function getUserHttp() {
  return {
    getUserInfo,
  }
}

export { getUserInfo }
