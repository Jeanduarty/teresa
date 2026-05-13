import type { AccountFeedbackTone } from './account-settings-types'

const TONE_STYLES = {
  success: 'border-green-200 bg-green-50 text-green-700',
  error: 'border-red-200 bg-red-50 text-red-700',
}

interface AccountSettingsFeedbackProps {
  tone: AccountFeedbackTone
  message?: string | null
}

export function AccountSettingsFeedback({ tone, message }: AccountSettingsFeedbackProps) {
  if (!message) {
    return null
  }

  return (
    <div className={`rounded-[16px] border px-4 py-3 text-sm font-medium ${TONE_STYLES[tone]}`}>
      {message}
    </div>
  )
}
