import { clearAuthToken, readAuthToken, writeAuthToken } from '../shared/lib/auth-token-storage'
import { apiRequest } from '../shared/lib/api-client'
import type {
  AuthUser,
  LoginInput,
  SignupInput,
  VerifySignupSecretInput,
} from '../shared/types/account-types'

interface AuthResponse {
  user: AuthUser
  token: string
}

export const authService = {
  async getSession(): Promise<AuthUser | null> {
    if (!readAuthToken()) {
      return null
    }

    const { user } = await apiRequest<{ user: AuthUser }>('/auth/session')
    return user
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      auth: false,
      body: input,
    })

    writeAuthToken(response.token)
    console.log(response)

    return response
  },

  async signup(input: SignupInput): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      auth: false,
      body: input,
    })
    writeAuthToken(response.token)
    return response
  },

  async verifySignupSecret(input: VerifySignupSecretInput): Promise<boolean> {
    const response = await apiRequest<{ success: boolean }>('/auth/signup/secret', {
      method: 'POST',
      auth: false,
      body: input,
    })

    return response.success
  },

  async logout(): Promise<boolean> {
    if (readAuthToken()) {
      await apiRequest<{ success: boolean }>('/auth/logout', {
        method: 'POST',
      }).catch(() => ({ success: true }))
    }

    clearAuthToken()
    return true
  },
}
