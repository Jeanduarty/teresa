export type NovidadeCategory =
  | 'Lançamento'
  | 'Melhoria'
  | 'Correção'
  | 'Bastidores'
  | 'Workflow'
  | 'Produto'

export type NovidadeSection =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'note'; text: string }

export interface NovidadeHighlight {
  title: string
  description: string
}

export interface Novidade {
  slug: string
  category: NovidadeCategory
  date: string
  publishedAt: string
  title: string
  summary: string
  readTime: string
  highlights?: NovidadeHighlight[]
  sections: NovidadeSection[]
}
