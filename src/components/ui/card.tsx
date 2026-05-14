import type { HTMLAttributes } from 'react'

import { cn } from './utils'

type CardElement = 'article' | 'aside' | 'div' | 'section'
type CardVariant = 'default' | 'panel' | 'muted' | 'danger'

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement
  variant?: CardVariant
}

const VARIANT_CLASS_NAMES: Record<CardVariant, string> = {
  default: 'border border-black/10 bg-white',
  panel: 'app-panel',
  muted: 'border border-black/10 bg-[#fbfbfa]',
  danger: 'border border-red-200 bg-[#fff4f3]',
}

export function Card({
  as: Component = 'div',
  variant = 'default',
  className,
  ...props
}: CardProps) {
  return <Component className={cn(VARIANT_CLASS_NAMES[variant], className)} {...props} />
}
