export interface HttpResponse<T> {
  code: number
  message: string
  data: T
}

export interface RequestOptions<TRequestData = UniApp.RequestOptions['data']> {
  url: string
  method?: UniApp.RequestOptions['method']
  data?: TRequestData
  header?: Record<string, string>
  retry?: number
  skipAuth?: boolean
  silentError?: boolean
  transformRequestCase?: boolean
}

export interface ApiResult<TData> {
  isOk: boolean
  code: number
  msg: string
  data: TData | null
  getMsg: () => string
  getData: () => TData | null
}

export interface ApiTypeInput<_TRequest, _TResponse> {
  name?: string
  path: string
  requestShape?: unknown
  responseShape?: unknown
}

export interface ApiContract<TRequest, TResponse> {
  path: string
  __requestType__?: TRequest
  __responseType__?: TResponse
}

export type ApiRequestOptions<TRequest> = Omit<RequestOptions<TRequest>, 'url' | 'method'>
