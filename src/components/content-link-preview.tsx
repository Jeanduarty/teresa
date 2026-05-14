import { ExternalLink, ImageIcon, Loader2 } from 'lucide-react'

import { useLinkPreview } from '../hooks/use-link-preview'

type ContentLinkPreviewProps = {
  url: string
  compact?: boolean
}

export function ContentLinkPreview({ url, compact = false }: ContentLinkPreviewProps) {
  const previewQuery = useLinkPreview(url)
  const preview = previewQuery.data
  const href = preview?.resolvedUrl ?? url

  if (previewQuery.isLoading) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-[18px] border border-black/10 bg-[#fbfbfa] px-4 py-3 text-sm font-medium text-[#666]">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Carregando mídia
      </div>
    )
  }

  if (preview?.kind === 'image' || preview?.kind === 'gif') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-3 block overflow-hidden rounded-[18px] border border-black/10 bg-[#f4f4f2]"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={href}
          alt=""
          className={`w-full object-cover ${compact ? 'max-h-[220px]' : 'max-h-[420px]'}`}
          loading="lazy"
        />
      </a>
    )
  }

  if (preview?.kind === 'video') {
    return (
      <div
        className="mt-3 overflow-hidden rounded-[18px] border border-black/10 bg-black"
        onClick={(event) => event.stopPropagation()}
      >
        <video
          src={href}
          controls
          className={`w-full bg-black ${compact ? 'max-h-[220px]' : 'max-h-[480px]'}`}
        />
      </div>
    )
  }

  if (preview && (preview.imageUrl || preview.title || preview.description || preview.siteName)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-3 block overflow-hidden rounded-[18px] border border-black/10 bg-[#fbfbfa] transition-colors hover:border-black/20 hover:bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        {preview.imageUrl ? (
          <img
            src={preview.imageUrl}
            alt={preview.title ?? preview.siteName ?? ''}
            className={`w-full object-cover ${compact ? 'max-h-[180px]' : 'max-h-[280px]'}`}
            loading="lazy"
          />
        ) : null}

        <div className="space-y-2 px-4 py-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]">
            <ExternalLink className="h-4 w-4" />
            <span className="truncate">{preview.siteName ?? new URL(href).hostname}</span>
          </div>

          {preview.title ? (
            <p className="line-clamp-3 text-[15px] font-semibold leading-6 text-[#181818]">
              {preview.title}
            </p>
          ) : null}

          {preview.description ? (
            <p className="line-clamp-3 text-sm leading-6 text-[#666]">{preview.description}</p>
          ) : null}
        </div>
      </a>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="mt-3 flex items-center gap-2 rounded-[18px] border border-black/10 bg-[#fbfbfa] px-4 py-3 text-sm font-semibold text-[#181818] transition-colors hover:border-black/20 hover:bg-white"
      onClick={(event) => event.stopPropagation()}
    >
      {preview?.kind === 'link' ? <ExternalLink className="h-4 w-4" /> : null}
      {previewQuery.error ? <ExternalLink className="h-4 w-4" /> : null}
      {!preview && !previewQuery.error ? <ImageIcon className="h-4 w-4" /> : null}
      <span className="min-w-0 truncate">{url}</span>
    </a>
  )
}
