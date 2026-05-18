import { useState } from 'react'
import { ChevronRight, ExternalLink, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuthSession } from '../../../../hooks/use-auth'
import { useExploreAnalysis } from '../../../../hooks/use-explore-analyses'
import type { ExploreContent } from '../../../../shared/types/account-types'
import { AddLinksDialog } from './add-links-dialog'
import {
  formatDate,
  getContentStatusClassName,
  getContentStatusLabel,
  getPlatformInitials,
} from './explore-utils'

export function AnalysisContents({
  analysisId,
  contents,
}: {
  analysisId: string
  contents: ExploreContent[]
}) {
  const navigate = useNavigate()
  const { user } = useAuthSession()
  const { addLinksMutation } = useExploreAnalysis({
    userId: user?.id,
    exploreAnalysisId: analysisId,
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  async function handleAddLinks(urls: string[]) {
    try {
      await addLinksMutation.mutateAsync(urls)
      setDialogOpen(false)
    } catch {
      // error shown in dialog via isPending state — service throws user-facing messages
    }
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-base font-semibold text-[#141414]">
          Todos os conteúdos ({contents.length})
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#666] transition-colors hover:bg-[#f4f4f2] hover:text-[#141414]"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Adicionar mais links
        </button>
      </header>

      <AddLinksDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentCount={contents.length}
        isPending={addLinksMutation.isPending}
        onConfirm={handleAddLinks}
      />

      {contents.length === 0 ? (
        <p className="rounded-[18px] border border-dashed border-black/10 bg-[#fbfbfa] px-4 py-8 text-center text-sm text-[#888]">
          Nenhum conteúdo nesta análise.
        </p>
      ) : (
        <ul className="space-y-2">
          {contents.map((content) => {
            const title = content.title ?? content.url
            const platform = content.platform ?? 'Web'

            return (
              <li
                key={content.id}
                role="link"
                tabIndex={0}
                onClick={() =>
                  navigate(`/explore/${analysisId}/contents/${content.id}`)
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    navigate(`/explore/${analysisId}/contents/${content.id}`)
                  }
                }}
                className="group flex cursor-pointer items-center gap-3 rounded-[16px] border border-black/10 bg-white px-4 py-3 outline-none transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_48px_-34px_rgba(0,0,0,0.55)] focus-visible:ring-2 focus-visible:ring-[#181818]/20"
              >
                {content.previewImageUrl ? (
                  <img
                    src={content.previewImageUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-[12px] object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#181818] text-xs font-semibold text-white">
                    {getPlatformInitials(platform)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#181818]">
                    {title}
                  </p>
                  <p className="mt-1 truncate text-xs text-[#888]">
                    {platform}
                    {content.creatorHandle ? ` · @${content.creatorHandle}` : ''}
                    {content.analyzedAt
                      ? ` · ${formatDate(content.analyzedAt)}`
                      : ''}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${getContentStatusClassName(
                    content.status,
                  )}`}
                >
                  {getContentStatusLabel(content.status)}
                </span>

                <a
                  href={content.url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-full p-1.5 text-[#888] transition-colors hover:bg-[#f4f4f2] hover:text-[#141414]"
                  onClick={(event) => event.stopPropagation()}
                  aria-label="Abrir link externo"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <ChevronRight className="h-4 w-4 shrink-0 text-[#aaa] transition-colors group-hover:text-[#181818]" />
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
