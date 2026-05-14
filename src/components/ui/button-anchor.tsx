import type { AnchorHTMLAttributes, ReactNode } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'

const buttonAnchorVariants = tv({
  base: 'inline-flex items-center justify-center gap-2 font-semibold transition-colors',
  variants: {
    variant: {
      primary: 'app-btn-primary',
      secondary: 'app-btn-secondary',
      danger: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
      ghost:
        'border border-transparent bg-transparent text-[#666] hover:bg-[#f4f4f2] hover:text-[#141414]',
    },
    size: {
      xs: 'h-8 rounded-[10px] px-3 text-[11px]',
      sm: 'h-9 rounded-[12px] px-3.5 text-xs',
      md: 'h-11 rounded-[14px] px-5 text-sm',
      lg: 'h-14 rounded-full px-6 text-base',
    },
    fullWidth: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

interface ButtonAnchorProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonAnchorVariants> {
  icon?: ReactNode
}

export function ButtonAnchor({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className,
  children,
  ...props
}: ButtonAnchorProps) {
  return (
    <a
      className={buttonAnchorVariants({ className, fullWidth, size, variant })}
      {...props}
    >
      {children}
      {icon}
    </a>
  )
}
