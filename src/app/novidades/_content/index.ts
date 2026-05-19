import { novidade as exploreMercado } from './2026-05-18-explore-mercado'
import { novidade as feedSimples } from './2026-05-15-feed-simples'
import { novidade as curtidasPautas } from './2026-05-12-curtidas-pautas'
import { novidade as pequenosSinais } from './2026-05-09-pequenos-sinais'
import type { Novidade } from './types'

export type { Novidade, NovidadeCategory, NovidadeSection } from './types'

export const NOVIDADES: Novidade[] = [
  exploreMercado,
  feedSimples,
  curtidasPautas,
  pequenosSinais,
].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export function getNovidadeBySlug(slug: string): Novidade | null {
  return NOVIDADES.find((entry) => entry.slug === slug) ?? null
}

export function getLatestNovidade(): Novidade | null {
  return NOVIDADES[0] ?? null
}
