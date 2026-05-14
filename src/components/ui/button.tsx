import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'

const buttonVariants = tv({
  base: [
    'inline-flex items-center justify-center gap-2 font-semibold transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-60',
  ],
  variants: {
    variant: {
      primary: 'app-btn-primary',
      secondary: 'app-btn-secondary',
      outline:
        'border border-black/10 bg-white text-[#181818] hover:border-black/20 hover:bg-[#fbfbfa]',
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

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className,
  children,
  type = 'button',
  ...props
}, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonVariants({ className, fullWidth, size, variant })}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
})
