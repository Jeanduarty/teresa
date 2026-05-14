import { Trash2 } from 'lucide-react'

import { Button } from '../../../components/ui'
import { UserAvatar } from '../../../components/user-avatar'
import { AccountSettingsFeedback } from './account-settings-feedback'
import { AccountSettingsField } from './account-settings-field'
import type {
  ProfileFormErrors,
  ProfileFormField,
  ProfileFormState,
} from './account-settings-types'

interface AccountSettingsProfileSectionProps {
  form: ProfileFormState
  errors: ProfileFormErrors
  isPending: boolean
  canSubmit: boolean
  errorMessage?: string
  successMessage?: string
  avatarUrl?: string | null
  avatarErrorMessage?: string
  isUploadingAvatar: boolean
  isRemovingAvatar: boolean
  onChange: (field: ProfileFormField, value: string) => void
  onAvatarChange: (file: File) => void
  onAvatarRemove: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function AccountSettingsProfileSection({
  form,
  errors,
  isPending,
  canSubmit,
  errorMessage,
  successMessage,
  avatarUrl,
  avatarErrorMessage,
  isUploadingAvatar,
  isRemovingAvatar,
  onChange,
  onAvatarChange,
  onAvatarRemove,
  onSubmit,
}: AccountSettingsProfileSectionProps) {
  const avatarPending = isUploadingAvatar || isRemovingAvatar

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-[2rem] font-bold tracking-[-0.02em] text-[#181818]">
          Configurações do perfil
        </h2>
      </div>

      <div className="flex flex-col gap-4 rounded-[20px] border border-black/10 bg-[#fbfbfa] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar
            editable
            disabled={avatarPending}
            avatarUrl={avatarUrl}
            name={form.realName || form.userName}
            className="h-20 w-20 border border-white/70 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.38)]"
            iconClassName="h-9 w-9"
            onChange={onAvatarChange}
          />

          <div>
            <h3 className="font-heading text-lg font-semibold text-[#181818]">Foto de perfil</h3>
            {avatarPending ? (
              <p className="mt-1 text-sm font-medium text-[#666]">Atualizando imagem...</p>
            ) : null}
          </div>
        </div>

        {avatarUrl ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={avatarPending}
            className="self-start rounded-full text-red-700 hover:bg-red-50 hover:text-red-800 sm:self-auto"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={onAvatarRemove}
          >
            Remover
          </Button>
        ) : null}

      </div>

      <form onSubmit={onSubmit} className="max-w-[512px] space-y-5">
        <AccountSettingsField
          id="settings-username"
          label="Nome de usuário"
          value={form.userName}
          onChange={(value) => onChange('userName', value)}
          placeholder="duartejean"
          autoComplete="username"
          prefix="@"
          error={errors.userName}
        />

        <AccountSettingsField
          id="settings-full-name"
          label="Nome completo"
          value={form.realName}
          onChange={(value) => onChange('realName', value)}
          placeholder="Jean Duarte"
          autoComplete="name"
          error={errors.realName}
        />

        <AccountSettingsFeedback tone="error" message={errorMessage || avatarErrorMessage} />
        <AccountSettingsFeedback tone="success" message={successMessage} />

        <Button
          type="submit"
          disabled={!canSubmit || isPending}
          variant="secondary"
          className="h-12 bg-[#a4a4a4] text-white hover:bg-[#909090]"
        >
          {isPending ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </form>
    </div>
  )
}
