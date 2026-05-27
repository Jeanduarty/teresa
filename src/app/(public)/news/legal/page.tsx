import { Navigate, useParams } from 'react-router-dom'

import { NovidadePageShell } from '../_components/novidade-page-shell'

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
    title: 'Termos de Serviço',
    description:
      'Estes termos explicam como a Teresa pode ser usada para conectar contas sociais, analisar atividade autorizada e gerar ideias de conteúdo.',
    sections: [
      {
        notice: true,
        body:
          'A Teresa é uma ferramenta pessoal de inteligência de conteúdo. Ela ajuda usuários a revisar padrões da atividade social autorizada e transformar esses padrões em resumos de tópicos, ideias de conteúdo e rascunhos de roteiro.',
      },
      {
        title: '1. Aceite destes termos',
        body:
          'Ao acessar ou usar a Teresa, você concorda com estes Termos de Serviço. Se você não concordar, não use a aplicação nem conecte nenhuma conta social.',
      },
      {
        title: '2. O que a Teresa faz',
        body:
          'A Teresa permite criar uma conta, conectar provedores sociais suportados como TikTok e X/Twitter, coletar sinais de atividade autorizados e gerar tópicos diários, resumos e sugestões de roteiro com base nessa atividade.',
      },
      {
        title: '3. Autorização de contas sociais',
        body:
          'Você é responsável por autorizar apenas contas que possui ou tem permissão para gerenciar. A Teresa só tenta acessar dados sociais depois que você concede permissão pelo fluxo de autorização do provedor. O acesso pode ser limitado pelo provedor, processo de revisão, disponibilidade de API, limites de uso e permissões concedidas.',
      },
      {
        title: '4. Conteúdo do usuário e saídas geradas',
        body:
          'A Teresa pode usar posts autorizados, curtidas, itens salvos, legendas, metadados públicos, links e sinais relacionados para criar relatórios, tópicos, resumos e rascunhos. As saídas geradas servem como ponto de partida criativo. Você é responsável por revisar, editar e decidir se usará qualquer conteúdo gerado.',
      },
      {
        title: '5. Uso aceitável',
        body:
          'Você concorda em não usar a Teresa para violar leis, termos de provedores, direitos de propriedade intelectual, direitos de privacidade ou políticas de plataformas. Você não deve tentar contornar autorização, coletar dados sem permissão, abusar de APIs de provedores ou usar a Teresa para gerar conteúdo nocivo, enganoso ou ilegal.',
      },
      {
        title: '6. Exclusão de conta',
        body:
          'Você pode solicitar a exclusão da conta nas configurações da aplicação. Quando uma conta é excluída, a Teresa marca a conta do usuário como excluída e desconecta contas sociais vinculadas. Alguns registros podem ser retidos temporariamente quando necessário para segurança, depuração, conformidade legal ou prevenção de abuso.',
      },
      {
        title: '7. Disponibilidade e mudanças',
        body:
          'A Teresa é fornecida atualmente como produto em estágio inicial. Funcionalidades podem mudar, falhar ou ser removidas. Integrações de terceiros podem parar de funcionar se políticas, escopos, APIs, credenciais ou status de revisão dos provedores mudarem.',
      },
      {
        title: '8. Isenção de garantias',
        body:
          'A Teresa é fornecida como está, sem garantias de qualquer tipo. A Teresa não garante que tópicos ou roteiros gerados serão precisos, completos, originais, adequados para publicação ou compatíveis com qualquer política de plataforma.',
      },
      {
        title: '9. Contato',
        body:
          'Perguntas sobre estes termos devem ser direcionadas ao operador da Teresa pelo canal de conta ou suporte disponibilizado ao usuário.',
      },
    ],
  },
  privacy: {
    title: 'Política de Privacidade',
    description:
      'Esta política explica o que a Teresa coleta, como dados sociais autorizados são usados e como usuários controlam sua conta.',
    sections: [
      {
        notice: true,
        body:
          'A Teresa foi projetada para usar apenas dados que o usuário autoriza por fluxos de provedores suportados. O objetivo da coleta é gerar insights de conteúdo, relatórios de tópicos e sugestões de rascunhos para o usuário.',
      },
      {
        title: '1. Informações que coletamos',
        body:
          'A Teresa pode coletar informações de conta como e-mail, nome de usuário, hash de senha, nome de perfil, foto de perfil, metadados de sessão e status da conta. A Teresa também pode armazenar identificadores de contas sociais vinculadas, handles, tokens de acesso, refresh tokens, datas de expiração, permissões concedidas e status de conexão.',
      },
      {
        title: '2. Dados sociais autorizados',
        body:
          'Quando você conecta um provedor como TikTok ou X/Twitter, a Teresa pode solicitar dados de atividade autorizados, como itens curtidos, itens salvos, texto de posts, legendas, handles de criadores, URLs públicas, timestamps e metadados do provedor. Os dados disponíveis dependem do provedor, aprovação de revisão, escopos concedidos e limitações da API.',
      },
      {
        title: '3. Como usamos os dados',
        body:
          'A Teresa usa os dados coletados para autenticar usuários, manter sessões, conectar provedores sociais, coletar sinais diários de atividade, agrupar conteúdos semelhantes, gerar relatórios de tópicos, produzir ideias de conteúdo, mostrar referências que originaram cada tópico e melhorar a confiabilidade da aplicação.',
      },
      {
        title: '4. Processamento por IA',
        body:
          'A Teresa pode enviar sinais de atividade selecionados e textos relacionados para um provedor de IA para gerar resumos, agrupamentos de tópicos e rascunhos. A aplicação busca enviar apenas os dados necessários para o relatório ou sugestão solicitada.',
      },
      {
        title: '5. Armazenamento e segurança',
        body:
          'A Teresa armazena dados da aplicação em seu banco de dados backend e armazena arquivos de avatar no backend enquanto esta implementação inicial está sendo testada. Tokens de acesso são usados para chamar APIs autorizadas de provedores. Salvaguardas técnicas razoáveis são usadas, mas nenhum sistema pode ser garantido como completamente seguro.',
      },
      {
        title: '6. Compartilhamento',
        body:
          'A Teresa não vende dados pessoais. Dados podem ser processados por provedores de infraestrutura, banco de dados, IA, APIs sociais ou outros prestadores necessários para operar a aplicação. A Teresa pode divulgar informações quando exigido por lei, segurança ou prevenção de abuso.',
      },
      {
        title: '7. Controles do usuário',
        body:
          'Você pode desconectar contas sociais suportadas nas configurações. Você pode excluir sua conta Teresa na área de perigo das configurações. Excluir uma conta marca a conta como excluída e desconecta contas sociais vinculadas. Você também pode revogar o acesso da Teresa nas configurações do provedor correspondente quando suportado.',
      },
      {
        title: '8. Retenção',
        body:
          'A Teresa mantém dados enquanto a conta estiver ativa ou enquanto necessário para fornecer o serviço. Contas excluídas e contas sociais desconectadas podem reter registros limitados temporariamente para segurança, depuração, conformidade legal ou prevenção de abuso.',
      },
      {
        title: '9. Crianças',
        body:
          'A Teresa não se destina a crianças. Usuários devem conectar contas apenas quando forem legalmente autorizados a conceder acesso aos dados do provedor envolvido.',
      },
      {
        title: '10. Contato',
        body:
          'Perguntas sobre privacidade ou solicitações de exclusão devem ser direcionadas ao operador da Teresa pelo canal de conta ou suporte disponibilizado ao usuário.',
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
    <NovidadePageShell activePath={page}>
      <main className="mx-auto w-full max-w-[960px] px-6 py-10 md:px-0 md:py-14">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#888]">
            Legal
          </p>
          <h1 className="font-heading mt-3 text-4xl font-bold leading-tight text-[#141414] sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 max-w-[760px] text-base leading-7 text-[#666]">
            {content.description}
          </p>
        </header>

        <article className="rounded-[24px] border border-black/10 bg-white p-6 shadow-[0_18px_44px_-34px_rgba(0,0,0,0.35)] sm:p-8">
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
                <p
                  className={`${section.title ? 'mt-2' : ''} text-sm leading-7 text-[#666]`}
                >
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </article>

        <p className="mt-5 text-sm leading-6 text-[#777]">
          Última atualização: {lastUpdated}. Esta página é fornecida para
          transparência do usuário e revisão da aplicação.
        </p>
      </main>
    </NovidadePageShell>
  )
}
