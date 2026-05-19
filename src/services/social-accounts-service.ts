import { apiRequest } from '../shared/lib/api-client'
import type { SocialAccount, SocialProvider } from '../shared/types/account-types'

interface SocialAuthorization {
  authorizationUrl: string
}

export const socialAccountsService = {
  async listAccounts(): Promise<SocialAccount[]> {
    const { accounts } = await apiRequest<{ accounts: SocialAccount[] }>('/social/accounts')
    return accounts
  },

  async connectAccount(provider: 'twitter'): Promise<SocialAuthorization> {
    return apiRequest<SocialAuthorization>(`/social/${provider}/connect`, {
      method: 'POST',
      body: {
        redirectTo: '/settings/social',
      },
    })
  },

  async disconnectAccount(provider: SocialProvider): Promise<SocialAccount> {
    const { account } = await apiRequest<{ account: SocialAccount }>(`/social/${provider}`, {
      method: 'DELETE',
    })
    return account
  },
}
