import { Play, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button, Card } from './ui'
import type {
  UserSocialJobsResult,
  UserSocialJobsStatus,
} from '../shared/types/account-types'

interface RunSocialJobsCardProps {
  hasConnectedSocialAccount: boolean
  cooldownEndsAt: string | null
  isPending: boolean
  result?: UserSocialJobsResult
  status?: UserSocialJobsStatus
  onRun: () => void
}

function formatCooldown(cooldownEndsAt: string | null, now: number): string | null {
  if (!cooldownEndsAt) {
    return null
  }

  const remainingMs = new Date(cooldownEndsAt).getTime() - now

  if (remainingMs <= 0) {
    return null
  }

  const hours = Math.floor(remainingMs / (1000 * 60 * 60))
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `Disponível em ${hours}h ${minutes}min`
  }

  return `Disponível em ${minutes}min`
}

export function RunSocialJobsCard({
  hasConnectedSocialAccount,
  cooldownEndsAt,
  isPending,
  result,
  status,
  onRun,
}: RunSocialJobsCardProps) {
  const [now, setNow] = useState(() => Date.now())
  const cooldownLabel = formatCooldown(cooldownEndsAt, now)
  const isBlocked = Boolean(cooldownLabel)
  const isJobRunning = Boolean(status && !status.isComplete)
  const canRun = hasConnectedSocialAccount && !isBlocked && !isPending && !isJobRunning
  const latestResult = status ?? result
  const statusMessage = status
    ? status.errorMessage
      ? 'O processamento falhou. Tente novamente.'
      : status.isComplete
        ? 'Tópicos gerados com sucesso!'
        : 'Processamento em segundo plano. Essa seção atualiza automaticamente.'
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
    <div className="space-y-4">
      <Card as="section" variant="muted" className="rounded-[22px] p-4">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[16px] bg-white text-[#181818] ring-1 ring-black/10">
              <Sparkles className="size-4" />
            </div>

            <div className="min-w-0">
              <h3 className="font-heading text-lg font-semibold text-[#181818]">
                Gerar tópicos
              </h3>
              <p className="text-sm leading-6 text-[#666]">
                Busca curtidas nas suas redes e cria tópicos de conteúdo.
              </p>

              {!hasConnectedSocialAccount ? (
                <p className="mt-3 text-sm font-medium text-[#8a5a00]">
                  Vincule uma rede social para poder gerar tópicos.
                </p>
              ) : null}

              {cooldownLabel ? (
                <p className="mt-3 text-sm font-medium text-[#666]">
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
            onClick={onRun}
            className="shrink-0"
          >
            {isPending ? 'Criando jobs...' : isJobRunning ? 'Processando' : 'Gerar tópicos'}
          </Button>
        </div>

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
