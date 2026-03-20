import { getHealthStatus } from './http'

export * from './types'

export function getCommonHttp() {
  return {
    getHealthStatus,
  }
}

export { getHealthStatus }
