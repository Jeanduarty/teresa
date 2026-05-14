import { Button, Card } from '../../../components/ui'
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

      <Card variant="danger" className="max-w-[520px] rounded-[20px] p-6">
        <h3 className="font-heading text-[1.65rem] font-semibold text-[#181818]">Excluir conta</h3>
        <p className="mt-3 text-[1.02rem] leading-8 text-[#ff2f24]">
          Depois de excluir sua conta, o acesso será encerrado e suas redes sociais conectadas serão
          desvinculadas. Esta ação não remove registros operacionais já gerados, mas sua conta deixa
          de ficar ativa imediatamente.
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

          <Button
            type="submit"
            disabled={!canSubmit || isPending}
            variant="danger"
            className="h-10 bg-[#f58f88] text-white hover:bg-[#ef7d76]"
          >
            {isPending ? 'Processando...' : 'Excluir minha conta'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
