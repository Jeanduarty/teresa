import type { Novidade } from './types'

export const novidade: Novidade = {
  slug: '2026-05-12-curtidas-pautas',
  category: 'Workflow',
  date: '12 mai 2026',
  publishedAt: '2026-05-12',
  title: 'Como transformar curtidas em pautas de publicação',
  summary:
    'O novo fluxo prioriza referências, tags e status para separar ideias pendentes das que já viraram post.',
  readTime: '4 min',
  sections: [
    {
      type: 'paragraph',
      text:
        'O fluxo de criação na Teresa não começa em uma página em branco. Começa nas referências que você já consumiu: posts curtidos, vídeos salvos e links comentados em redes diferentes.',
    },
    {
      type: 'heading',
      text: 'Da curtida à pauta',
    },
    {
      type: 'list',
      items: [
        'Conecte uma rede suportada e dê permissão para a Teresa ler a atividade autorizada.',
        'A IA agrupa sinais semelhantes em tópicos com referência ao conteúdo original.',
        'Você marca tópicos como pendentes ou feitos conforme transforma em conteúdo.',
        'Tags e grupos organizam os tópicos por projeto, cliente ou linha editorial.',
      ],
    },
    {
      type: 'heading',
      text: 'Status em vez de checklist',
    },
    {
      type: 'paragraph',
      text:
        'Trocamos colunas de Kanban por um status simples. A intenção é que o criador pense em "pauta a desenvolver" e "pauta finalizada" sem ter que arrastar cartões entre etapas.',
    },
  ],
}
