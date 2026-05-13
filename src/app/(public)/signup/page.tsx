import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthLayout } from '../_components/auth-layout'
import { FormField } from '../_components/form-field'
import { useSignup, useVerifySignupSecret } from '../../../hooks/use-auth'
import {
  sanitizeUserName,
  validateEmailAddress,
  validateRequiredSecret,
  validateStrongPassword,
  validateUserName,
} from '../../../shared/lib/validation'
import type { SignupInput } from '../../../shared/types/account-types'

export function SignupPage() {
  const navigate = useNavigate()
  const signupMutation = useSignup()
  const verifySecretMutation = useVerifySignupSecret()
  const [isSecretVerified, setIsSecretVerified] = useState(false)
  const [secretSubmitted, setSecretSubmitted] = useState(false)
  const [signupSubmitted, setSignupSubmitted] = useState(false)
  const [form, setForm] = useState<SignupInput>({
    email: '',
    secretApp: '',
    userName: '',
    password: '',
  })

  const errors = useMemo(
    () => ({
      email: signupSubmitted ? validateEmailAddress(form.email) : '',
      secretApp: secretSubmitted ? validateRequiredSecret(form.secretApp) : '',
      userName: signupSubmitted ? validateUserName(form.userName) : '',
      password: signupSubmitted ? validateStrongPassword(form.password) : '',
    }),
    [form, secretSubmitted, signupSubmitted],
  )

  const hasSignupErrors = Boolean(errors.email || errors.userName || errors.password)
  const isPending = verifySecretMutation.isPending || signupMutation.isPending
  const errorMessage = isSecretVerified
    ? signupMutation.error?.message
    : verifySecretMutation.error?.message

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isSecretVerified) {
      setSecretSubmitted(true)
      verifySecretMutation.reset()

      if (validateRequiredSecret(form.secretApp)) {
        return
      }

      try {
        await verifySecretMutation.mutateAsync({
          secretApp: form.secretApp,
        })
        setIsSecretVerified(true)
        setSecretSubmitted(false)
      } catch {
        // Mutation error is rendered in the alert.
      }

      return
    }

    setSignupSubmitted(true)
    signupMutation.reset()

    if (
      validateEmailAddress(form.email) ||
      validateUserName(form.userName) ||
      validateStrongPassword(form.password)
    ) {
      return
    }

    try {
      await signupMutation.mutateAsync(form)
      navigate('/')
    } catch {
      // Mutation error is rendered in the alert.
    }
  }

  return (
    <AuthLayout
      title="Criar conta"
      subtitle={
        isSecretVerified
          ? 'Crie sua conta para começar'
          : 'Informe o segredo para liberar o cadastro'
      }
      footerPrompt="Já tem uma conta?"
      footerAction="Entrar"
      footerHref="/login"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errorMessage ? (
          <div className="rounded-[24px] border border-red-200 bg-red-50 px-6 py-4">
            <p className="font-body text-sm font-medium leading-6 text-red-600">
              {errorMessage}
            </p>
          </div>
        ) : null}

        {!isSecretVerified ? (
          <FormField
            id="signup-secret"
            label="Segredo"
            value={form.secretApp}
            onChange={(secretApp) => {
              verifySecretMutation.reset()
              setForm((current) => ({ ...current, secretApp }))
            }}
            placeholder="Informe o segredo"
            autoComplete="off"
            error={errors.secretApp}
          />
        ) : (
          <>
            <FormField
              id="signup-email"
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(email) => setForm((current) => ({ ...current, email }))}
              placeholder="seu.email@exemplo.com"
              autoComplete="email"
              error={errors.email}
            />

            <FormField
              id="signup-username"
              label="Nome de usuário"
              value={form.userName}
              onChange={(userName) => {
                setForm((current) => ({
                  ...current,
                  userName: sanitizeUserName(userName),
                }))
              }}
              placeholder="joaosilva"
              autoComplete="username"
              error={errors.userName}
            />

            <FormField
              id="signup-password"
              label="Senha"
              type="password"
              value={form.password}
              onChange={(password) => setForm((current) => ({ ...current, password }))}
              placeholder="Crie uma senha forte"
              autoComplete="new-password"
              error={errors.password}
            />
          </>
        )}

        <div className="mt-2 flex flex-col items-center gap-4">
          <button
            type="submit"
            disabled={isPending || (isSecretVerified && hasSignupErrors)}
            className="app-btn-primary shadow-elevation-1 flex h-14 w-full items-center justify-center rounded-full px-6 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="font-body text-base font-semibold leading-6 text-[#f4f4f4]">
              {!isSecretVerified
                ? verifySecretMutation.isPending
                  ? 'Verificando...'
                  : 'Continuar'
                : signupMutation.isPending
                  ? 'Criando conta...'
                  : 'Criar conta'}
            </span>
          </button>
        </div>
      </form>
    </AuthLayout>
  )
}
