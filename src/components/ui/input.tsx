import type {
  FocusEventHandler,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
} from 'react'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from './utils'

type InputShape = 'pill' | 'rounded'
type InputTone = 'default' | 'danger'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'prefix' | 'type'> {
  id: string
  label?: string
  type?: HTMLInputTypeAttribute
  value: string
  onChange: (value: string) => void
  onBlur?: FocusEventHandler<HTMLInputElement>
  error?: string
  prefix?: string | null
  shape?: InputShape
  tone?: InputTone
}

const SHAPE_CLASS_NAMES: Record<InputShape, string> = {
  pill: 'h-14 rounded-full px-6',
  rounded: 'h-12 rounded-[16px]',
}

export function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error = '',
  prefix = null,
  shape = 'rounded',
  tone = 'default',
  className,
  disabled = false,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type
  const isDangerTone = tone === 'danger'
  const labelClassName = isDangerTone ? 'text-[#d92d20]' : 'text-[#666]'
  const wrapperClassName =
    shape === 'pill'
      ? 'app-input'
      : disabled
        ? 'border-black/10 bg-[#f5f5f5]'
        : isDangerTone
          ? 'border-red-200 bg-white focus-within:border-red-300'
          : 'border-black/10 bg-white focus-within:border-black/20'

  return (
    <div className={shape === 'pill' ? 'flex flex-col gap-2' : 'space-y-2'}>
      {label ? (
        <label htmlFor={id} className={cn('font-body text-sm font-semibold leading-6', labelClassName)}>
          {label}
        </label>
      ) : null}

      <div
        className={cn(
          'flex items-center overflow-hidden border transition-colors',
          SHAPE_CLASS_NAMES[shape],
          error ? 'border-red-300' : wrapperClassName,
        )}
      >
        {prefix ? (
          <span className="font-mono flex h-full items-center border-r border-black/10 bg-[#f4f4f4] px-4 text-sm text-[#6a6a6a]">
            {prefix}
          </span>
        ) : null}

        <input
          id={id}
          type={resolvedType}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(
            'font-body w-full bg-transparent font-medium text-[#171717] outline-none placeholder:text-[#a0a0a0]',
            shape === 'pill' ? 'text-base leading-6' : 'h-full px-4 text-sm',
            disabled && 'cursor-not-allowed text-[#737373]',
            className,
          )}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={cn(
              'flex shrink-0 items-center justify-center text-[#a0a0a0] transition-colors hover:text-[#666]',
              shape === 'pill' ? 'pr-2' : 'pr-3',
            )}
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : null}
      </div>

      {error ? <p className="px-2 text-sm font-medium leading-6 text-red-600">{error}</p> : null}
    </div>
  )
}
