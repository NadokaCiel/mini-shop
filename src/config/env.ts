interface RuntimeConfig {
  baseURL: string
  timeout: number
}

export const runtimeConfig: RuntimeConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 10000),
}
