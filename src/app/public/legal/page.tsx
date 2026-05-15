import { Navigate, useParams } from 'react-router-dom'

import { PublicPageShell } from '../_components/public-page-shell'

type LegalPageSlug = 'terms' | 'privacy'

interface LegalSection {
  title?: string
  body: string
  notice?: boolean
}

interface LegalPageContent {
  title: string
  description: string
  sections: LegalSection[]
}

const lastUpdated = '15 de maio de 2026'

const legalPages: Record<LegalPageSlug, LegalPageContent> = {
  terms: {
    title: 'Termos de Servico',
    description:
      'Estes termos explicam como a Teresa pode ser usada para conectar contas sociais, analisar atividade autorizada e gerar ideias de conteudo.',
    sections: [
      {
        notice: true,
        body:
          'A Teresa e uma ferramenta pessoal de inteligencia de conteudo. Ela ajuda usuarios a revisar padroes da atividade social autorizada e transformar esses padroes em resumos de topicos, ideias de conteudo e rascunhos de roteiro.',
      },
      {
        title: '1. Aceite destes termos',
        body:
          'Ao acessar ou usar a Teresa, voce concorda com estes Termos de Servico. Se voce nao concordar, nao use a aplicacao nem conecte nenhuma conta social.',
      },
      {
        title: '2. O que a Teresa faz',
        body:
          'A Teresa permite criar uma conta, conectar provedores sociais suportados como TikTok e X/Twitter, coletar sinais de atividade autorizados e gerar topicos diarios, resumos e sugestoes de roteiro com base nessa atividade.',
      },
      {
        title: '3. Autorizacao de contas sociais',
        body:
          'Voce e responsavel por autorizar apenas contas que possui ou tem permissao para gerenciar. A Teresa so tenta acessar dados sociais depois que voce concede permissao pelo fluxo de autorizacao do provedor. O acesso pode ser limitado pelo provedor, processo de revisao, disponibilidade de API, limites de uso e permissoes concedidas.',
      },
      {
        title: '4. Conteudo do usuario e saidas geradas',
        body:
          'A Teresa pode usar posts autorizados, curtidas, itens salvos, legendas, metadados publicos, links e sinais relacionados para criar relatorios, topicos, resumos e rascunhos. As saidas geradas servem como ponto de partida criativo. Voce e responsavel por revisar, editar e decidir se usara qualquer conteudo gerado.',
      },
      {
        title: '5. Uso aceitavel',
        body:
          'Voce concorda em nao usar a Teresa para violar leis, termos de provedores, direitos de propriedade intelectual, direitos de privacidade ou politicas de plataformas. Voce nao deve tentar contornar autorizacao, coletar dados sem permissao, abusar de APIs de provedores ou usar a Teresa para gerar conteudo nocivo, enganoso ou ilegal.',
      },
      {
        title: '6. Exclusao de conta',
        body:
          'Voce pode solicitar a exclusao da conta nas configuracoes da aplicacao. Quando uma conta e excluida, a Teresa marca a conta do usuario como excluida e desconecta contas sociais vinculadas. Alguns registros podem ser retidos temporariamente quando necessario para seguranca, depuracao, conformidade legal ou prevencao de abuso.',
      },
      {
        title: '7. Disponibilidade e mudancas',
        body:
          'A Teresa e fornecida atualmente como produto em estagio inicial. Funcionalidades podem mudar, falhar ou ser removidas. Integracoes de terceiros podem parar de funcionar se politicas, escopos, APIs, credenciais ou status de revisao dos provedores mudarem.',
      },
      {
        title: '8. Isencao de garantias',
        body:
          'A Teresa e fornecida como esta, sem garantias de qualquer tipo. A Teresa nao garante que topicos ou roteiros gerados serao precisos, completos, originais, adequados para publicacao ou compatíveis com qualquer politica de plataforma.',
      },
      {
        title: '9. Contato',
        body:
          'Perguntas sobre estes termos devem ser direcionadas ao operador da Teresa pelo canal de conta ou suporte disponibilizado ao usuario.',
      },
    ],
  },
  privacy: {
    title: 'Politica de Privacidade',
    description:
      'Esta politica explica o que a Teresa coleta, como dados sociais autorizados sao usados e como usuarios controlam sua conta.',
    sections: [
      {
        notice: true,
        body:
          'A Teresa foi projetada para usar apenas dados que o usuario autoriza por fluxos de provedores suportados. O objetivo da coleta e gerar insights de conteudo, relatorios de topicos e sugestoes de rascunhos para o usuario.',
      },
      {
        title: '1. Informacoes que coletamos',
        body:
          'A Teresa pode coletar informacoes de conta como e-mail, nome de usuario, hash de senha, nome de perfil, foto de perfil, metadados de sessao e status da conta. A Teresa tambem pode armazenar identificadores de contas sociais vinculadas, handles, tokens de acesso, refresh tokens, datas de expiracao, permissoes concedidas e status de conexao.',
      },
      {
        title: '2. Dados sociais autorizados',
        body:
          'Quando voce conecta um provedor como TikTok ou X/Twitter, a Teresa pode solicitar dados de atividade autorizados, como itens curtidos, itens salvos, texto de posts, legendas, handles de criadores, URLs publicas, timestamps e metadados do provedor. Os dados disponiveis dependem do provedor, aprovacao de revisao, escopos concedidos e limitacoes da API.',
      },
      {
        title: '3. Como usamos os dados',
        body:
          'A Teresa usa os dados coletados para autenticar usuarios, manter sessoes, conectar provedores sociais, coletar sinais diarios de atividade, agrupar conteudos semelhantes, gerar relatorios de topicos, produzir ideias de conteudo, mostrar referencias que originaram cada topico e melhorar a confiabilidade da aplicacao.',
      },
      {
        title: '4. Processamento por IA',
        body:
          'A Teresa pode enviar sinais de atividade selecionados e textos relacionados para um provedor de IA para gerar resumos, agrupamentos de topicos e rascunhos. A aplicacao busca enviar apenas os dados necessarios para o relatorio ou sugestao solicitada.',
      },
      {
        title: '5. Armazenamento e seguranca',
        body:
          'A Teresa armazena dados da aplicacao em seu banco de dados backend e armazena arquivos de avatar no backend enquanto esta implementacao inicial esta sendo testada. Tokens de acesso sao usados para chamar APIs autorizadas de provedores. Salvaguardas tecnicas razoaveis sao usadas, mas nenhum sistema pode ser garantido como completamente seguro.',
      },
      {
        title: '6. Compartilhamento',
        body:
          'A Teresa nao vende dados pessoais. Dados podem ser processados por provedores de infraestrutura, banco de dados, IA, APIs sociais ou outros prestadores necessarios para operar a aplicacao. A Teresa pode divulgar informacoes quando exigido por lei, seguranca ou prevencao de abuso.',
      },
      {
        title: '7. Controles do usuario',
        body:
          'Voce pode desconectar contas sociais suportadas nas configuracoes. Voce pode excluir sua conta Teresa na area de perigo das configuracoes. Excluir uma conta marca a conta como excluida e desconecta contas sociais vinculadas. Voce tambem pode revogar o acesso da Teresa nas configuracoes do provedor correspondente quando suportado.',
      },
      {
        title: '8. Retencao',
        body:
          'A Teresa mantem dados enquanto a conta estiver ativa ou enquanto necessario para fornecer o servico. Contas excluidas e contas sociais desconectadas podem reter registros limitados temporariamente para seguranca, depuracao, conformidade legal ou prevencao de abuso.',
      },
      {
        title: '9. Criancas',
        body:
          'A Teresa nao se destina a criancas. Usuarios devem conectar contas apenas quando forem legalmente autorizados a conceder acesso aos dados do provedor envolvido.',
      },
      {
        title: '10. Contato',
        body:
          'Perguntas sobre privacidade ou solicitacoes de exclusao devem ser direcionadas ao operador da Teresa pelo canal de conta ou suporte disponibilizado ao usuario.',
      },
    ],
  },
}

