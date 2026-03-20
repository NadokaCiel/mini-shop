import type { ApiResult, ApiTuple, ApiTypeDeclaration, HttpResponse, RequestOptions } from './types'
import { runtimeConfig } from '@/config/env'
import { DEFAULT_ERROR_MESSAGE, HTTP_CODE } from '@/constants/http'
import { resolveMockResponse } from '@/mock/http-mock'
import { ROUTE_PATH } from '@/router/route-map'
import { useAuthStore } from '@/stores/auth'

import { camelizeKeysDeep, snakifyKeysDeep } from '@/utils/case-convert'

type RequestInterceptor = (config: RequestOptions<unknown>) => RequestOptions<unknown>
type ResponseInterceptor<T> = (response: HttpResponse<T>, options: RequestOptions<unknown>) => HttpResponse<T>

const requestInterceptors: RequestInterceptor[] = [
  (config) => {
    const authStore = useAuthStore()
    if (!config.skipAuth && authStore.token) {
      return {
        ...config,
        header: {
          ...config.header,
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    }
    return config
  },
]

const responseInterceptors: ResponseInterceptor<unknown>[] = [
  (response, options) => {
    if (response.code === HTTP_CODE.unauthorized) {
      const authStore = useAuthStore()
      authStore.clearSession()
      uni.navigateTo({ url: ROUTE_PATH.login })
      throw new Error(response.message || '登录态已失效，请重新登录')
    }

    if (response.code !== HTTP_CODE.success) {
      if (!options.silentError) {
        uni.showToast({
          title: response.message || DEFAULT_ERROR_MESSAGE,
          icon: 'none',
        })
      }
      throw new Error(response.message || DEFAULT_ERROR_MESSAGE)
    }

    return response
  },
]

function applyRequestInterceptors<T>(config: RequestOptions<T>) {
  return requestInterceptors.reduce(
    (result, interceptor) => interceptor(result as RequestOptions<unknown>) as RequestOptions<T>,
    config,
  )
}

function applyResponseInterceptors<T>(response: HttpResponse<T>, options: RequestOptions<unknown>) {
  return responseInterceptors.reduce((result, interceptor) => interceptor(result, options) as HttpResponse<T>, response)
}

function createApiResult<T>(isOk: boolean, code: number, msg: string, data: T | null): ApiResult<T> {
  return {
    isOk,
    code,
    msg,
    data,
    getMsg() {
      return this.msg
    },
    getData() {
      return this.data
    },
  }
}

function normalizeRequestData(data: RequestOptions<unknown>['data'], transformRequestCase: boolean) {
  if (!transformRequestCase || data == null) {
    return data
  }
  if (typeof data === 'string' || data instanceof ArrayBuffer) {
    return data
  }
  return snakifyKeysDeep(data)
}

function normalizeResponse<T>(rawData: unknown) {
  const response = rawData as Partial<HttpResponse<T>>
  return {
    code: Number(response.code ?? HTTP_CODE.success),
    message: String(response.message ?? ''),
    data: (response.data as T) ?? ({} as T),
  }
}

function shouldRetry(statusCode: number, retryCount: number) {
  return retryCount > 0 && statusCode >= 500
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function runRequest<T>(options: RequestOptions<unknown>, retryCount: number): Promise<HttpResponse<T>> {
  return new Promise<HttpResponse<T>>((resolve, reject) => {
    if (runtimeConfig.enableMock) {
      const mockResponse = resolveMockResponse(options)
      if (mockResponse) {
        delay(runtimeConfig.mockDelay).then(() => {
          resolve(mockResponse as HttpResponse<T>)
        })
        return
      }
    }

    uni.request({
      url: `${runtimeConfig.baseURL}${options.url}`,
      method: options.method || 'GET',
      data: normalizeRequestData(
        options.data,
        options.transformRequestCase ?? true,
      ) as UniApp.RequestOptions['data'],
      header: {
        'Content-Type': 'application/json',
        ...options.header,
      },
      timeout: runtimeConfig.timeout,
      success: (res) => {
        if (shouldRetry(res.statusCode, retryCount)) {
          runRequest<T>(options, retryCount - 1).then(resolve).catch(reject)
          return
        }
        resolve(normalizeResponse<T>(res.data))
      },
      fail: (error) => {
        if (retryCount > 0) {
          runRequest<T>(options, retryCount - 1).then(resolve).catch(reject)
          return
        }
        if (!options.silentError) {
          uni.showToast({
            title: DEFAULT_ERROR_MESSAGE,
            icon: 'none',
          })
        }
        reject(error)
      },
    })
  })
}

export async function request<TRequest, TResponse>(
  typeDeclaration: ApiTypeDeclaration<TRequest, TResponse>,
  options: RequestOptions<TRequest>,
): Promise<ApiTuple<TRequest, TResponse>> {
  const finalOptions = applyRequestInterceptors(options)
  try {
    const response = await runRequest<TResponse>(finalOptions, finalOptions.retry ?? 0)
    const parsedResponse = applyResponseInterceptors(response, finalOptions)
    const data = camelizeKeysDeep(parsedResponse.data)
    if (parsedResponse.code !== HTTP_CODE.success) {
      return [createApiResult<TResponse>(false, parsedResponse.code, parsedResponse.message, null), typeDeclaration]
    }
    return [createApiResult<TResponse>(true, parsedResponse.code, parsedResponse.message, data), typeDeclaration]
  }
  catch (error) {
    const message = error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE
    return [createApiResult<TResponse>(false, -1, message, null), typeDeclaration]
  }
}

export function get<TRequest, TResponse>(
  typeDeclaration: ApiTypeDeclaration<TRequest, TResponse>,
  options: Omit<RequestOptions<TRequest>, 'url' | 'method'> = {},
): Promise<ApiTuple<TRequest, TResponse>> {
  return request(typeDeclaration, {
    ...options,
    url: typeDeclaration.path,
    method: 'GET',
  })
}

export function post<TRequest, TResponse>(
  typeDeclaration: ApiTypeDeclaration<TRequest, TResponse>,
  data?: TRequest,
  options: Omit<RequestOptions<TRequest>, 'url' | 'method' | 'data'> = {},
): Promise<ApiTuple<TRequest, TResponse>> {
  return request(typeDeclaration, {
    ...options,
    url: typeDeclaration.path,
    data,
    method: 'POST',
  })
}
