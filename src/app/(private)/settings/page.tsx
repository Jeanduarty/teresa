import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { useAuthSession } from '../../../hooks/use-auth'
import type { PublicProfile } from '../../../shared/types/account-types'
import { useAccountSettings } from '../../../hooks/use-account-settings'
import { AccountSettingsDangerSection } from './account-settings-danger-section'
import { AccountSettingsProfileSection } from './account-settings-profile-section'
import { AccountSettingsSecuritySection } from './account-settings-security-section'
import { AccountSettingsSocialSection } from './account-settings-social-section'
import { AccountSettingsSessionsSection } from './account-settings-sessions-section'
import { AccountSettingsSidebar } from './account-settings-sidebar'
import type {
  AccountSectionId,
  EmailFormErrors,
  EmailFormField,
  EmailFormState,
  PasswordFormErrors,
  PasswordFormField,
  PasswordFormState,
  ProfileFormErrors,
  ProfileFormField,
  ProfileFormState,
} from './account-settings-types'
import {
  isAccountSection,
  sanitizeUserName,
  validateEmail,
  validatePassword,
  validateRealName,
  validateUserName,
} from './account-settings-utils'

const SESSIONS_PER_PAGE = 10

interface SettingsErrorStateProps {
  message: string
  profileHref: string
}

