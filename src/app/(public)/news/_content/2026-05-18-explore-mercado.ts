import type { Novidade } from './types'

export const novidade: Novidade = {
  slug: '2026-05-18-explore-mercado',
  category: 'Lançamento',
  date: '18 mai 2026',
  publishedAt: '2026-05-18',
  title: 'Explorar: análise de mercado a partir de links de referência',
  summary:
    'A nova aba Explorar transforma listas de links em análises completas de padrões, posicionamentos e oportunidades pouco exploradas pelo seu nicho.',
  readTime: '5 min',
  highlights: [
    {
      title: 'Análises de mercado',
      description:
        'Adicione links de criadores e concorrentes e receba um relatório com padrões dominantes e oportunidades.',
    },
    {
      title: 'Padrões consolidados',
      description:
        'Hooks, formatos, tons de voz e posicionamentos identificados automaticamente em cada análise.',
    },
    {
      title: 'Oportunidades e tendências',
      description:
        'A Teresa aponta lacunas pouco exploradas e sinais de tendência emergente no recorte que você criou.',
    },
  ],
  sections: [
    {
      type: 'paragraph',
      text:
        'Até agora a Teresa partia dos sinais que você já tinha curtido. Com a aba Explorar, dá para fazer o movimento oposto: você escolhe um recorte do mercado (criadores, concorrentes, referências), informa os links e a Teresa monta um relatório consolidado.',
    },
    {
      type: 'heading',
      text: 'Como criar uma análise',
    },
    {
      type: 'list',
      items: [
        'Abra a aba Explorar e clique em "Nova análise".',
        'Dê um nome para o recorte (ex: "Lançamentos SaaS que estão bombando").',
        'Cole até 25 links de YouTube, Instagram, TikTok, LinkedIn, blogs ou sites.',
        'A análise começa em segundo plano — a página atualiza sozinha quando termina.',
      ],
    },
    {
      type: 'heading',
      text: 'O que aparece no relatório',
    },
    {
      type: 'paragraph',
      text:
        'A página de detalhe da análise organiza os insights em três visualizações:',
    },
    {
      type: 'list',
      items: [
        'Visão geral: resumo estratégico, formatos dominantes, tom predominante, hooks recorrentes, posicionamentos e padrões agrupados por categoria.',
        'Conteúdos: lista de cada link analisado com status individual, plataforma e detalhes do conteúdo.',
        'Oportunidades e tendências: lacunas pouco exploradas (com nível alto/médio/baixo) e sinais de tendência emergente do recorte.',
      ],
    },
    {
      type: 'heading',
      text: 'Detalhe de cada conteúdo',
    },
    {
      type: 'paragraph',
      text:
        'Cada link gera uma análise individual com mais de 20 dimensões — tom de voz, nível de autoridade, estilo narrativo, emoção predominante, formato, tipo e texto do hook, CTA, estrutura, storytelling, arquétipo, posicionamento, público-alvo, intenção e mais. A ideia é separar o que é estratégia do que é execução em cada referência.',
    },
    {
      type: 'heading',
      text: 'Mudanças adjacentes',
    },
    {
      type: 'list',
      items: [
        'A home agora tem duas abas: Creator (tópicos) e Explorar (análises). Grupos viraram um popover dentro de Creator.',
        'Novo seletor de grupos com busca, contagem e criação inline. Editar e apagar grupos passou a viver no mesmo lugar.',
        'Toda confirmação de ação sensível (apagar grupo, apagar análise, apagar tópico) usa o novo componente ConfirmDialog com tom de alerta e texto explicativo.',
      ],
    },
    {
      type: 'note',
      text:
        'A aba Explorar ainda não substitui a leitura cuidadosa de cada conteúdo. Use-a para enxergar padrões e direção, não para tomar decisões finais de pauta.',
    },
  ],
}
