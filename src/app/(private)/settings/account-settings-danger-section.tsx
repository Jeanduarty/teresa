import { AccountSettingsFeedback } from './account-settings-feedback'
import { AccountSettingsField } from './account-settings-field'

interface AccountSettingsDangerSectionProps {
  password: string
  error: string
  errorMessage?: string
  successMessage?: string
  isPending: boolean
  canSubmit: boolean
  onChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function AccountSettingsDangerSection({
  password,
  error,
  errorMessage,
  successMessage,
  isPending,
  canSubmit,
  onChange,
  onSubmit,
}: AccountSettingsDangerSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-[2rem] font-bold tracking-[-0.02em] text-[#181818]">
          Zona de perigo
        </h2>
      </div>

      <div className="max-w-[520px] rounded-[20px] border border-red-200 bg-[#fff4f3] p-6">
        <h3 className="font-heading text-[1.65rem] font-semibold text-[#181818]">Excluir conta</h3>
        <p className="mt-3 text-[1.02rem] leading-8 text-[#ff2f24]">
          Depois de excluir sua conta, não será possível voltar atrás. Esta ação é permanente e
          removerá seus dados. Alguns registros anonimizados podem permanecer no sistema para fins
          funcionais, legais ou regulatórios.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-5">
          <AccountSettingsField
            id="settings-delete-password"
            label="Informe sua senha para confirmar"
            type="password"
            value={password}
            onChange={onChange}
            placeholder="Informe sua senha"
            autoComplete="current-password"
            error={error}
            tone="danger"
          />

          <AccountSettingsFeedback tone="error" message={errorMessage} />
          <AccountSettingsFeedback tone="success" message={successMessage} />

          <button
            type="submit"
            disabled={!canSubmit || isPending}
            className="inline-flex h-10 items-center justify-center rounded-[14px] bg-[#f58f88] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#ef7d76] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Processando...' : 'Excluir minha conta'}
          </button>
        </form>
      </div>
    </div>
  )
}
