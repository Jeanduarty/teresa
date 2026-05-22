import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'

import { Input } from '../../../components/ui'

interface FormFieldProps {
  id: string
  label?: string
  type?: HTMLInputTypeAttribute
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  autoComplete?: string
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  maxLength?: number
}

export function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  inputMode,
  maxLength,
}: FormFieldProps) {
  return (
    <Input
      id={id}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode={inputMode}
      maxLength={maxLength}
      error={error}
      shape="pill"
    />
  )
}
