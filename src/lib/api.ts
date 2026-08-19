type QueryParams = Record<string, string | number | boolean | null | undefined>

type RequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: BodyInit | Record<string, unknown>
  headers?: HeadersInit
  params?: QueryParams
  timeout?: number
}

type ApiClientOptions = {
  baseUrl: string
  defaultHeaders?: HeadersInit
}

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function isJsonBody(body: RequestOptions['body']): body is Record<string, unknown> {
  if (!body || typeof body !== 'object') return false
  const prototype = Object.getPrototypeOf(body)
  return prototype === Object.prototype || prototype === null
}

function buildUrl(baseUrl: string, path: string, params?: QueryParams) {
  const url = new URL(path, `${baseUrl}/`)

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined) url.searchParams.set(key, String(value))
  })

  return url.toString()
}

async function readResponse(response: Response) {
  if (response.status === 204) return undefined

  const contentType = response.headers.get('content-type') ?? ''
  return contentType.includes('application/json') ? response.json() : response.text()
}

export function createApiClient({ baseUrl, defaultHeaders }: ApiClientOptions) {
  async function request<T>(path: string, options: RequestOptions = {}) {
    const { body, headers: requestHeaders, params, timeout, ...fetchOptions } = options
    const headers = new Headers(defaultHeaders)
    new Headers(requestHeaders).forEach((value, key) => headers.set(key, value))

    if (isJsonBody(body) && !headers.has('content-type'))
      headers.set('content-type', 'application/json')

    const controller = timeout ? new AbortController() : undefined
    const timer = timeout ? window.setTimeout(() => controller?.abort(), timeout) : undefined

    try {
      const response = await fetch(buildUrl(baseUrl, path, params), {
        ...fetchOptions,
        headers,
        body: isJsonBody(body) ? JSON.stringify(body) : body,
        signal: options.signal ?? controller?.signal,
      })
      const data = await readResponse(response)

      if (!response.ok) {
        const message =
          typeof data === 'object' && data && 'message' in data && typeof data.message === 'string'
            ? data.message
            : 'خطا در ارتباط با سرور'
        throw new ApiError(message, response.status, data)
      }

      return data as T
    } finally {
      if (timer) window.clearTimeout(timer)
    }
  }

  return {
    request,
    get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...options, method: 'GET' }),
    post: <T>(
      path: string,
      body?: RequestOptions['body'],
      options?: Omit<RequestOptions, 'method' | 'body'>,
    ) => request<T>(path, { ...options, method: 'POST', body }),
    put: <T>(
      path: string,
      body?: RequestOptions['body'],
      options?: Omit<RequestOptions, 'method' | 'body'>,
    ) => request<T>(path, { ...options, method: 'PUT', body }),
    patch: <T>(
      path: string,
      body?: RequestOptions['body'],
      options?: Omit<RequestOptions, 'method' | 'body'>,
    ) => request<T>(path, { ...options, method: 'PATCH', body }),
    delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...options, method: 'DELETE' }),
  }
}

export const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.bakamion.ir',
  defaultHeaders: { Accept: 'application/json' },
})
