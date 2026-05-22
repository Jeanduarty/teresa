import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../../components/ui'
import {
  useRequestPasswordReset,
  useResetPassword,
  useVerifyPasswordResetCode,
} from '../../../hooks/use-auth'
import { validateStrongPassword } from '../../../shared/lib/validation'
import { AuthLayout } from '../_components/auth-layout'
import { FormField } from '../_components/form-field'

type ForgotStep = 'identifier' | 'code' | 'password' | 'done'

type ForgotForm = {
  identifier: string
  code: string
  newPassword: string
  confirmPassword: string
}

function validateIdentifier(identifier: string): string {
  if (!identifier.trim()) {
    return 'Informe seu e-mail ou nome de usuário'
  }

  return ''
}

function validateCode(code: string): string {
  if (!/^\d{6}$/.test(code)) {
    return 'Informe o código de 6 dígitos'
  }

  return ''
}

function validateConfirmPassword(newPassword: string, confirmPassword: string): string {
  if (!confirmPassword) {
    return 'Confirme a nova senha'
  }

  if (newPassword !== confirmPassword) {
    return 'As senhas não coincidem'
  }

  return ''
}

function formatCooldown(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function getSubtitle(step: ForgotStep, maskedEmail: string): string {
  if (step === 'code') {
    return maskedEmail
      ? `Enviamos um código para ${maskedEmail}`
      : 'Informe o código enviado para o seu e-mail'
  }

  if (step === 'password') {
    return 'Código confirmado. Crie uma nova senha para sua conta'
  }

  if (step === 'done') {
    return 'Sua senha foi redefinida. Você já pode entrar novamente'
  }

  return 'Informe seu e-mail ou nome de usuário para receber um código'
}

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const requestResetMutation = useRequestPasswordReset()
  const verifyCodeMutation = useVerifyPasswordResetCode()
  const resetPasswordMutation = useResetPassword()
  const [step, setStep] = useState<ForgotStep>('identifier')
  const [submittedStep, setSubmittedStep] = useState<ForgotStep | null>(null)
  const [maskedEmail, setMaskedEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [resendCooldownEndsAt, setResendCooldownEndsAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [form, setForm] = useState<ForgotForm>({
    identifier: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (!resendCooldownEndsAt) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      const nextNow = Date.now()
      setNow(nextNow)

      if (nextNow >= resendCooldownEndsAt) {
        setResendCooldownEndsAt(null)
      }
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [resendCooldownEndsAt])

  const errors = useMemo(
    () => ({
      identifier: submittedStep === 'identifier' ? validateIdentifier(form.identifier) : '',
      code: submittedStep === 'code' ? validateCode(form.code) : '',
      newPassword: submittedStep === 'password' ? validateStrongPassword(form.newPassword) : '',
      confirmPassword:
        submittedStep === 'password'
          ? validateConfirmPassword(form.newPassword, form.confirmPassword)
          : '',
    }),
    [form, submittedStep],
  )

  const errorMessage =
    requestResetMutation.error?.message ||
    verifyCodeMutation.error?.message ||
    resetPasswordMutation.error?.message ||
    ''
  const isPending =
    requestResetMutation.isPending ||
    verifyCodeMutation.isPending ||
    resetPasswordMutation.isPending
  const currentStepHasErrors =
    step === 'identifier'
      ? Boolean(errors.identifier)
      : step === 'code'
        ? Boolean(errors.code)
        : step === 'password'
          ? Boolean(errors.newPassword || errors.confirmPassword)
          : false
  const resendCooldownSeconds = resendCooldownEndsAt
    ? Math.max(0, Math.ceil((resendCooldownEndsAt - now) / 1000))
    : 0
  const isResendBlocked = resendCooldownSeconds > 0

  function startResendCooldown(seconds: number) {
    const nextNow = Date.now()
    setNow(nextNow)
    setResendCooldownEndsAt(seconds > 0 ? nextNow + seconds * 1000 : null)
  }

  async function requestCode({ resend = false }: { resend?: boolean } = {}) {
    setSubmittedStep('identifier')
    requestResetMutation.reset()
    verifyCodeMutation.reset()
    resetPasswordMutation.reset()

    if (validateIdentifier(form.identifier)) {
      return
    }

    const response = await requestResetMutation.mutateAsync({
      identifier: form.identifier,
      resend,
    })
    setMaskedEmail(response.email)
    setForm((current) => ({ ...current, code: '', newPassword: '', confirmPassword: '' }))
    setResetToken('')
    startResendCooldown(response.resendCooldownSeconds)
    setSubmittedStep(null)
    setStep('code')
  }

  async function handleRequestCode() {
    await requestCode()
  }

  async function handleVerifyCode() {
    setSubmittedStep('code')
    verifyCodeMutation.reset()
    resetPasswordMutation.reset()

    if (validateCode(form.code)) {
      return
    }

    const response = await verifyCodeMutation.mutateAsync({
      identifier: form.identifier,
      code: form.code,
    })
    setResetToken(response.resetToken)
    setSubmittedStep(null)
    setStep('password')
  }

  async function handleResetPassword() {
    setSubmittedStep('password')
    resetPasswordMutation.reset()

    if (
      validateStrongPassword(form.newPassword) ||
      validateConfirmPassword(form.newPassword, form.confirmPassword)
    ) {
      return
    }

    await resetPasswordMutation.mutateAsync({
      resetToken,
      newPassword: form.newPassword,
    })
    setSubmittedStep(null)
    setStep('done')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      if (step === 'identifier') {
        await handleRequestCode()
        return
      }

      if (step === 'code') {
        await handleVerifyCode()
        return
      }

      if (step === 'password') {
        await handleResetPassword()
      }
    } catch {
      // Mutation error is rendered in the alert.
    }
  }

  async function handleResendCode() {
    if (isResendBlocked) {
      return
    }

    try {
      await requestCode({ resend: true })
    } catch {
      // Mutation error is rendered in the alert.
    }
  }

  return (
    <AuthLayout
      title={step === 'done' ? 'Senha redefinida' : 'Redefinir senha'}
      subtitle={getSubtitle(step, maskedEmail)}
      footerPrompt="Lembrou a senha?"
      footerAction="Entrar"
      footerHref="/login"
    >
      {step === 'done' ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-[24px] border border-green-200 bg-green-50 px-6 py-4">
            <p className="font-body text-sm font-medium leading-6 text-green-700">
              Senha atualizada com sucesso.
            </p>
          </div>
          <Button
            type="button"
            size="lg"
            fullWidth
            className="shadow-elevation-1"
            onClick={() => navigate('/login')}
          >
            Entrar com a nova senha
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {errorMessage ? (
            <div className="rounded-[24px] border border-red-200 bg-red-50 px-6 py-4">
              <p className="font-body text-sm font-medium leading-6 text-red-600">
                {errorMessage}
              </p>
            </div>
          ) : null}

          {step === 'identifier' ? (
            <FormField
              id="forgot-identifier"
              label="E-mail ou nome de usuário"
              value={form.identifier}
              onChange={(identifier) => {
                requestResetMutation.reset()
                setMaskedEmail('')
                setResendCooldownEndsAt(null)
                setForm((current) => ({ ...current, identifier }))
              }}
              placeholder="seu.email@exemplo.com ou seu_usuario"
              autoComplete="username"
              error={errors.identifier}
            />
          ) : null}

          {step === 'code' ? (
            <>
              <FormField
                id="forgot-code"
                label="Código"
                value={form.code}
                onChange={(code) => {
                  verifyCodeMutation.reset()
                  setForm((current) => ({
                    ...current,
                    code: code.replace(/\D/g, '').slice(0, 6),
                  }))
                }}
                placeholder="000000"
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                error={errors.code}
              />

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  fullWidth
                  disabled={isPending}
                  onClick={() => {
                    setStep('identifier')
                    setSubmittedStep(null)
                    setResendCooldownEndsAt(null)
                    verifyCodeMutation.reset()
                  }}
                >
                  Alterar e-mail
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  fullWidth
                  disabled={isPending || isResendBlocked}
                  onClick={handleResendCode}
                >
                  {isResendBlocked
                    ? `Reenviar em ${formatCooldown(resendCooldownSeconds)}`
                    : 'Reenviar código'}
                </Button>
              </div>
            </>
          ) : null}

          {step === 'password' ? (
            <>
              <FormField
                id="forgot-new-password"
                label="Nova senha"
                type="password"
                value={form.newPassword}
                onChange={(newPassword) => {
                  resetPasswordMutation.reset()
                  setForm((current) => ({ ...current, newPassword }))
                }}
                placeholder="Crie uma nova senha"
                autoComplete="new-password"
                error={errors.newPassword}
              />

              <FormField
                id="forgot-confirm-password"
                label="Confirmar senha"
                type="password"
                value={form.confirmPassword}
                onChange={(confirmPassword) => {
                  resetPasswordMutation.reset()
                  setForm((current) => ({ ...current, confirmPassword }))
                }}
                placeholder="Repita a nova senha"
                autoComplete="new-password"
                error={errors.confirmPassword}
              />
            </>
          ) : null}

          <div className="mt-2 flex flex-col items-center gap-4">
            <Button
              type="submit"
              disabled={isPending || currentStepHasErrors || (step === 'password' && !resetToken)}
              size="lg"
              fullWidth
              className="shadow-elevation-1"
            >
              {step === 'identifier'
                ? requestResetMutation.isPending
                  ? 'Enviando...'
                  : 'Enviar código'
                : step === 'code'
                  ? verifyCodeMutation.isPending
                    ? 'Verificando...'
                    : 'Verificar código'
                  : resetPasswordMutation.isPending
                    ? 'Salvando...'
                    : 'Redefinir senha'}
            </Button>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}
