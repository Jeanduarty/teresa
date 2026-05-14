import teresaLogo from './teresa.png'
import { cn } from '../../components/ui'

interface LogoProps {
  className?: string
  imageClassName?: string
  textClassName?: string
  showText?: boolean
}

export function Logo({
  className,
  imageClassName,
  textClassName,
  showText = true,
}: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <img
        src={teresaLogo}
        alt=""
        aria-hidden="true"
        className={cn('h-11 w-11 rounded-full object-cover', imageClassName)}
      />
      {showText ? (
        <span
          className={cn(
            'font-heading text-[1.35rem] font-bold uppercase leading-none tracking-[0.18em] text-[#181818]',
            textClassName,
          )}
        >
          Teresa
        </span>
      ) : null}
    </span>
  )
}
