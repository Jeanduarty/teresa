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
  onChange: (field: ProfileFormField, value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function AccountSettingsProfileSection({
  form,
  errors,
  isPending,
  canSubmit,
  errorMessage,
  successMessage,
  onChange,
  onSubmit,
}: AccountSettingsProfileSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-[2rem] font-bold tracking-[-0.02em] text-[#181818]">
          Configurações do perfil
        </h2>
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

        <AccountSettingsFeedback tone="error" message={errorMessage} />
        <AccountSettingsFeedback tone="success" message={successMessage} />

        <button
          type="submit"
          disabled={!canSubmit || isPending}
          className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#a4a4a4] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#909090] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>
    </div>
  )
}
