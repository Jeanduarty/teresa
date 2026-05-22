import { apiRawRequest, apiRequest } from '../shared/lib/api-client'
import type {
  AuthUser,
  ChangePasswordInput,
  DevelopmentAccess,
  DevelopmentSocialJobsResult,
  DevelopmentSocialJobsStatus,
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

  async uploadProfileAvatar(file: File): Promise<AuthUser> {
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('A imagem precisa ter no máximo 10MB')
    }

    const { user } = await apiRawRequest<{ user: AuthUser }>('/settings/avatar', {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    return user
  },

  async removeProfileAvatar(): Promise<AuthUser> {
    const { user } = await apiRequest<{ user: AuthUser }>('/settings/avatar', {
      method: 'DELETE',
    })

    return user
  },

  async getDevelopmentAccess(): Promise<DevelopmentAccess> {
    const { development } = await apiRequest<{ development: DevelopmentAccess }>('/settings/development')
    return development
  },

  async runDevelopmentSocialJobs(): Promise<DevelopmentSocialJobsResult> {
    const { result } = await apiRequest<{ result: DevelopmentSocialJobsResult }>(
      '/settings/development/social-jobs',
      {
        method: 'POST',
      },
    )

    return result
  },

  async getDevelopmentSocialJobsStatus(runId?: string): Promise<DevelopmentSocialJobsStatus> {
    const params = new URLSearchParams()

    if (runId) {
      params.set('runId', runId)
    }

    const { status } = await apiRequest<{ status: DevelopmentSocialJobsStatus }>(
      `/settings/development/social-jobs/status${params.toString() ? `?${params.toString()}` : ''}`,
    )

    return status
  },
}
