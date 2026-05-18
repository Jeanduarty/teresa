export type NewsletterCategory =
  | 'Lançamento'
  | 'Melhoria'
  | 'Correção'
  | 'Bastidores'
  | 'Workflow'
  | 'Produto'

export type NewsletterSection =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'note'; text: string }

export interface NewsletterHighlight {
  title: string
  description: string
}

export interface Newsletter {
  slug: string
  category: NewsletterCategory
  date: string
  publishedAt: string
  title: string
  summary: string
  readTime: string
  highlights?: NewsletterHighlight[]
  sections: NewsletterSection[]
}
