const AUTH_TOKEN_KEY = 'teresa:auth-token'

export function readAuthToken(): string | null {
  const token = window.localStorage.getItem(AUTH_TOKEN_KEY)

  if (!token) {
    return null
  }

  if (token.split('.').length !== 3) {
    clearAuthToken()
    return null
  }

  return token
}

export function writeAuthToken(token: string): void {
  if (token.split('.').length !== 3) {
    clearAuthToken()
    return
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearAuthToken(): void {
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
}
