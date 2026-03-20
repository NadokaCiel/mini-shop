export interface UserInfoRequest {
  withPermission?: boolean
}

export interface UserInfoResponse {
  id: string
  nickname: string
}
