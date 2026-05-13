import type { PropsWithChildren } from 'react'

import { Link } from 'react-router-dom'

import { Logo } from '../../../shared/branding/logo'

interface AuthLayoutProps {
  title: string
  subtitle: string
  footerPrompt: string
  footerAction: string
  footerHref: string
}

export function AuthLayout({
  title,
  subtitle,
  footerPrompt,
  footerAction,
  footerHref,
  children,
}: PropsWithChildren<AuthLayoutProps>) {
  return (
    <div className="app-shell flex min-h-screen w-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="app-panel w-full max-w-[480px] overflow-hidden rounded-[16px]">
        <div className="border-b border-black/10 px-8 py-8 sm:px-10">
          <div className="mb-8 flex justify-center sm:justify-start">
            <Logo />
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
