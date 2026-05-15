import { Clock3, Play, Share2, Terminal } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button, Card } from '../../../components/ui'
import type {
  DevelopmentSocialJobsResult,
  DevelopmentSocialJobsStatus,
} from '../../../shared/types/account-types'
import { AccountSettingsFeedback } from './account-settings-feedback'

interface AccountSettingsDevelopmentSectionProps {
  hasConnectedSocialAccount: boolean
  cooldownEndsAt: string | null
  isPending: boolean
  result?: DevelopmentSocialJobsResult
  status?: DevelopmentSocialJobsStatus
  errorMessage?: string
  onRunSocialJobs: () => void
}

function formatCooldown(cooldownEndsAt: string | null, now: number): string | null {
  if (!cooldownEndsAt) {
    return null
  }

  const remainingMs = new Date(cooldownEndsAt).getTime() - now

  if (remainingMs <= 0) {
    return null
  }

  const remainingMinutes = Math.ceil(remainingMs / 60_000)
  return `Disponível novamente em aproximadamente ${remainingMinutes} min.`
}

export function AccountSettingsDevelopmentSection({
  hasConnectedSocialAccount,
  cooldownEndsAt,
  isPending,
  result,
  status,
  errorMessage,
  onRunSocialJobs,
}: AccountSettingsDevelopmentSectionProps) {
  const [now, setNow] = useState(() => Date.now())
  const cooldownLabel = formatCooldown(cooldownEndsAt, now)
  const isBlocked = Boolean(cooldownLabel)
  const isJobRunning = Boolean(status && !status.isComplete)
  const canRun = hasConnectedSocialAccount && !isBlocked && !isPending && !isJobRunning
  const latestResult = status ?? result
  const statusMessage = status
    ? status.errorMessage
      ? 'O processamento falhou. Verifique o erro acima e tente novamente após o cooldown.'
      : status.isComplete
        ? 'Jobs concluídos. Os tópicos gerados já devem aparecer na área principal.'
        : 'Jobs criados. O processamento continua em segundo plano e esta seção atualiza automaticamente.'
    : null

  useEffect(() => {
    if (!cooldownEndsAt) {
      return
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now())
    }, 15_000)

    return () => window.clearInterval(intervalId)
  }, [cooldownEndsAt])

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-black/10 bg-[#fbfbfa] text-[#181818]">
          <Terminal className="h-5 w-5" />
        </div>
        <h2 className="mt-4 font-heading text-[2rem] font-bold tracking-[-0.02em] text-[#181818]">
          Desenvolvimento
        </h2>
        <p className="mt-2 max-w-[560px] text-sm leading-6 text-[#666]">
          Execute rotinas internas sem sair do painel. Esta área só aparece para contas criadas com
          a chave de desenvolvimento configurada no servidor.
        </p>
      </div>

      <Card as="section" variant="muted" className="rounded-[22px] p-4">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[16px] bg-white text-[#181818] ring-1 ring-black/10">
              <Share2 className="size-4" />
            </div>

            <div className="min-w-0">
              <h3 className="font-heading text-lg font-semibold text-[#181818]">
                Jobs sociais
              </h3>
              <p className="text-sm leading-6 text-[#666]">
                Coleta curtidas das redes vinculadas e gera tópicos.
              </p>

              {!hasConnectedSocialAccount ? (
                <p className="mt-3 text-sm font-medium text-[#8a5a00]">
                  Vincule pelo menos uma rede social para liberar a execução.
                </p>
              ) : null}

              {cooldownLabel ? (
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#666]">
                  <Clock3 className="h-4 w-4" />
                  {cooldownLabel}
                </p>
              ) : null}
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={!canRun}
            icon={<Play className="h-3.5 w-3.5" />}
            onClick={onRunSocialJobs}
            className="shrink-0"
          >
            {isPending ? 'Criando jobs...' : isJobRunning ? 'Jobs em andamento' : 'Executar jobs'}
          </Button>
        </div>

        <AccountSettingsFeedback tone="error" message={errorMessage} />
        <AccountSettingsFeedback tone="error" message={status?.errorMessage} />

        {statusMessage ? (
          <p className="mt-4 rounded-[16px] border border-black/10 bg-white px-4 py-3 text-sm font-medium text-[#555]">
            {statusMessage}
          </p>
        ) : null}

        {latestResult ? (
          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-[16px] border border-black/10 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">
                Jobs criados
              </p>
              <p className="mt-1 font-heading text-2xl font-semibold text-[#181818]">
                {latestResult.enqueuedJobs}
              </p>
            </div>
            <div className="rounded-[16px] border border-black/10 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">
                Jobs processados
              </p>
              <p className="mt-1 font-heading text-2xl font-semibold text-[#181818]">
                {latestResult.processedJobs}
              </p>
            </div>
            <div className="rounded-[16px] border border-black/10 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">
                Tópicos gerados
              </p>
              <p className="mt-1 font-heading text-2xl font-semibold text-[#181818]">
                {latestResult.generatedTopics}
              </p>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  )
}