function isLegalPageSlug(page: string | undefined): page is LegalPageSlug {
  return page === 'terms' || page === 'privacy'
}

export function LegalPage() {
  const { page } = useParams<{ page: string }>()

  if (!isLegalPageSlug(page)) {
    return <Navigate to="/legal/terms" replace />
  }

  const content = legalPages[page]

  return (
    <PublicPageShell activePath={page}>
      <main className="mx-auto w-full max-w-[960px] px-6 py-10 md:px-0 md:py-14">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#777]">Legal</p>
          <h1 className="font-heading mt-3 text-4xl font-bold leading-tight text-[#141414] sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 max-w-[760px] text-base leading-7 text-[#666]">
            {content.description}
          </p>
        </header>

        <article className="rounded-[24px] border border-black/10 bg-white p-6 shadow-elevation-1 sm:p-8">
          <div className="grid gap-6">
            {content.sections.map((section) => (
              <section
                key={section.title ?? section.body}
                className={
                  section.notice
                    ? 'rounded-[18px] bg-[#f4f4f2] p-5'
                    : 'border-t border-black/10 pt-6 first:border-t-0 first:pt-0'
                }
              >
                {section.title ? (
                  <h2 className="font-heading text-lg font-semibold text-[#141414]">
                    {section.title}
                  </h2>
                ) : null}
                <p className={`${section.title ? 'mt-2' : ''} text-sm leading-7 text-[#666]`}>
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </article>

        <p className="mt-5 text-sm leading-6 text-[#777]">
          Ultima atualizacao: {lastUpdated}. Esta pagina e fornecida para transparencia do
          usuario e revisao da aplicacao.
        </p>
      </main>
    </PublicPageShell>
  )
}
