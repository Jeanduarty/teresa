import { ContentLinkPreview } from './content-link-preview'
import { extractLinksFromText, splitTextWithLinks } from '../shared/lib/text-links'

type RichContentTextProps = {
  text: string
  className?: string
  compactPreview?: boolean
}

export function RichContentText({
  text,
  className,
  compactPreview = false,
}: RichContentTextProps) {
  const parts = splitTextWithLinks(text)
  const links = extractLinksFromText(text)

  return (
    <div>
      <p className={className}>
        {parts.map((part, index) => {
          if (part.type === 'link') {
            return (
              <a
                key={`${part.value}-${index}`}
                href={part.value}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#181818] underline decoration-black/20 underline-offset-2 transition-colors hover:text-[#666]"
                onClick={(event) => event.stopPropagation()}
              >
                {part.value}
              </a>
            )
          }

          return <span key={`${part.value}-${index}`}>{part.value}</span>
        })}
      </p>

      {links.slice(0, 2).map((link) => (
        <ContentLinkPreview key={link} url={link} compact={compactPreview} />
      ))}
    </div>
  )
}
