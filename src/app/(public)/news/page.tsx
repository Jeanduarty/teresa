import { ArrowRight, Clock3, Mail, Radio, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { NOVIDADES } from './_content'
import { NovidadePageShell } from './_components/novidade-page-shell'

const CATEGORY_STYLES: Record<string, string> = {
  Lançamento: 'bg-[#181818] text-white',
  Produto: 'bg-[#eef2ff] text-[#3730a3] ring-1 ring-[#c7d2fe]',
  Melhoria: 'bg-[#ecfdf5] text-[#047857] ring-1 ring-[#a7f3d0]',
  Correção: 'bg-[#fef3c7] text-[#92400e] ring-1 ring-[#fde68a]',
  Bastidores: 'bg-[#fdf2f8] text-[#9d174d] ring-1 ring-[#fbcfe8]',
  Workflow: 'bg-[#f4f4f2] text-[#444] ring-1 ring-black/10',
}

function getCategoryClass(category: string): string {
  return CATEGORY_STYLES[category] ?? CATEGORY_STYLES.Workflow
}

export function NovidadesListPage() {
  const [featured, ...rest] = NOVIDADES

  return (
    <NovidadePageShell activePath="news">
      <main className="mx-auto w-full max-w-[1128px] px-6 py-10 md:px-0 md:py-16">
        <section className="mb-10 flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#666]">
            <Radio className="h-3.5 w-3.5 text-[#181818]" />
            Diário de produto
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-4xl font-bold leading-[1.05] text-[#141414] sm:text-5xl">
              Novidades da Teresa
            </h1>
            <p className="max-w-[680px] text-base leading-7 text-[#666] sm:text-lg">
              Um registro contínuo das mudanças, lançamentos e bastidores do produto.
              Cada entrada vira uma página própria com detalhes do que mudou e por quê.
            </p>
          </div>
        </section>

        {featured ? (
          <Link
            to={`/news/${featured.slug}`}
            className="group mb-10 block overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_24px_60px_-44px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-40px_rgba(0,0,0,0.45)]"
          >
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_minmax(0,260px)] lg:items-end lg:p-10">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${getCategoryClass(
                      featured.category,
                    )}`}
                  >
                    <Sparkles className="h-3 w-3" />
                    {featured.category}
                  </span>
                  <span className="text-xs font-semibold text-[#888]">
                    {featured.date}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#888]">
                    <Clock3 className="h-3 w-3" />
                    {featured.readTime}
                  </span>
                </div>

                <h2 className="font-heading mt-5 text-3xl font-bold leading-[1.1] text-[#141414] sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-[620px] text-base leading-7 text-[#555]">
                  {featured.summary}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#181818] transition-transform group-hover:translate-x-0.5">
                  Ler novidade completa
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>

              {featured.highlights && featured.highlights.length > 0 ? (
                <ul className="space-y-2.5">
                  {featured.highlights.slice(0, 3).map((highlight) => (
                    <li
                      key={highlight.title}
                      className="rounded-[14px] border border-black/10 bg-[#fbfbfa] px-3.5 py-3"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                        {highlight.title}
                      </p>
                      <p className="mt-1 text-sm leading-5 text-[#444]">
                        {highlight.description}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Link>
        ) : null}

        {rest.length > 0 ? (
          <section>
            <header className="mb-5 flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#888]" />
              <h2 className="font-heading text-base font-semibold uppercase tracking-[0.16em] text-[#888]">
                Edições anteriores
              </h2>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((entry) => (
                <Link
                  key={entry.slug}
                  to={`/news/${entry.slug}`}
                  className="group flex h-full flex-col rounded-[22px] border border-black/10 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-black/20 hover:shadow-[0_22px_48px_-34px_rgba(0,0,0,0.45)]"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${getCategoryClass(
                        entry.category,
                      )}`}
                    >
                      {entry.category}
                    </span>
                    <span className="text-[11px] font-medium text-[#888]">
                      {entry.date}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-semibold leading-tight text-[#181818]">
                    {entry.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#666]">
                    {entry.summary}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#888]">
                      <Clock3 className="h-3 w-3" />
                      {entry.readTime}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#181818] transition-transform group-hover:translate-x-0.5">
                      Ler
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </NovidadePageShell>
  )
}
