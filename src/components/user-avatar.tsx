import { Camera, User } from 'lucide-react'
import { useRef } from 'react'

import { cn } from './ui'

type UserAvatarProps = {
  avatarUrl?: string | null
  name?: string
  editable?: boolean
  disabled?: boolean
  className?: string
  imageClassName?: string
  iconClassName?: string
  onChange?: (file: File) => void
}

export function UserAvatar({
  avatarUrl,
  name = 'Usuario',
  editable = false,
  disabled = false,
  className,
  imageClassName,
  iconClassName,
  onChange,
}: UserAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const content = avatarUrl ? (
    <img
      src={avatarUrl}
      alt={name}
      className={cn('h-full w-full object-cover', imageClassName)}
    />
  ) : (
    <User className={cn('text-white', iconClassName)} strokeWidth={2} />
  )

  if (editable) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'app-icon-badge-user group relative flex shrink-0 items-center justify-center overflow-hidden rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#181818]/20 disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        aria-label="Alterar foto de perfil"
      >
        {content}
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Camera className="h-5 w-5" />
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''

            if (file) {
              onChange?.(file)
            }
          }}
        />
      </button>
    )
  }

  return (
    <div
      className={cn(
        'app-icon-badge-user flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        className,
      )}
    >
      {content}
    </div>
  )
}
