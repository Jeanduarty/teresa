import { useMutation, useQuery } from '@tanstack/react-query'

import { socialAccountsService } from '../services/social-accounts-service'
import { queryClient } from '../shared/lib/query-client'
import type { SocialAccount, SocialProvider } from '../shared/types/account-types'

export function useSocialAccounts(userId?: string) {
  const accountsQuery = useQuery<SocialAccount[], Error>({
    queryKey: ['social-accounts', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return socialAccountsService.listAccounts()
    },
    enabled: Boolean(userId),
  })

  const connectMutation = useMutation<{ authorizationUrl: string }, Error, 'twitter'>({
    mutationFn: (provider) => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      void userId
      return socialAccountsService.connectAccount(provider)
    },
    onSuccess: ({ authorizationUrl }) => {
      window.location.assign(authorizationUrl)
    },
  })

  const disconnectMutation = useMutation<SocialAccount, Error, SocialProvider>({
    mutationFn: (provider) => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      void userId
      return socialAccountsService.disconnectAccount(provider)
    },
    onSuccess: (updatedAccount) => {
      queryClient.setQueryData<SocialAccount[]>(['social-accounts', userId], (currentAccounts = []) =>
        currentAccounts.map((account) =>
          account.provider === updatedAccount.provider ? updatedAccount : account,
        ),
      )
    },
  })

  return {
    accountsQuery,
    connectMutation,
    disconnectMutation,
  }
}
