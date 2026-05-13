interface LogoProps {
  className?: string
}

export function Logo({ className = 'w-[93px] md:w-[112px]' }: LogoProps) {
  return <img src="/pencil-logo.svg" alt="Pencil Logo" className={className} />
}
