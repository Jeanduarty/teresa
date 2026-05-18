import { useMutation, useQueryClient } from '@tanstack/react-query'

import { settingsService } from '../services/settings-service'
import type { AuthUser } from '../shared/types/account-types'

export function useAvatarUpload() {
  const queryClient = useQueryClient()

  const uploadMutation = useMutation<AuthUser, Error, File>({
    mutationFn: settingsService.uploadProfileAvatar,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<AuthUser | null>(['session'], updatedUser)
      void queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  const removeMutation = useMutation<AuthUser, Error, void>({
    mutationFn: settingsService.removeProfileAvatar,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<AuthUser | null>(['session'], updatedUser)
      void queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  return { uploadMutation, removeMutation }
}
