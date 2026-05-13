export function sanitizeUserName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9._]/g, '')
}

export function validateEmailAddress(email: string): string {
  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail) {
    return 'Informe um e-mail válido'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return 'Informe um e-mail válido'
  }

  return ''
}

export function validateUserName(userName: string): string {
  const normalizedUserName = userName.trim()

  if (normalizedUserName.length < 3 || normalizedUserName.length > 20) {
    return 'Deve ter entre 3 e 20 caracteres'
  }

  if (!/^[a-z0-9._]+$/i.test(normalizedUserName)) {
    return 'Use apenas letras, números, pontos e sublinhados'
  }

  return ''
}

export function validateRealName(realName: string): string {
  const normalizedRealName = realName.trim()

  if (normalizedRealName.length < 1 || normalizedRealName.length > 50) {
    return 'Deve ter entre 1 e 50 caracteres'
  }

  return ''
}

export function validateRequiredPassword(password: string): string {
  if (!password) {
    return 'Senha é obrigatória'
  }

  return ''
}

export function validateRequiredSecret(secret: string): string {
  if (!secret.trim()) {
    return 'Segredo é obrigatório'
  }

  return ''
}

export function validateStrongPassword(password: string): string {
  if (!password) {
    return 'Senha é obrigatória'
  }

  if (password.length < 6) {
    return 'Mínimo de 6 caracteres'
  }

  return ''
}
