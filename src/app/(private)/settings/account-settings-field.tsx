import type { FocusEventHandler, HTMLInputTypeAttribute } from 'react'

import { Input } from '../../../components/ui'

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
  return (
    <Input
      id={id}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      error={error}
      prefix={prefix}
      tone={tone}
      shape="rounded"
    />
  )
}
