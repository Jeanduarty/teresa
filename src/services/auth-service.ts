import { clearAuthToken, readAuthToken, writeAuthToken } from '../shared/lib/auth-token-storage'
import { apiRequest } from '../shared/lib/api-client'
import type {
  AuthUser,
  LoginInput,
  MutationMessage,
  RequestPasswordResetInput,
  RequestPasswordResetResponse,
  ResetPasswordInput,
  SignupInput,
  VerifyPasswordResetCodeInput,
  VerifyPasswordResetCodeResponse,
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

  async requestPasswordReset(input: RequestPasswordResetInput): Promise<RequestPasswordResetResponse> {
    return apiRequest<RequestPasswordResetResponse>('/auth/password-reset/request', {
      method: 'POST',
      auth: false,
      body: input,
    })
  },

  async verifyPasswordResetCode(input: VerifyPasswordResetCodeInput): Promise<VerifyPasswordResetCodeResponse> {
    return apiRequest<VerifyPasswordResetCodeResponse>('/auth/password-reset/verify', {
      method: 'POST',
      auth: false,
      body: input,
    })
  },

  async resetPassword(input: ResetPasswordInput): Promise<MutationMessage> {
    return apiRequest<MutationMessage>('/auth/password-reset', {
      method: 'POST',
      auth: false,
      body: input,
    })
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
