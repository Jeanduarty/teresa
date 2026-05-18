import { newsletter as exploreMercado } from './2026-05-18-explore-mercado'
import { newsletter as feedSimples } from './2026-05-15-feed-simples'
import { newsletter as curtidasPautas } from './2026-05-12-curtidas-pautas'
import { newsletter as pequenosSinais } from './2026-05-09-pequenos-sinais'
import type { Newsletter } from './types'

export type { Newsletter, NewsletterCategory, NewsletterSection } from './types'

export const NEWSLETTERS: Newsletter[] = [
  exploreMercado,
  feedSimples,
  curtidasPautas,
  pequenosSinais,
].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export function getNewsletterBySlug(slug: string): Newsletter | null {
  return NEWSLETTERS.find((entry) => entry.slug === slug) ?? null
}

export function getLatestNewsletter(): Newsletter | null {
  return NEWSLETTERS[0] ?? null
}
