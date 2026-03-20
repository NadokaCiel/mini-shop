import { queryActivityHome } from './http'

export * from './types'

export function getActivityHttp() {
  return {
    queryActivityHome,
  }
}

export { queryActivityHome }
