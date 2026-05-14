import { ExternalLink } from 'lucide-react'

import { ButtonAnchor, Card } from '../../../../components/ui'
import { RichContentText } from '../../../../components/rich-content-text'
import type { TopicReference } from '../../../../shared/types/account-types'
import { ProviderBadge } from '../../home/provider-badge'
import { formatTopicDate } from './topic-details-utils'

type TopicReferenceCardProps = {
  reference: TopicReference
}

export function TopicReferenceCard({ reference }: TopicReferenceCardProps) {
  const signalLabel = reference.likedAt ? 'Curtido' : 'Salvo'

  return (
    <Card as="article" variant="muted" className="rounded-[20px] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <ProviderBadge provider={reference.provider} />
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-[#666]">
              {signalLabel}
            </span>
          </div>

          <RichContentText
            text={reference.title}
            compactPreview
            className="font-heading text-lg font-semibold leading-tight text-[#181818]"
          />
          <p className="mt-1 font-mono text-sm text-[#666]">{reference.creatorHandle}</p>

          <div className="mt-4 rounded-[16px] border border-black/10 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">
              Por que entrou no topico
            </p>
            <div className="mt-2">
              <RichContentText
                text={reference.engagementReason}
                compactPreview
                className="text-sm leading-6 text-[#666]"
              />
            </div>
          </div>

          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-[#181818]">Coletado em</dt>
              <dd className="mt-1 text-[#666]">{formatTopicDate(reference.savedAt)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#181818]">Curtido em</dt>
              <dd className="mt-1 text-[#666]">
                {reference.likedAt ? formatTopicDate(reference.likedAt) : 'Nao informado'}
              </dd>
            </div>
          </dl>
        </div>

        <ButtonAnchor
          href={reference.url}
          target="_blank"
          rel="noreferrer"
          variant="secondary"
          className="h-10 shrink-0 rounded-full px-4"
          icon={<ExternalLink className="h-4 w-4" />}
        >
          Abrir post
        </ButtonAnchor>
      </div>
    </Card>
  )
}
