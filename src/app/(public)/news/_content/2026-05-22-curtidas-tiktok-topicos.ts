import type { Novidade } from './types'

export const novidade: Novidade = {
  slug: '2026-05-22-curtidas-tiktok-topicos',
  category: 'Lançamento',
  date: '22 mai 2026',
  publishedAt: '2026-05-22',
  title: 'Tópicos gerados a partir das suas curtidas do TikTok',
  summary:
    'A Teresa agora lê os vídeos que você curtiu no TikTok, entende áudio, imagem, texto e ritmo, e transforma esses sinais em tópicos prontos para criar conteúdo.',
  readTime: '6 min',
  highlights: [
    {
      title: 'Curtidas como sinal',
      description:
        'Os vídeos curtidos viram referências reais para entender seu gosto, repertório e padrões de retenção.',
    },
    {
      title: 'Análise multimodal',
      description:
        'A Teresa combina fala, música, texto na tela, cenas e elementos visuais antes de sugerir uma ideia.',
    },
    {
      title: 'Roteiro acionável',
      description:
        'Cada tópico chega com direção estratégica e uma versão simplificada para gravar com hook, cenas e payoff.',
    },
  ],
  sections: [
    {
      type: 'paragraph',
      text:
        'A geração de tópicos da Teresa ganhou uma camada nova: agora as curtidas do TikTok podem virar matéria-prima para ideias de conteúdo. Em vez de olhar só para texto ou métricas superficiais, a Teresa interpreta o vídeo como um conjunto de sinais: o que aparece na tela, como a edição se comporta, qual emoção domina, que tipo de música sustenta o ritmo e por que aquilo prende atenção.',
    },
    {
      type: 'heading',
      text: 'Como funciona',
    },
    {
      type: 'list',
      items: [
        'Você inicia a geração de tópicos e a Teresa coleta os vídeos curtidos da sua conta conectada do TikTok.',
        'Cada vídeo é analisado em várias camadas: áudio, transcrição, música, cortes de cena, frames, texto na tela e leitura visual.',
        'A Teresa junta tudo numa análise do vídeo, separando tema, emoção, estética, formato, público e fonte principal de retenção.',
        'Depois disso, a Teresa identifica o DNA viral por trás das referências e gera tópicos originais para o seu feed.',
      ],
    },
    {
      type: 'heading',
      text: 'O foco não é copiar o assunto',
    },
    {
      type: 'paragraph',
      text:
        'A parte mais importante do fluxo é separar tema de mecanismo. Um vídeo pode falar sobre um assunto específico, mas funcionar porque tem uma escalada de caos, uma vergonha compartilhada, uma tensão social, um ritmo de edição muito forte ou uma personalidade impossível de ignorar. A Teresa tenta preservar esse mecanismo e recompor uma ideia nova, em outro contexto.',
    },
    {
      type: 'heading',
      text: 'Dois modos de roteiro',
    },
    {
      type: 'list',
      items: [
        'Modo estratégico: título, resumo, formato, ângulo, DNA viral, mecanismo de retenção, recomposição criativa e outline.',
        'Modo pronto para gravar: hook, cenas, ação, fala, reação, timing, cortes, texto na tela, payoff final, CTA e legenda.',
      ],
    },
    {
      type: 'heading',
      text: 'Respeitando o tipo de retenção',
    },
    {
      type: 'paragraph',
      text:
        'Quando a retenção vem da personalidade do criador, a Teresa evita gerar um tópico temático demais. Quando vem do assunto, ela ancora a ideia no nicho ou na tendência. Quando vem do formato, da emoção ou de um conflito social, o tópico preserva essa força principal sem ficar preso ao vídeo original.',
    },
    {
      type: 'heading',
      text: 'Disponibilidade e limites',
    },
    {
      type: 'list',
      items: [
        'A coleta depende de uma sessão web ativa do TikTok conectada à Teresa.',
        'O processamento pode levar alguns minutos porque cada vídeo passa por análise multimodal antes da geração dos tópicos.',
        'Para evitar execuções repetidas e preservar estabilidade, existe um intervalo entre novas gerações de tópicos.',
      ],
    },
    {
      type: 'note',
      text:
        'Essa atualização torna as curtidas mais úteis como repertório criativo, mas os tópicos continuam sendo ponto de partida. Revise, adapte ao seu posicionamento e grave com a sua voz.',
    },
  ],
}
