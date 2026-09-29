import type { Novidade } from './types'

export const novidade: Novidade = {
  slug: '2026-05-25-fechando-o-loop',
  category: 'Produto',
  date: '25 mai 2026',
  publishedAt: '2026-05-25',
  title: 'Fechando o loop: onde você postou e como o post se saiu',
  summary:
    'A Teresa agora acompanha o que você publica. Ao marcar um tópico como feito, você informa o link do post — e a partir daí ela monitora visualizações, curtidas, comentários e compartilhamentos automaticamente, direto do TikTok e do X.',
  readTime: '4 min',
  highlights: [
    {
      title: 'Link obrigatório ao marcar como feito',
      description:
        'Ao marcar um tópico como feito, um campo aparece pedindo onde você publicou. Esse link é o ponto de partida para o monitoramento.',
    },
    {
      title: 'Métricas automáticas',
      description:
        'A Teresa busca visualizações, curtidas, comentários e compartilhamentos do TikTok e do X, sem você precisar fazer nada.',
    },
    {
      title: 'Monitoramento contínuo por 6 meses',
      description:
        'Os posts são verificados uma vez por semana, por até 6 meses após a publicação, para capturar crescimento tardio.',
    },
  ],
  sections: [
    {
      type: 'paragraph',
      text:
        'Até agora a Teresa ajudava a gerar e organizar tópicos, mas não sabia o que acontecia depois que você publicava. Com essa atualização, ela começa a fechar esse loop: você informa onde postou e ela passa a monitorar o desempenho daquele conteúdo de forma automática.',
    },
    {
      type: 'heading',
      text: 'Link obrigatório ao marcar como feito',
    },
    {
      type: 'paragraph',
      text:
        'Quando você clica em "Marcar como feito" em qualquer tópico — seja na home ou na página de detalhe —, um dialog aparece pedindo o link do post publicado. O campo é obrigatório: sem o link, não há como monitorar. Cole a URL do TikTok ou do X e confirme.',
    },
    {
      type: 'heading',
      text: 'Como o monitoramento funciona',
    },
    {
      type: 'list',
      items: [
        'Todos os dias às 3h da manhã, a Teresa verifica os posts que precisam de atualização de métricas.',
        'Um post é verificado quando tem pelo menos 7 dias desde a última busca de métricas.',
        'Posts com mais de 6 meses de publicação saem da fila automaticamente, sem consumir recursos para conteúdo muito antigo.',
        'Para o TikTok, a busca usa a sessão web conectada à sua conta. Para o X, usa o token de acesso da conta vinculada.',
      ],
    },
    {
      type: 'heading',
      text: 'O que é coletado',
    },
    {
      type: 'list',
      items: [
        'Visualizações',
        'Curtidas',
        'Comentários',
        'Compartilhamentos / repostagens',
      ],
    },
    {
      type: 'heading',
      text: 'Por que 7 dias e 6 meses',
    },
    {
      type: 'paragraph',
      text:
        'A janela de 7 dias evita buscas excessivas para posts que ainda estão na fase de distribuição inicial. A janela de 6 meses garante que posts que crescem aos poucos ainda sejam acompanhados — algo comum em conteúdo de nicho ou evergreen —, mas sem acumular dados de posts que já esgotaram o potencial de crescimento.',
    },
    {
      type: 'heading',
      text: 'Nova organização da home',
    },
    {
      type: 'paragraph',
      text:
        'A home também teve a interface reorganizada para deixar as ações principais mais visíveis:',
    },
    {
      type: 'list',
      items: [
        '"Tenho uma ideia" e "Gerar tópicos" viraram cards destacados logo abaixo do resumo do seu perfil.',
        'Os botões Grupos e Filtros voltaram para o lado direito do título da lista de tópicos, deixando o topo mais limpo.',
        'Os badges de conta conectada agora mostram a plataforma individualmente: "TikTok conectado" e "X conectado" como itens separados. Se nenhuma conta estiver ativa, aparece "0 redes conectadas".',
      ],
    },
    {
      type: 'heading',
      text: '"Como a Teresa te vê" no menu',
    },
    {
      type: 'paragraph',
      text:
        'O menu do perfil ganhou um novo item: "Como a Teresa te vê". Ele leva para a página que mostra o perfil que a Teresa montou a partir do que você consome: nicho, tom de voz, padrões de formato, referências e posicionamento percebido. Antes esse acesso ficava em outro lugar; agora está um clique acima no fluxo principal.',
    },
    {
      type: 'note',
      text:
        'O monitoramento de métricas é o primeiro passo para que a Teresa entenda o que funciona no seu conteúdo. Em versões futuras, esses dados vão alimentar diretamente as sugestões de novos tópicos.',
    },
  ],
}
