import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../../../components/ui'
import { useLogin } from '../../../hooks/use-auth'
import { validateRequiredPassword } from '../../../shared/lib/validation'
import type { LoginInput } from '../../../shared/types/account-types'
import { AuthLayout } from '../_components/auth-layout'
import { FormField } from '../_components/form-field'

type LoginStep = 'identifier' | 'password'

function validateIdentifier(identifier: string): string {
  if (!identifier.trim()) {
    return 'Informe seu e-mail ou nome de usuário'
  }

  return ''
}

function validatePassword(password: string): string {
  return validateRequiredPassword(password)
}

export function LoginPage() {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const [form, setForm] = useState<LoginInput>({
    identifier: '',
    password: '',
  })
  const [step, setStep] = useState<LoginStep>('identifier')
  const [submittedStep, setSubmittedStep] = useState<LoginStep | null>(null)

  const errors = useMemo(
    () => ({
      identifier: submittedStep ? validateIdentifier(form.identifier) : '',
      password: submittedStep === 'password' ? validatePassword(form.password) : '',
    }),
    [form.identifier, form.password, submittedStep],
  )

  const hasErrors =
    step === 'password'
      ? Boolean(errors.identifier || errors.password)
      : Boolean(errors.identifier)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (step === 'identifier') {
      setSubmittedStep('identifier')
      loginMutation.reset()

      if (validateIdentifier(form.identifier)) {
        return
      }

      setSubmittedStep(null)
      setStep('password')
      return
    }

    setSubmittedStep('password')
    loginMutation.reset()

    if (validateIdentifier(form.identifier) || validatePassword(form.password)) {
      return
    }

    try {
      await loginMutation.mutateAsync(form)
      navigate('/')
    } catch {
      // Mutation error is rendered in the alert.
    }
  }

  return (
    <AuthLayout
      title="Entrar na Teresa"
      footerPrompt="Ainda não tem uma conta?"
      footerAction="Criar conta"
      footerHref="/signup"
      variant="split"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {loginMutation.error ? (
          <div className="rounded-[24px] border border-red-200 bg-red-50 px-6 py-4">
            <p className="font-body text-sm font-medium leading-6 text-red-600">
              {loginMutation.error.message}
            </p>
          </div>
        ) : null}

        <FormField
          id="login-identifier"
          label="E-mail ou nome de usuário"
          value={form.identifier}
          onChange={(identifier) => {
            loginMutation.reset()
            setForm((current) => ({ ...current, identifier }))
          }}
          placeholder="seu.email@exemplo.com ou seu_usuario"
          autoComplete="username"
          error={errors.identifier}
        />

        {step === 'password' ? (
          <div className="flex flex-col gap-2">
            <label htmlFor="login-password" className="font-body text-sm font-semibold leading-6 text-[#666]">
              Senha
            </label>
            <FormField
              id="login-password"
              label=""
              type="password"
              value={form.password}
              onChange={(password) => {
                loginMutation.reset()
                setForm((current) => ({ ...current, password }))
              }}
              placeholder="Informe sua senha"
              autoComplete="current-password"
              error={errors.password}
            />
          </div>
        ) : null}

        <div className="mt-2 flex flex-col items-center gap-4">
          <Button
            type="submit"
            disabled={loginMutation.isPending || hasErrors}
            size="lg"
            fullWidth
            className="shadow-elevation-1"
          >
            {step === 'identifier'
              ? 'Continuar'
              : loginMutation.isPending
                ? 'Entrando...'
                : 'Entrar'}
          </Button>

          <Link
            to="/forgot"
            className="font-body text-sm font-semibold leading-6 text-[#666] hover:underline"
          >
            Esqueceu a senha?
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
