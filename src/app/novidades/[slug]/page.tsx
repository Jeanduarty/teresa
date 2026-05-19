import { ArrowLeft, ArrowRight, Clock3, Sparkles } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { NOVIDADES, getNovidadeBySlug } from '../_content'
import type { Novidade, NovidadeSection } from '../_content'
import { NovidadePageShell } from '../_components/novidade-page-shell'

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

function SectionRenderer({ section }: { section: NovidadeSection }) {
  if (section.type === 'heading') {
    return (
      <h2 className="font-heading mt-10 text-2xl font-bold leading-tight text-[#141414] first:mt-0 sm:text-[1.75rem]">
        {section.text}
      </h2>
    )
  }

  if (section.type === 'paragraph') {
    return (
      <p className="mt-4 text-base leading-[1.85] text-[#444]">
        {section.text}
      </p>
    )
  }

  if (section.type === 'list') {
    return (
      <ul className="mt-4 space-y-2.5">
        {section.items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="relative pl-6 text-base leading-[1.75] text-[#444]"
          >
            <span className="absolute left-0 top-[0.7rem] h-1.5 w-1.5 rounded-full bg-[#181818]" />
            {item}
          </li>
        ))}
      </ul>
    )
  }

  if (section.type === 'quote') {
    return (
      <blockquote className="mt-6 border-l-2 border-[#181818] bg-[#fbfbfa] px-5 py-4">
        <p className="font-heading text-lg leading-relaxed text-[#222]">
          "{section.text}"
        </p>
        {section.author ? (
          <p className="mt-2 text-sm font-medium text-[#666]">— {section.author}</p>
        ) : null}
      </blockquote>
    )
  }

  if (section.type === 'note') {
    return (
      <aside className="mt-6 flex gap-3 rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{section.text}</p>
      </aside>
    )
  }

  return null
}

function NovidadeCard({ entry }: { entry: Novidade }) {
  return (
    <Link
      to={`/novidades/${entry.slug}`}
      className="group flex h-full flex-col rounded-[20px] border border-black/10 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-black/20 hover:shadow-[0_18px_44px_-32px_rgba(0,0,0,0.4)]"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${getCategoryClass(
            entry.category,
          )}`}
        >
          {entry.category}
        </span>
        <span className="text-[11px] font-medium text-[#888]">{entry.date}</span>
      </div>
      <h3 className="font-heading text-base font-semibold leading-tight text-[#181818]">
        {entry.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#666]">
        {entry.summary}
      </p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-semibold text-[#181818] transition-transform group-hover:translate-x-0.5">
        Ler novidade
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  )
}

export function NovidadeDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const entry = slug ? getNovidadeBySlug(slug) : null

  if (!entry) {
    return <Navigate to="/novidades" replace />
  }

  const index = NOVIDADES.findIndex((item) => item.slug === entry.slug)
  const related = NOVIDADES.filter((item) => item.slug !== entry.slug).slice(0, 3)
  const previousEntry = index >= 0 ? NOVIDADES[index + 1] : undefined
  const nextEntry = index > 0 ? NOVIDADES[index - 1] : undefined

  return (
    <NovidadePageShell activePath="novidades">
      <main className="mx-auto w-full max-w-[760px] px-6 py-10 md:px-0 md:py-16">
        <Link
          to="/novidades"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#666] transition-colors hover:text-[#141414]"
        >
          <ArrowLeft className="h-4 w-4" />
          Todas as novidades
        </Link>

        <article className="mt-6">
          <header className="border-b border-black/10 pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${getCategoryClass(
                  entry.category,
                )}`}
              >
                <Sparkles className="h-3 w-3" />
                {entry.category}
              </span>
              <span className="text-xs font-semibold text-[#888]">{entry.date}</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#888]">
                <Clock3 className="h-3 w-3" />
                {entry.readTime} de leitura
              </span>
            </div>

            <h1 className="font-heading mt-5 text-4xl font-bold leading-[1.08] text-[#141414] sm:text-[2.6rem]">
              {entry.title}
            </h1>
            <p className="mt-4 text-lg leading-[1.7] text-[#555]">
              {entry.summary}
            </p>
          </header>

          {entry.highlights && entry.highlights.length > 0 ? (
            <section className="mt-8 grid gap-3 rounded-[20px] border border-black/10 bg-[#fbfbfa] p-5 sm:grid-cols-3">
              {entry.highlights.map((highlight) => (
                <div key={highlight.title} className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">
                    {highlight.title}
                  </p>
                  <p className="text-sm leading-6 text-[#333]">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </section>
          ) : null}

          <div className="mt-8">
            {entry.sections.map((section, index) => (
              <SectionRenderer
                key={`${section.type}-${index}`}
                section={section}
              />
            ))}
          </div>
        </article>

        {previousEntry || nextEntry ? (
          <nav
            aria-label="Navegar entre novidades"
            className="mt-12 grid gap-3 border-t border-black/10 pt-6 sm:grid-cols-2"
          >
            {previousEntry ? (
              <Link
                to={`/novidades/${previousEntry.slug}`}
                className="group rounded-[18px] border border-black/10 bg-white p-4 transition-all hover:border-black/20 hover:shadow-sm"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">
                  Anterior
                </p>
                <p className="mt-1.5 font-heading text-sm font-semibold text-[#181818]">
                  {previousEntry.title}
                </p>
              </Link>
            ) : (
              <span />
            )}

            {nextEntry ? (
              <Link
                to={`/novidades/${nextEntry.slug}`}
                className="group rounded-[18px] border border-black/10 bg-white p-4 text-right transition-all hover:border-black/20 hover:shadow-sm"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">
                  Próxima
                </p>
                <p className="mt-1.5 font-heading text-sm font-semibold text-[#181818]">
                  {nextEntry.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-14">
            <h2 className="font-heading text-base font-semibold uppercase tracking-[0.14em] text-[#888]">
              Outras novidades
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <NovidadeCard key={item.slug} entry={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </NovidadePageShell>
  )
}
