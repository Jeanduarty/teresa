import type { FocusEventHandler, HTMLInputTypeAttribute } from 'react'

interface AccountSettingsFieldProps {
  id: string
  label?: string
  type?: HTMLInputTypeAttribute
  value: string
  onChange: (value: string) => void
  onBlur?: FocusEventHandler<HTMLInputElement>
  placeholder?: string
  autoComplete?: string
  disabled?: boolean
  error?: string
  prefix?: string | null
  tone?: 'default' | 'danger'
}

export function AccountSettingsField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  disabled = false,
  error = '',
  prefix = null,
  tone = 'default',
}: AccountSettingsFieldProps) {
  const isDangerTone = tone === 'danger'
  const labelClassName = isDangerTone ? 'text-[#d92d20]' : 'text-[#6a6a6a]'
  const wrapperClassName = disabled
    ? 'border-black/10 bg-[#f5f5f5]'
    : isDangerTone
      ? 'border-red-200 bg-white focus-within:border-red-300'
      : 'border-black/10 bg-white focus-within:border-black/20'

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={id} className={`font-body text-sm font-semibold leading-6 ${labelClassName}`}>
          {label}
        </label>
      ) : null}

      <div
        className={`flex items-center overflow-hidden rounded-[16px] border transition-colors ${
          error ? 'border-red-300' : wrapperClassName
        }`}
      >
        {prefix ? (
          <span className="font-mono flex h-12 items-center border-r border-black/10 bg-[#f4f4f4] px-4 text-sm text-[#6a6a6a]">
            {prefix}
          </span>
        ) : null}

        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`font-body h-12 w-full bg-transparent px-4 text-sm font-medium text-[#171717] outline-none placeholder:text-[#a0a0a0] ${
            disabled ? 'cursor-not-allowed text-[#737373]' : ''
          }`}
        />
      </div>

      {error ? <p className="px-1 text-sm font-medium leading-6 text-red-600">{error}</p> : null}
    </div>
  )
}
