const CAMEL_KEY_REGEXP = /_([a-z])/g
const SNAKE_KEY_REGEXP = /[A-Z]/g

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

function toCamelKey(key: string) {
  return key.replace(CAMEL_KEY_REGEXP, (_, letter: string) => letter.toUpperCase())
}

function toSnakeKey(key: string) {
  return key.replace(SNAKE_KEY_REGEXP, letter => `_${letter.toLowerCase()}`)
}

export function camelizeKeysDeep<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map(item => camelizeKeysDeep(item)) as T
  }
  if (!isPlainObject(input)) {
    return input
  }
  const result: Record<string, unknown> = {}
  Object.keys(input).forEach((key) => {
    result[toCamelKey(key)] = camelizeKeysDeep(input[key])
  })
  return result as T
}

export function snakifyKeysDeep<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map(item => snakifyKeysDeep(item)) as T
  }
  if (!isPlainObject(input)) {
    return input
  }
  const result: Record<string, unknown> = {}
  Object.keys(input).forEach((key) => {
    result[toSnakeKey(key)] = snakifyKeysDeep(input[key])
  })
  return result as T
}
