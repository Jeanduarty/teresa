import { AccountSettingsFeedback } from './account-settings-feedback'
import { AccountSettingsField } from './account-settings-field'
import type {
  EmailFormErrors,
  EmailFormField,
  EmailFormState,
  PasswordFormErrors,
  PasswordFormField,
  PasswordFormState,
} from './account-settings-types'

interface AccountSettingsSecuritySectionProps {
  currentEmail: string
  emailForm: EmailFormState
  emailErrors: EmailFormErrors
  emailErrorMessage?: string
  emailSuccessMessage?: string
  isSendingEmail: boolean
  canSubmitEmail: boolean
  onEmailChange: (field: EmailFormField, value: string) => void
  onEmailSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  passwordForm: PasswordFormState
  passwordErrors: PasswordFormErrors
  passwordErrorMessage?: string
  passwordSuccessMessage?: string
  isChangingPassword: boolean
  canSubmitPassword: boolean
  onPasswordChange: (field: PasswordFormField, value: string) => void
  onPasswordSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function AccountSettingsSecuritySection({
  currentEmail,
  emailForm,
  emailErrors,
  emailErrorMessage,
  emailSuccessMessage,
  isSendingEmail,
  canSubmitEmail,
  onEmailChange,
  onEmailSubmit,
  passwordForm,
  passwordErrors,
  passwordErrorMessage,
  passwordSuccessMessage,
  isChangingPassword,
  canSubmitPassword,
  onPasswordChange,
  onPasswordSubmit,
}: AccountSettingsSecuritySectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-[2rem] font-bold tracking-[-0.02em] text-[#181818]">
          Configurações de segurança
        </h2>
      </div>

      <div className="max-w-[548px] space-y-9">
        <section className="space-y-5 border-b border-black/10 pb-8">
          <div>
            <h3 className="font-heading text-[1.55rem] font-semibold text-[#181818]">
              Alterar e-mail
            </h3>
          </div>

          <form onSubmit={onEmailSubmit} className="space-y-5">
            <AccountSettingsField
              id="settings-current-email"
              label="E-mail atual"
              type="email"
              value={currentEmail}
              onChange={() => {}}
              disabled
            />

            <AccountSettingsField
              id="settings-new-email"
              label="Novo e-mail"
              type="email"
              value={emailForm.newEmail}
              onChange={(value) => onEmailChange('newEmail', value)}
              placeholder="novoemail@exemplo.com"
              autoComplete="email"
              error={emailErrors.newEmail}
            />

            <AccountSettingsFeedback tone="error" message={emailErrorMessage} />
            <AccountSettingsFeedback tone="success" message={emailSuccessMessage} />

            <button
              type="submit"
              disabled={!canSubmitEmail || isSendingEmail}
              className="inline-flex h-11 items-center justify-center rounded-[14px] bg-[#a4a4a4] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#909090] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSendingEmail ? 'Enviando...' : 'Enviar verificação'}
            </button>
          </form>
        </section>

        <section className="space-y-5">
          <div>
            <h3 className="font-heading text-[1.55rem] font-semibold text-[#181818]">
              Alterar senha
            </h3>
          </div>

          <form onSubmit={onPasswordSubmit} className="space-y-5">
            <AccountSettingsField
              id="settings-current-password"
              label="Senha atual"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(value) => onPasswordChange('currentPassword', value)}
              placeholder="Informe a senha atual"
              autoComplete="current-password"
              error={passwordErrors.currentPassword}
            />

            <AccountSettingsField
              id="settings-new-password"
              label="Nova senha"
              type="password"
              value={passwordForm.newPassword}
              onChange={(value) => onPasswordChange('newPassword', value)}
              placeholder="Informe a nova senha"
              autoComplete="new-password"
              error={passwordErrors.newPassword}
            />

            <AccountSettingsField
              id="settings-confirm-password"
              label="Confirmar nova senha"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(value) => onPasswordChange('confirmPassword', value)}
              placeholder="Confirme a nova senha"
              autoComplete="new-password"
              error={passwordErrors.confirmPassword}
            />

            <AccountSettingsFeedback tone="error" message={passwordErrorMessage} />
            <AccountSettingsFeedback tone="success" message={passwordSuccessMessage} />

            <button
              type="submit"
              disabled={!canSubmitPassword || isChangingPassword}
              className="inline-flex h-11 items-center justify-center rounded-[14px] bg-[#a4a4a4] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#909090] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isChangingPassword ? 'Alterando...' : 'Alterar senha'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
