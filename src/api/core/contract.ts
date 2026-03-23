import type { ApiContract, ApiTypeInput } from './types'

export function defineApiType<TRequest, TResponse>(declaration: ApiTypeInput<TRequest, TResponse>): ApiContract<TRequest, TResponse> {
  return {
    path: declaration.path,
  }
}
