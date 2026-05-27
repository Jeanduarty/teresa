import type { PropsWithChildren } from 'react'

import { Link } from 'react-router-dom'

import { Logo } from '../../../shared/branding/logo'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  footerPrompt: string
  footerAction: string
  footerHref: string
  variant?: 'card' | 'split'
}

function AuthProductShowcase() {
  return (
    <aside className="relative hidden min-h-screen overflow-visible lg:block">
      <div className="absolute inset-0 bg-[#f4f4f2]" />
      <div className="absolute inset-y-0 left-0 w-px bg-black/5" />

      <div className="absolute -left-24 top-1/2 h-[720px] w-[670px] -translate-y-1/2 [perspective:1600px]">
        <div
          className="absolute left-[26px] top-[108px] z-30 rounded-full border border-black/10 bg-white px-6 py-4 text-base font-bold text-[#181818] shadow-[0_28px_60px_-34px_rgba(0,0,0,0.5)]"
          style={{ transform: 'rotateZ(-6deg)' }}
        >
          Mais fácil do que nunca criar conteúdo
        </div>

        <div
          className="absolute left-[78px] top-[250px] z-30 h-[390px] w-[330px] overflow-hidden rounded-[36px] border border-black/10 bg-white p-7 shadow-[0_46px_95px_-42px_rgba(0,0,0,0.58)]"
          style={{ transform: 'rotateX(52deg) rotateZ(-19deg)' }}
        >
          <div className="mb-9 flex items-start justify-between gap-4">
            <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#888]">
              Ideia
            </span>
            <span className="rounded-full bg-[#f4f4f2] px-3 py-1 text-[11px] font-bold text-[#666]">
              novo
            </span>
          </div>
          <p className="font-heading text-4xl font-bold leading-[0.9] text-[#181818]">
            Tópico com uma ideia
          </p>
          <p className="mt-5 text-sm font-semibold leading-5 text-[#555]">
            Escreva uma ideia solta. A Teresa transforma em um tópico pronto para revisar.
          </p>
          <div className="mt-7 space-y-3">
            <div className="rounded-[18px] border border-black/10 bg-[#fafafa] px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#888]">
                Entrada
              </p>
              <p className="mt-1 text-sm font-semibold text-[#444]">
                Tenho uma ideia...
              </p>
            </div>
            <div className="rounded-[18px] border border-black/10 bg-[#181818] px-4 py-3 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">
                Saída
              </p>
              <p className="mt-1 text-sm font-semibold">
                Título, gancho e estrutura.
              </p>
            </div>
          </div>
        </div>

        <div
          className="absolute left-[330px] top-[76px] z-20 h-[530px] w-[340px] overflow-hidden rounded-[38px] border border-black/10 bg-white p-8 shadow-[0_56px_110px_-46px_rgba(0,0,0,0.62)]"
          style={{ transform: 'rotateX(48deg) rotateZ(15deg)' }}
        >
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#888]">
              Redes sociais
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#181818]">
              <span className="h-2.5 w-2.5 rounded-full bg-white" />
            </span>
          </div>
          <p className="mt-16 font-heading text-4xl font-bold leading-[0.9] text-[#181818]">
            Curtidas viram tópicos
          </p>
          <p className="mt-5 text-sm font-semibold leading-5 text-[#555]">
            A Teresa lê padrões do que você curte e salva para sugerir novas ideias.
          </p>
          <div className="mt-8 grid gap-3">
            {['Padrão de retenção', 'Formato recorrente', 'Ângulo possível'].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-[18px] border border-black/10 bg-[#fafafa] px-4 py-3"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#181818]" />
                <p className="text-sm font-semibold text-[#444]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="absolute left-[412px] top-[438px] z-40 h-[218px] w-[285px] rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_38px_74px_-34px_rgba(0,0,0,0.54)]"
          style={{ transform: 'rotateX(42deg) rotateZ(-8deg)' }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#888]">
            Grupo editorial
          </p>
          <p className="mt-5 font-heading text-3xl font-bold leading-[0.95] text-[#181818]">
            Tópicos organizados
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['projeto', 'cliente', 'linha'].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#f4f4f2] px-3 py-1 text-xs font-bold text-[#666]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className="absolute left-[206px] top-[606px] z-50 rounded-[26px] border border-black/10 bg-white px-6 py-4 shadow-[0_26px_56px_-32px_rgba(0,0,0,0.52)]"
          style={{ transform: 'rotateZ(5deg)' }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#888]">
            Próximo passo
          </p>
          <p className="mt-1 text-sm font-bold text-[#444]">
            revisar / salvar / publicar
          </p>
        </div>
      </div>
    </aside>
  )
}

export function AuthLayout({
  title,
  subtitle,
  footerPrompt,
  footerAction,
  footerHref,
  variant = 'card',
  children,
}: PropsWithChildren<AuthLayoutProps>) {
  if (variant === 'split') {
    return (
      <div className="app-shell min-h-screen w-screen overflow-hidden">
        <div className="grid min-h-screen lg:grid-cols-[minmax(460px,52vw)_minmax(0,1fr)]">
          <section className="flex min-h-screen items-center px-6 py-10 sm:px-10 lg:px-16 xl:px-24">
            <div className="w-full max-w-[460px]">
              <div className="mb-12 flex justify-start">
                <Logo
                  imageClassName="h-12 w-12"
                  textClassName="text-[1.55rem] tracking-[0.2em]"
                />
              </div>

              <div className="mb-7 flex flex-col gap-3">
                <h1 className="font-heading text-4xl font-bold leading-[1.05] text-[#141414]">
                  {title}
                </h1>

                {subtitle && (
                  <p className="font-body max-w-[390px] text-base leading-7 text-[#666]">
                    {subtitle}
                  </p>
                )}
              </div>

              {children}

              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="font-body text-sm leading-6 text-[#666]">{footerPrompt}</span>
                <Link
                  to={footerHref}
                  className="font-body text-sm font-semibold leading-6 text-[#181818] hover:underline"
                >
                  {footerAction}
                </Link>
              </div>
            </div>
          </section>

          <AuthProductShowcase />
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell flex min-h-screen w-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="app-panel w-full max-w-[480px] overflow-hidden rounded-[16px]">
        <div className="border-b border-black/10 px-8 py-8 sm:px-10">
          <div className="mb-8 flex justify-center sm:justify-start">
            <Logo
              imageClassName="h-12 w-12"
              textClassName="text-[1.55rem] tracking-[0.2em]"
            />
          </div>
          <div className="mb-6 flex flex-col gap-2">
            <h1 className="font-heading text-2xl font-semibold leading-6 text-[#141414]">{title}</h1>
            <p className="font-body text-base leading-6 text-[#666]">{subtitle}</p>
          </div>
          {children}
        </div>
        <div className="flex items-center justify-center gap-2 px-6 py-6 text-center">
          <span className="font-body text-sm leading-6 text-[#666]">{footerPrompt}</span>
          <Link to={footerHref} className="font-body text-sm font-semibold leading-6 text-[#666] hover:underline">
            {footerAction}
          </Link>
        </div>
      </div>
    </div>
  )
}
