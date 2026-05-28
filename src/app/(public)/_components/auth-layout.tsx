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
    <aside aria-hidden="true" className="relative hidden min-h-screen overflow-visible lg:block">
      <div className="absolute inset-0 bg-[#f4f4f2]" />
      <div className="absolute inset-y-0 left-0 w-px bg-black/5" />

      <div className="absolute -left-28 top-1/2 h-[720px] w-[900px] -translate-y-1/2 [perspective:1700px]">
        <div className="absolute left-[74px] top-[44px] h-[640px] w-[780px] rounded-full bg-white/75 blur-3xl" />

        <div
          className="absolute left-[112px] top-[44px] z-50 flex items-center gap-4 rounded-full border border-black/10 bg-white px-5 py-3.5 shadow-[0_28px_60px_-34px_rgba(0,0,0,0.5)]"
          style={{ transform: 'rotateZ(-4deg)' }}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff1be]">
            <span className="h-5 w-5 rounded-full border-2 border-[#181818]" />
          </span>
          <span className="text-base font-bold text-[#181818]">
            Mais fácil do que nunca criar conteúdo
          </span>
        </div>

        <div
          className="absolute left-[112px] top-[126px] z-20 w-[700px] overflow-hidden rounded-[40px] border border-black/10 bg-white shadow-[0_70px_140px_-54px_rgba(0,0,0,0.68)]"
          style={{
            aspectRatio: '1243 / 969',
            transform: 'rotateX(21deg) rotateZ(-5deg)',
          }}
        >
          <img
            src="/auth-home-preview.webp"
            alt=""
            width="1280"
            height="998"
            decoding="async"
            loading="eager"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.opacity = '0'
            }}
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/50" />
        </div>

        <div
          className="absolute left-[38px] top-[350px] z-40 w-[292px] rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_38px_78px_-38px_rgba(0,0,0,0.58)]"
          style={{ transform: 'rotateZ(-8deg)' }}
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#fff1be]">
              <span className="h-5 w-5 rounded-full border-2 border-[#181818]" />
            </span>
            <span className="rounded-full bg-[#f4f4f2] px-3 py-1 text-[11px] font-bold text-[#666]">
              entrada manual
            </span>
          </div>
          <p className="font-heading text-3xl font-bold leading-[0.95] text-[#181818]">
            Gere a partir de uma ideia
          </p>
          <p className="mt-4 text-sm font-semibold leading-5 text-[#555]">
            Escreva uma frase solta. A Teresa organiza perguntas, ângulo e tópico.
          </p>
        </div>

        <div
          className="absolute left-[420px] top-[352px] z-40 w-[258px] rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_38px_78px_-38px_rgba(0,0,0,0.58)]"
          style={{ transform: 'rotateZ(7deg)' }}
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#e9f7ef]">
              <span className="h-5 w-5 rounded-[7px] border-2 border-[#181818]" />
            </span>
            <span className="rounded-full bg-[#f4f4f2] px-3 py-1 text-[11px] font-bold text-[#666]">
              automático
            </span>
          </div>
          <p className="font-heading text-3xl font-bold leading-[0.95] text-[#181818]">
            Curtidas viram tópicos
          </p>
          <p className="mt-4 text-sm font-semibold leading-5 text-[#555]">
            Use sinais do que você consome para encontrar formatos, padrões e ideias.
          </p>
        </div>

        <div
          className="absolute left-[404px] top-[608px] z-50 rounded-[26px] border border-black/10 bg-white px-6 py-4 shadow-[0_26px_56px_-32px_rgba(0,0,0,0.52)]"
          style={{ transform: 'rotateZ(3deg)' }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#888]">
            Fluxo simples
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
