import {
  ArrowRight,
  BookOpenText,
  Clock3,
  Layers3,
  Mail,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { ButtonLink, Card } from '../../components/ui'
import { Logo } from '../../shared/branding/logo'
import { PublicPageShell } from './_components/public-page-shell'

const updates = [
  {
    category: 'Produto',
    date: '15 mai 2026',
    title: 'Um feed simples para acompanhar as ideias que importam',
    summary:
      'A Teresa organiza sinais das redes sociais em topicos prontos para revisar, salvar e transformar em conteudo.',
    readTime: '3 min',
  },
  {
    category: 'Workflow',
    date: '12 mai 2026',
    title: 'Como transformar curtidas em pautas de publicacao',
    summary:
      'O novo fluxo prioriza referencias, tags e status para separar ideias pendentes das que ja viraram post.',
    readTime: '4 min',
  },
  {
    category: 'Bastidores',
    date: '09 mai 2026',
    title: 'Por que a Teresa foca em pequenos sinais diarios',
    summary:
      'A ideia e reduzir a tela em branco: menos planilhas, mais contexto sobre o que voce ja salvou e curtiu.',
    readTime: '2 min',
  },
]

const highlights = [
  {
    icon: Layers3,
    label: 'Topicos agrupados',
    value: 'Organize ideias por tema, status e origem.',
  },
  {
    icon: Sparkles,
    label: 'Rascunhos acionaveis',
    value: 'Use os insights como ponto de partida para novos posts.',
  },
  {
    icon: BookOpenText,
    label: 'Referencias visiveis',
    value: 'Volte ao sinal original quando precisar de contexto.',
  },
]

export function PublicLandingPage() {
  return (
    <PublicPageShell activePath="public">
      <main className="mx-auto w-full max-w-[1128px] px-6 py-10 md:px-0 md:py-14">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="flex min-h-[520px] flex-col justify-between rounded-[24px] border border-black/10 bg-white p-6 shadow-elevation-1 sm:p-8 lg:p-10">
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#f4f4f2] px-3 py-1.5 text-xs font-semibold text-[#666]">
                <Mail className="h-3.5 w-3.5" />
                Newsletter de produto
              </div>

              <h1 className="font-heading max-w-[760px] text-4xl font-bold leading-[1.02] text-[#141414] sm:text-5xl lg:text-6xl">
                Teresa
              </h1>
              <p className="mt-5 max-w-[680px] text-base leading-7 text-[#666] sm:text-lg sm:leading-8">
                Novidades sobre uma aplicacao para transformar sinais sociais em topicos,
                referencias e rascunhos de conteudo sem perder o contexto.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink to="/" size="lg" className="rounded-full">
                  Ir para o app
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink to="#novidades" variant="outline" size="lg" className="rounded-full">
                  Ler novidades
                </ButtonLink>
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.label}
                    className="rounded-[18px] border border-black/10 bg-[#fbfbfa] p-4"
                  >
                    <Icon className="mb-3 h-5 w-5 text-[#181818]" />
                    <h2 className="font-heading text-sm font-semibold text-[#141414]">{item.label}</h2>
                    <p className="mt-2 text-sm leading-6 text-[#666]">{item.value}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <aside className="rounded-[24px] border border-black/10 bg-white p-5 shadow-elevation-1">
            <div className="rounded-[20px] bg-[#f4f4f2] p-5">
              <Logo imageClassName="h-12 w-12" textClassName="text-[1.1rem]" />
              <p className="mt-5 text-sm leading-6 text-[#666]">
                Um resumo simples das melhorias, ideias de uso e bastidores do produto.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-[18px] border border-black/10 bg-white p-4">
                <p className="text-xs font-semibold uppercase text-[#777]">Hoje</p>
                <h2 className="font-heading mt-2 text-lg font-semibold text-[#141414]">
                  Novidades curtas, direto ao ponto
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#666]">
                  Acompanhe alteracoes de produto e entre no app quando quiser revisar seus topicos.
                </p>
              </div>

              <ButtonLink to="/" fullWidth size="lg" className="rounded-full">
                Abrir Teresa
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </aside>
        </section>

        <section id="novidades" className="mt-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-[#141414]">Ultimas novidades</h2>
              <p className="mt-1 text-sm leading-6 text-[#666]">
                Um blog leve para acompanhar o que mudou e como usar melhor a Teresa.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#181818] hover:underline"
            >
              Entrar no app
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {updates.map((post) => (
              <Card
                key={post.title}
                as="article"
                className="flex min-h-[300px] flex-col rounded-[22px] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_48px_-34px_rgba(0,0,0,0.55)]"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f4f4f2] px-2.5 py-1 text-[11px] font-semibold text-[#666]">
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#777]">
                    <Clock3 className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#777]">{post.date}</p>
                <h3 className="font-heading mt-3 text-xl font-semibold leading-tight text-[#181818]">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#666]">{post.summary}</p>
                <Link
                  to="/"
                  className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[#181818] hover:underline"
                >
                  Ver no app
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </PublicPageShell>
  )
}
