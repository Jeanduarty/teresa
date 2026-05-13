import type { HTMLInputTypeAttribute } from 'react'

interface FormFieldProps {
  id: string
  label?: string
  type?: HTMLInputTypeAttribute
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  autoComplete?: string
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
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label htmlFor={id} className="font-body text-sm font-semibold leading-6 text-[#666]">
          {label}
        </label>
      ) : null}
      <div
        className={`app-input flex h-14 items-center rounded-full px-6 ${
          error ? 'border border-red-300' : ''
        }`}
      >
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="font-body w-full bg-transparent text-base font-medium leading-6 text-[#141414] outline-none placeholder:text-[#8f8f8f]"
        />
      </div>
      {error ? <p className="px-2 text-sm font-medium leading-6 text-red-600">{error}</p> : null}
    </div>
  )
}
