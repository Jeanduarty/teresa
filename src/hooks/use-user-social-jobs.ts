import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userSocialJobsService } from '../services/user-social-jobs-service'
import type {
  UserSocialJobsAccess,
  UserSocialJobsResult,
  UserSocialJobsStatus,
} from '../shared/types/account-types'

export function useUserSocialJobs(userId?: string) {
  const queryClient = useQueryClient()

  const accessQuery = useQuery({
    queryKey: ['user-social-jobs', 'access', userId],
    queryFn: async () => userSocialJobsService.getUserSocialJobsAccess(),
    enabled: !!userId,
    staleTime: 30_000,
  })

  const runMutation = useMutation({
    mutationFn: async () => userSocialJobsService.runUserSocialJobs(),
    onSuccess: (data) => {
      queryClient.setQueriesData(
        { queryKey: ['user-social-jobs', 'access', userId] },
        (old: UserSocialJobsAccess | undefined) => {
          if (old) {
            return { ...old, cooldownEndsAt: data.cooldownEndsAt }
          }
          return old
        },
      )
    },
  })

  const statusQuery = useQuery({
    queryKey: ['user-social-jobs', 'status', userId, runMutation.data?.runId],
    queryFn: async () => {
      if (!runMutation.data?.runId) throw new Error('No runId')
      return userSocialJobsService.getUserSocialJobsStatus(runMutation.data.runId)
    },
    enabled: !!runMutation.data?.runId && !!userId,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return false
      return data.isComplete ? false : 3000
    },
  })

  return {
    accessQuery,
    runMutation,
    statusQuery,
  }
}
