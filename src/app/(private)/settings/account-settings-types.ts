import type { PaginationMeta, UserSession } from '../../../shared/types/account-types'

export type AccountSectionId =
  | 'profile'
  | 'social'
  | 'security'
  | 'sessions'
  | 'development'
  | 'danger'
export type AccountFeedbackTone = 'success' | 'error'

export interface AccountSectionDefinition {
  id: AccountSectionId
  label: string
}

export interface ProfileFormState {
  userName: string
  realName: string
}

export interface EmailFormState {
  newEmail: string
}

export interface PasswordFormState {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ProfileFormErrors {
  userName: string
  realName: string
}

export interface EmailFormErrors {
  newEmail: string
}

export interface PasswordFormErrors {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export type ProfileFormField = keyof ProfileFormState
export type EmailFormField = keyof EmailFormState
export type PasswordFormField = keyof PasswordFormState

export type SessionList = UserSession[]
export type SessionPagination = PaginationMeta
