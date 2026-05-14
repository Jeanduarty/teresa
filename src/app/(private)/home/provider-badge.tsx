import { AtSign, Music2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { SocialProvider } from '../../../shared/types/account-types'

const PROVIDERS: Record<
  SocialProvider,
  { label: string; icon: LucideIcon; className: string }
> = {
  twitter: {
    label: 'Twitter/X',
    icon: AtSign,
    className: 'border-zinc-200 bg-zinc-50 text-zinc-800',
  },
  tiktok: {
    label: 'TikTok',
    icon: Music2,
    className: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  },
}

export function ProviderBadge({ provider }: { provider: SocialProvider }) {
  const providerConfig = PROVIDERS[provider]
  const ProviderIcon = providerConfig.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${providerConfig.className}`}
    >
      <ProviderIcon className="h-3.5 w-3.5" />
      {providerConfig.label}
    </span>
  )
}
