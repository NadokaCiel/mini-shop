export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    nickname: string
  }
}

export interface LogoutRequest {
  reason?: string
}

export type LogoutResponse = null
