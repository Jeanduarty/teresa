import {
  sanitizeUserName as sanitizeAppUserName,
  validateEmailAddress,
  validateRealName as validateAppRealName,
  validateStrongPassword,
  validateUserName as validateAppUserName,
} from '../../../shared/lib/validation'
import type { UserSession } from '../../../shared/types/account-types'
import type { AccountSectionDefinition, AccountSectionId } from './account-settings-types'

export const ACCOUNT_SECTIONS: AccountSectionDefinition[] = [
  { id: 'profile', label: 'Perfil' },
  { id: 'social', label: 'Redes sociais' },
  { id: 'security', label: 'Segurança' },
  { id: 'sessions', label: 'Sessões' },
  { id: 'danger', label: 'Zona de perigo' },
]

export function isAccountSection(value: string | undefined): value is AccountSectionId {
  return ACCOUNT_SECTIONS.some((section) => section.id === value)
}

export function getAccountSectionHref(slug: string, section: AccountSectionId): string {
  void slug
  return `/settings/${section}`
}

export function sanitizeUserName(value: string): string {
  return sanitizeAppUserName(value)
}

export function validateUserName(userName: string): string {
  return validateAppUserName(userName)
}

export function validateRealName(realName: string): string {
  return validateAppRealName(realName)
}

export function validateEmail(email: string): string {
  return validateEmailAddress(email)
}

export function validatePassword(password: string): string {
  return validateStrongPassword(password)
}

function formatSessionFallbackDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function formatSessionCreatedDate(dateString: string): string {
  return formatSessionFallbackDate(dateString)
}

export function formatSessionLastActive(dateString: string): string {
  const diffInSeconds = Math.max(
    1,
    Math.floor((Date.now() - new Date(dateString).getTime()) / 1000),
  )

  if (diffInSeconds < 60) {
    return `há ${diffInSeconds} ${diffInSeconds === 1 ? 'segundo' : 'segundos'}`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)

  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)

  if (diffInHours < 24) {
    return `há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`
  }

  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays < 7) {
    return `há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`
  }

  return formatSessionFallbackDate(dateString)
}

export function getSessionClientLabel(session: Pick<UserSession, 'clientType' | 'extensionHost'>): string {
  if (session.clientType === 'desktop') {
    return 'Aplicativo desktop'
  }

  if (session.clientType === 'cli') {
    return 'CLI'
  }

  if (session.clientType === 'web') {
    return session.extensionHost || 'Navegador web'
  }

  return session.clientType
}

export function getSessionPlatformLabel(
  session: Pick<UserSession, 'clientType' | 'clientHost' | 'extensionHost'>,
): string {
  return session.clientHost || 'Desconhecido'
}
