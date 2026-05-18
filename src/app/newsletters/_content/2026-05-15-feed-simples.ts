import type { Newsletter } from './types'

export const newsletter: Newsletter = {
  slug: '2026-05-15-feed-simples',
  category: 'Produto',
  date: '15 mai 2026',
  publishedAt: '2026-05-15',
  title: 'Um feed simples para acompanhar as ideias que importam',
  summary:
    'A Teresa organiza sinais das redes sociais em tópicos prontos para revisar, salvar e transformar em conteúdo.',
  readTime: '3 min',
  highlights: [
    {
      title: 'Tópicos agrupados',
      description: 'Organize ideias por tema, status e origem.',
    },
    {
      title: 'Rascunhos acionáveis',
      description: 'Use os insights como ponto de partida para novos posts.',
    },
    {
      title: 'Referências visíveis',
      description: 'Volte ao sinal original quando precisar de contexto.',
    },
  ],
  sections: [
    {
      type: 'paragraph',
      text:
        'A nova home da Teresa traz um feed leve, focado no que importa: os tópicos gerados a partir da sua atividade social.',
    },
    {
      type: 'heading',
      text: 'O que você encontra na home',
    },
    {
      type: 'list',
      items: [
        'Lista de tópicos com filtros simples por status, título e tags.',
        'Grupos para organizar tópicos por projeto ou linha editorial.',
        'Indicador rápido de quais redes estão conectadas.',
      ],
    },
    {
      type: 'note',
      text:
        'Os tópicos são gerados automaticamente conforme novos sinais aparecem. Não é necessário rodar nada manualmente.',
    },
  ],
}
