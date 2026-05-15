import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../../../components/ui'
import { useLogin } from '../../../hooks/use-auth'
import { validateRequiredPassword } from '../../../shared/lib/validation'
import type { LoginInput } from '../../../shared/types/account-types'
import { AuthLayout } from '../_components/auth-layout'
import { FormField } from '../_components/form-field'

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
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(
    () => ({
      identifier: submitted ? validateIdentifier(form.identifier) : '',
      password: submitted ? validatePassword(form.password) : '',
    }),
    [form.identifier, form.password, submitted],
  )

  const hasErrors = Boolean(errors.identifier || errors.password)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)

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
      title="Entrar"
      subtitle="Informe suas credenciais para continuar"
      footerPrompt="Ainda não tem uma conta?"
      footerAction="Criar conta"
      footerHref="/signup"
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
          onChange={(identifier) => setForm((current) => ({ ...current, identifier }))}
          placeholder="seu.email@exemplo.com ou seu_usuario"
          autoComplete="username"
          error={errors.identifier}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="login-password" className="font-body text-sm font-semibold leading-6 text-[#666]">
              Senha
            </label>
            <Link to="/signup" className="font-body text-sm leading-6 text-[#666] hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
          <FormField
            id="login-password"
            label=""
            type="password"
            value={form.password}
            onChange={(password) => setForm((current) => ({ ...current, password }))}
            placeholder="Informe sua senha"
            autoComplete="current-password"
            error={errors.password}
          />
        </div>

        <div className="mt-2 flex flex-col items-center gap-4">
          <Button
            type="submit"
            disabled={loginMutation.isPending || hasErrors}
            size="lg"
            fullWidth
            className="shadow-elevation-1"
          >
            {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