function SettingsSkeleton() {
  return (
    <main className="mx-auto w-full max-w-[1080px] px-6 py-12 md:px-0">
      <div className="mb-8 h-6 w-36 animate-pulse rounded bg-[#ececec]" />
      <div className="grid gap-8 lg:grid-cols-[206px_780px]">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded-full bg-[#ececec]" />
            <div className="space-y-3">
              <div className="h-6 w-24 animate-pulse rounded bg-[#ececec]" />
              <div className="h-4 w-20 animate-pulse rounded bg-[#ececec]" />
            </div>
          </div>
          <div className="h-[280px] animate-pulse rounded-[24px] bg-[#ececec]" />
        </div>
        <div className="h-[420px] animate-pulse rounded-[24px] border border-black/10 bg-white lg:w-[780px]" />
      </div>
    </main>
  )
}

function SettingsErrorState({ message, profileHref }: SettingsErrorStateProps) {
  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col items-center px-6 py-16 text-center md:px-10">
      <div className="rounded-[28px] border border-red-200 bg-red-50 px-8 py-10 shadow-elevation-1">
        <h1 className="font-heading text-3xl font-bold text-[#141414]">Configurações indisponíveis</h1>
        <p className="mt-4 text-sm leading-6 text-red-700">{message}</p>
        <Link
          to={profileHref}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-[#141414]"
        >
          Voltar para o perfil
        </Link>
      </div>
    </main>
  )
}

export function AccountSettingsPage() {
  const { section } = useParams<{ section?: string }>()
  const navigate = useNavigate()
  const { user, isLoading: isSessionLoading } = useAuthSession()
  const activeSection: AccountSectionId = isAccountSection(section) ? section : 'profile'
  const [sessionsPage, setSessionsPage] = useState(1)
  const settings = useAccountSettings({
    slug: user?.userName ?? '',
    section: activeSection,
    userId: user?.id,
    sessionsPage,
    sessionsPerPage: SESSIONS_PER_PAGE,
  })

  const profile = settings.profileQuery.data as PublicProfile | undefined

  const [profileDraft, setProfileDraft] = useState<Partial<ProfileFormState>>({})
  const [emailForm, setEmailForm] = useState<EmailFormState>({
    newEmail: '',
  })
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [deletePassword, setDeletePassword] = useState('')

  const [profileSubmitted, setProfileSubmitted] = useState(false)
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [passwordSubmitted, setPasswordSubmitted] = useState(false)
  const [deleteSubmitted, setDeleteSubmitted] = useState(false)

  const [profileSuccessMessage, setProfileSuccessMessage] = useState('')
  const [emailSuccessMessage, setEmailSuccessMessage] = useState('')
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('')
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('')

  useEffect(() => {
    if (activeSection !== 'sessions') {
      const resetTimer = window.setTimeout(() => {
        setSessionsPage(1)
      }, 0)

      return () => window.clearTimeout(resetTimer)
    }
  }, [activeSection])

  useEffect(() => {
    const sessionsData = settings.sessionsQuery.data

    if (
      activeSection === 'sessions' &&
      sessionsData &&
      sessionsData.sessions.length === 0 &&
      sessionsData.pagination.total > 0 &&
      sessionsPage > 1
    ) {
      const resetTimer = window.setTimeout(() => {
        setSessionsPage((current) => Math.max(1, current - 1))
      }, 0)

      return () => window.clearTimeout(resetTimer)
    }
  }, [activeSection, sessionsPage, settings.sessionsQuery.data])

  if (section && !isAccountSection(section)) {
    return <Navigate to="/settings/profile" replace />
  }

  if (isSessionLoading) {
    return <SettingsSkeleton />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (settings.profileQuery.error) {
    return (
      <SettingsErrorState
        message={settings.profileQuery.error.message}
        profileHref="/"
      />
    )
  }

  if (settings.profileQuery.isLoading || !profile) {
    return <SettingsSkeleton />
  }

  const currentProfile = profile

  const profileForm = {
    userName: profileDraft.userName ?? currentProfile.userName,
    realName: profileDraft.realName ?? currentProfile.realName,
  } satisfies ProfileFormState

  const normalizedProfileUserName = sanitizeUserName(profileForm.userName)
  const normalizedEmail = emailForm.newEmail.trim().toLowerCase()

  const profileErrors: ProfileFormErrors = {
    userName: profileSubmitted ? validateUserName(normalizedProfileUserName) : '',
    realName: profileSubmitted ? validateRealName(profileForm.realName) : '',
  }

  const emailErrors: EmailFormErrors = {
    newEmail: emailSubmitted ? validateEmail(normalizedEmail) : '',
  }

  const passwordErrors: PasswordFormErrors = {
    currentPassword:
      passwordSubmitted && !passwordForm.currentPassword ? 'Senha atual é obrigatória' : '',
    newPassword: passwordSubmitted ? validatePassword(passwordForm.newPassword) : '',
    confirmPassword:
      passwordSubmitted && passwordForm.newPassword !== passwordForm.confirmPassword
        ? 'As senhas não coincidem'
        : '',
  }

  const deleteError = deleteSubmitted && !deletePassword ? 'Senha é obrigatória' : ''

  const isProfileDirty =
    normalizedProfileUserName !== currentProfile.userName ||
    profileForm.realName.trim() !== currentProfile.realName
  const canSubmitProfile =
    isProfileDirty && !profileErrors.userName && !profileErrors.realName && !settings.updateProfileMutation.isPending

  const canSubmitEmail =
    Boolean(normalizedEmail) &&
    normalizedEmail !== currentProfile.email.toLowerCase() &&
    !emailErrors.newEmail &&
    !settings.requestEmailChangeMutation.isPending

  const canSubmitPassword =
    Boolean(passwordForm.currentPassword) &&
    Boolean(passwordForm.newPassword) &&
    Boolean(passwordForm.confirmPassword) &&
    !passwordErrors.currentPassword &&
    !passwordErrors.newPassword &&
    !passwordErrors.confirmPassword &&
    !settings.changePasswordMutation.isPending

  const canSubmitDelete =
    Boolean(deletePassword) && !deleteError && !settings.requestAccountDeletionMutation.isPending

  function handleProfileChange(field: ProfileFormField, value: string): void {
    setProfileDraft((current) => ({
      ...current,
      [field]: field === 'userName' ? sanitizeUserName(value) : value,
    }))
  }

  function handleEmailChange(field: EmailFormField, value: string): void {
    setEmailForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handlePasswordChange(field: PasswordFormField, value: string): void {
    setPasswordForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setProfileSubmitted(true)
    setProfileSuccessMessage('')
    settings.updateProfileMutation.reset()

    const nextUserNameError = validateUserName(normalizedProfileUserName)
    const nextRealNameError = validateRealName(profileForm.realName)

    if (!isProfileDirty || nextUserNameError || nextRealNameError) {
      return
    }

    try {
      const updatedUser = await settings.updateProfileMutation.mutateAsync({
        userName: normalizedProfileUserName,
        realName: profileForm.realName.trim(),
      })

      setProfileDraft({})
      setProfileSuccessMessage('Perfil atualizado com sucesso.')
      setProfileSubmitted(false)

      if (updatedUser.userName !== currentProfile.userName) {
        navigate('/settings/profile', { replace: true })
      }
    } catch {
      // Mutation error is rendered below the form.
    }
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setEmailSubmitted(true)
    setEmailSuccessMessage('')
    settings.requestEmailChangeMutation.reset()

    const nextEmailError = validateEmail(normalizedEmail)

    if (!normalizedEmail || normalizedEmail === currentProfile.email.toLowerCase() || nextEmailError) {
      return
    }

    try {
      const result = await settings.requestEmailChangeMutation.mutateAsync({
        newEmail: normalizedEmail,
      })

      setEmailSuccessMessage(result.message)
      setEmailForm({ newEmail: '' })
      setEmailSubmitted(false)
    } catch {
      // Mutation error is rendered below the form.
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setPasswordSubmitted(true)
    setPasswordSuccessMessage('')
    settings.changePasswordMutation.reset()

    const nextCurrentPasswordError = !passwordForm.currentPassword ? 'Senha atual é obrigatória' : ''
    const nextNewPasswordError = validatePassword(passwordForm.newPassword)
    const nextConfirmPasswordError =
      passwordForm.newPassword !== passwordForm.confirmPassword ? 'As senhas não coincidem' : ''

    if (
      nextCurrentPasswordError ||
      nextNewPasswordError ||
      nextConfirmPasswordError ||
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      return
    }

    try {
      const result = await settings.changePasswordMutation.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })

      setPasswordSuccessMessage(result.message)
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setPasswordSubmitted(false)
    } catch {
      // Mutation error is rendered below the form.
    }
  }

  async function handleDeleteSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setDeleteSubmitted(true)
    setDeleteSuccessMessage('')
    settings.requestAccountDeletionMutation.reset()

    if (!deletePassword.trim()) {
      return
    }

    try {
      const result = await settings.requestAccountDeletionMutation.mutateAsync({
        password: deletePassword,
      })

      setDeleteSuccessMessage(result.message)
      setDeletePassword('')
      setDeleteSubmitted(false)
    } catch {
      // Mutation error is rendered below the form.
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1080px] px-6 py-12 md:px-0">
      <div className="grid gap-8 lg:grid-cols-[206px_780px] lg:items-start">
        <aside className="space-y-8 lg:sticky lg:top-[112px]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[0.96rem] font-medium text-[#666] transition-colors hover:text-[#141414]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para inicio
          </Link>

          <AccountSettingsSidebar
            slug={currentProfile.userName}
            realName={currentProfile.realName}
            userName={currentProfile.userName}
            activeSection={activeSection}
          />
        </aside>

        <section className="min-w-0 w-full rounded-[22px] border border-black/10 bg-white px-8 py-8 md:px-8 md:py-8 lg:w-[780px]">
          {activeSection === 'profile' ? (
            <AccountSettingsProfileSection
              form={profileForm}
              errors={profileErrors}
              isPending={settings.updateProfileMutation.isPending}
              canSubmit={canSubmitProfile}
              errorMessage={settings.updateProfileMutation.error?.message}
              successMessage={profileSuccessMessage}
              onChange={handleProfileChange}
              onSubmit={handleProfileSubmit}
            />
          ) : null}

          {activeSection === 'security' ? (
            <AccountSettingsSecuritySection
              currentEmail={currentProfile.email}
              emailForm={emailForm}
              emailErrors={emailErrors}
              emailErrorMessage={settings.requestEmailChangeMutation.error?.message}
              emailSuccessMessage={emailSuccessMessage}
              isSendingEmail={settings.requestEmailChangeMutation.isPending}
              canSubmitEmail={canSubmitEmail}
              onEmailChange={handleEmailChange}
              onEmailSubmit={handleEmailSubmit}
              passwordForm={passwordForm}
              passwordErrors={passwordErrors}
              passwordErrorMessage={settings.changePasswordMutation.error?.message}
              passwordSuccessMessage={passwordSuccessMessage}
              isChangingPassword={settings.changePasswordMutation.isPending}
              canSubmitPassword={canSubmitPassword}
              onPasswordChange={handlePasswordChange}
              onPasswordSubmit={handlePasswordSubmit}
            />
          ) : null}

          {activeSection === 'social' ? (
            <AccountSettingsSocialSection userId={user.id} />
          ) : null}

          {activeSection === 'sessions' ? (
            <AccountSettingsSessionsSection
              sessions={settings.sessionsQuery.data?.sessions ?? []}
              pagination={settings.sessionsQuery.data?.pagination}
              isLoading={settings.sessionsQuery.isLoading}
              isFetching={settings.sessionsQuery.isFetching}
              loadErrorMessage={settings.sessionsQuery.error?.message}
              onRetry={() => {
                void settings.sessionsQuery.refetch()
              }}
              onPreviousPage={() => {
                setSessionsPage((current) => Math.max(1, current - 1))
              }}
              onNextPage={() => {
                setSessionsPage((current) => current + 1)
              }}
            />
          ) : null}

          {activeSection === 'danger' ? (
            <AccountSettingsDangerSection
              password={deletePassword}
              error={deleteError}
              errorMessage={settings.requestAccountDeletionMutation.error?.message}
              successMessage={deleteSuccessMessage}
              isPending={settings.requestAccountDeletionMutation.isPending}
              canSubmit={canSubmitDelete}
              onChange={(value) => setDeletePassword(value)}
              onSubmit={handleDeleteSubmit}
            />
          ) : null}
        </section>
      </div>
    </main>
  )
}
