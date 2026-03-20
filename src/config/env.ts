interface RuntimeConfig {
  baseURL: string
  enableMock: boolean
  mockDelay: number
  timeout: number
}

export const runtimeConfig: RuntimeConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
  mockDelay: Number(import.meta.env.VITE_MOCK_DELAY || 150),
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 10000),
}
