import { clearAuthToken, readAuthToken } from './auth-token-storage'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3333'

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
    if (response.status === 401) {
      clearAuthToken()
    }

    const errorPayload = await response.json().catch(() => null)
    throw new Error(errorPayload?.message ?? 'Erro ao comunicar com o servidor')
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
    if (response.status === 401) {
      clearAuthToken()
    }

    const errorPayload = await response.json().catch(() => null)
    throw new Error(errorPayload?.message ?? 'Erro ao comunicar com o servidor')
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
    if (response.status === 401) {
      clearAuthToken()
    }

    const errorPayload = await response.json().catch(() => null)
    throw new Error(errorPayload?.message ?? 'Erro ao comunicar com o servidor')
  }

  return response.blob()
}
