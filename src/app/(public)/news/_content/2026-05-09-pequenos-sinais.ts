import type { Novidade } from './types'

export const novidade: Novidade = {
  slug: '2026-05-09-pequenos-sinais',
  category: 'Bastidores',
  date: '09 mai 2026',
  publishedAt: '2026-05-09',
  title: 'Por que a Teresa foca em pequenos sinais diários',
  summary:
    'A ideia é reduzir a tela em branco: menos planilhas, mais contexto sobre o que você já salvou e curtiu.',
  readTime: '2 min',
  sections: [
    {
      type: 'paragraph',
      text:
        'A maior parte das ferramentas de conteúdo pede que o criador chegue com a ideia pronta. A Teresa parte do caminho inverso: ela observa o que você curte, salva e referencia nas redes sociais e devolve isso transformado em pautas prontas para revisar.',
    },
    {
      type: 'paragraph',
      text:
        'Esse formato encurta a distância entre inspiração e execução. Em vez de manter planilhas paralelas, o criador chega no app e encontra tópicos sugeridos a partir dos sinais reais que coletou durante a semana.',
    },
    {
      type: 'heading',
      text: 'O que mudou nessa rodada',
    },
    {
      type: 'list',
      items: [
        'Sinais sociais agora alimentam tópicos automaticamente.',
        'Cada tópico mantém o link de origem para você revisitar o contexto.',
        'Status simples (pendente, feito) substitui colunas e tags complexas.',
      ],
    },
  ],
}
