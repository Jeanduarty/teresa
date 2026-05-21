import { clearAuthToken, readAuthToken } from './auth-token-storage'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3333'

export class ApiRequestError extends Error {
  statusCode: number
  payload: unknown

  constructor(message: string, statusCode: number, payload: unknown) {
    super(message)
    this.name = 'ApiRequestError'
    this.statusCode = statusCode
    this.payload = payload
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  auth?: boolean
}

interface RawRequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | null
  auth?: boolean
}

interface ApiSuccessResponse<TResponse> {
  success: true
  data: TResponse
}

function isApiSuccessResponse<TResponse>(payload: unknown): payload is ApiSuccessResponse<TResponse> {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'success' in payload &&
    'data' in payload &&
    (payload as { success: unknown }).success === true
  )
}

function getErrorMessage(payload: unknown): string {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof (payload as { message: unknown }).message === 'string'
  ) {
    return (payload as { message: string }).message
  }

  return 'Erro ao comunicar com o servidor'
}

async function throwApiError(response: Response): Promise<never> {
  if (response.status === 401) {
    clearAuthToken()
  }

  const errorPayload = await response.json().catch(() => null)
  throw new ApiRequestError(getErrorMessage(errorPayload), response.status, errorPayload)
}

export async function apiRequest<TResponse>(
  path: string,
  { body, auth = true, headers, ...options }: RequestOptions = {},
): Promise<TResponse> {
  const token = readAuthToken()
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    await throwApiError(response)
  }

  const payload = (await response.json()) as unknown

  if (isApiSuccessResponse<TResponse>(payload)) {
    return payload.data
  }

  return payload as TResponse
}

export async function apiRawRequest<TResponse>(
  path: string,
  { body, auth = true, headers, ...options }: RawRequestOptions = {},
): Promise<TResponse> {
  const token = readAuthToken()
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body,
  })

  if (!response.ok) {
    await throwApiError(response)
  }

  const payload = (await response.json()) as unknown

  if (isApiSuccessResponse<TResponse>(payload)) {
    return payload.data
  }

  return payload as TResponse
}

export async function apiBlobRequest(
  path: string,
  { auth = true, headers, ...options }: Omit<RawRequestOptions, 'body'> = {},
): Promise<Blob> {
  const token = readAuthToken()
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  if (!response.ok) {
    await throwApiError(response)
  }

  return response.blob()
}
