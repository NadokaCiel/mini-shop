import type { ApiTypeDeclaration } from './types'

export function defineApiType<TRequest, TResponse>(declaration: ApiTypeDeclaration<TRequest, TResponse>) {
  return declaration
}
