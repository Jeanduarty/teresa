import { apiRequest } from '../shared/lib/api-client'
import type {
  AuthUser,
  ChangePasswordInput,
  MutationMessage,
  RequestAccountDeletionInput,
  RequestEmailChangeInput,
  RevokeSessionInput,
  RevokeSessionResult,
  UpdateProfileInput,
  UserSessionPage,
} from '../shared/types/account-types'

interface GetSessionsInput {
  page: number
  perPage: number
}

export const settingsService = {
  async updateProfile({ userName, realName }: UpdateProfileInput): Promise<AuthUser> {
    const { user } = await apiRequest<{ user: AuthUser }>('/settings/profile', {
      method: 'PATCH',
      body: { userName, realName },
    })

    return user
  },

  async requestEmailChange({ newEmail }: RequestEmailChangeInput): Promise<MutationMessage> {
    return apiRequest<MutationMessage>('/settings/email-change', {
      method: 'POST',
      body: { newEmail },
    })
  },

  async changePassword({
    currentPassword,
    newPassword,
  }: ChangePasswordInput): Promise<MutationMessage> {
    return apiRequest<MutationMessage>('/settings/password', {
      method: 'POST',
      body: { currentPassword, newPassword },
    })
  },

  async getSessions({ page, perPage }: GetSessionsInput): Promise<UserSessionPage> {
    const params = new URLSearchParams({
      page: String(page),
      perPage: String(perPage),
    })

    return apiRequest<UserSessionPage>(`/settings/sessions?${params.toString()}`)
  },

  async revokeSession({ sessionId }: RevokeSessionInput): Promise<RevokeSessionResult> {
    return apiRequest<RevokeSessionResult>(`/settings/sessions/${sessionId}`, {
      method: 'DELETE',
    })
  },

  async requestAccountDeletion({
    password,
  }: RequestAccountDeletionInput): Promise<MutationMessage> {
    return apiRequest<MutationMessage>('/settings/account-deletion', {
      method: 'POST',
      body: { password },
    })
  },
}
