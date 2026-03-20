import { login, logout } from './http'

export * from './types'

export function getAuthHttp() {
  return {
    login,
    logout,
  }
}

export { login, logout }
