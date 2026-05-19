import type {
  UserSocialJobsAccess,
  UserSocialJobsResult,
  UserSocialJobsStatus,
} from '../shared/types/account-types'
import { apiRequest } from '../shared/lib/api-client'

export const userSocialJobsService = {
  getUserSocialJobsAccess(): Promise<UserSocialJobsAccess> {
    return apiRequest('/topics/social-jobs/access', {
      method: 'GET',
    })
  },

  runUserSocialJobs(): Promise<UserSocialJobsResult> {
    return apiRequest('/topics/social-jobs/run', {
      method: 'POST',
      body: {},
    })
  },

  getUserSocialJobsStatus(runId: string): Promise<UserSocialJobsStatus> {
    return apiRequest(`/topics/social-jobs/status?runId=${runId}`, {
      method: 'GET',
    })
  },
}
