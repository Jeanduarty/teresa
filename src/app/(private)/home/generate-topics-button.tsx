import { Loader2, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button, Popover, PopoverAnchor, PopoverContent } from '../../../components/ui'
import type { UserSocialJobProgress, UserSocialJobsStatus } from '../../../shared/types/account-types'

interface GenerateTopicsButtonProps {
  canRun: boolean
  isProcessing: boolean
  isStatusError?: boolean
  cooldownEndsAt?: string | null
  status?: UserSocialJobsStatus
  onRun: () => void
}

const JOB_STATUS_LABEL: Record<string, string> = {
  pending: 'Na fila',
  running: 'Em andamento',
  completed: 'Concluído',
  failed: 'Falhou',
  rate_limited: 'Rate limit',
}

function formatCooldownRemaining(endsAt: string): string {
  const ms = new Date(endsAt).getTime() - Date.now()
  if (ms <= 0) return ''
  const totalMinutes = Math.ceil(ms / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`
  if (hours > 0) return `${hours}h`
  return `${minutes}min`
}

function JobStatusBadge({ status }: { status: string }) {
  const isRunning = status === 'running'
  const isFailed = status === 'failed'
  const isCompleted = status === 'completed'

  const className = isRunning
    ? 'bg-blue-50 text-blue-600'
    : isFailed
      ? 'bg-red-50 text-red-600'
      : isCompleted
        ? 'bg-[#edf7f1] text-[#1d9a52]'
        : 'bg-[#f4f4f2] text-[#666]'

  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${className}`}>
      {JOB_STATUS_LABEL[status] ?? status}
    </span>
  )
}

function JobProgressCard({ job }: { job: UserSocialJobProgress }) {
  return (
    <div className="rounded-[14px] border border-black/10 bg-[#fafaf9] px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold capitalize text-[#181818]">{job.provider}</p>
        <JobStatusBadge status={job.status} />
      </div>
      <p className="mt-1.5 text-[10px] leading-4 text-[#666]">
        {job.postsRead} lidos · {job.newPosts} novos · {job.pagesFetched} páginas
      </p>
      {job.lastError && (
        <p className="mt-1 text-[10px] text-red-600">{job.lastError}</p>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  variant = 'default',
}: {
  label: string
  value: number
  variant?: 'default' | 'success' | 'error'
}) {
  const colorClass = variant === 'success'
    ? 'text-[#1d9a52]'
    : variant === 'error'
      ? 'text-red-600'
      : 'text-[#181818]'
  const bgClass = variant === 'error' ? 'bg-red-50' : 'bg-[#fafaf9]'
  const borderClass = variant === 'error' ? 'border-red-100' : 'border-black/10'

  return (
    <div className={`rounded-[14px] border ${borderClass} ${bgClass} px-3 py-2.5`}>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#999]">{label}</p>
      <p className={`font-heading text-xl font-semibold ${colorClass}`}>{value}</p>
    </div>
  )
}

const PHASE_LABEL: Record<string, string> = {
  collecting: 'Buscando posts curtidos...',
  analyzing: 'Analisando vídeos...',
  generating_topics: 'Gerando tópicos com IA...',
}

function AnalysisProgress({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return (
    <div className="mt-3">
      <div className="mb-1 flex items-center justify-between text-[10px] text-[#666]">
        <span>{done} de {total} vídeos analisados</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ebebeb]">
        <div
          className="h-full rounded-full bg-[#1d9a52] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function ProcessingContent({ status, isStatusError }: { status?: UserSocialJobsStatus; isStatusError?: boolean }) {
  if (!status) {
    return (
      <div>
        <h3 className="font-heading text-base font-semibold text-[#181818]">Gerando tópicos</h3>
        <p className="mt-1 text-xs leading-5 text-[#666]">
          {isStatusError
            ? 'Reconectando ao servidor...'
            : 'Aguardando informações do processamento.'}
        </p>
        {isStatusError && (
          <p className="mt-2 rounded-[10px] border border-amber-100 bg-amber-50 px-2.5 py-2 text-[10px] leading-4 text-amber-700">
            Não foi possível confirmar o status agora. Assim que o servidor responder, o estado será atualizado.
          </p>
        )}
      </div>
    )
  }

  const phaseLabel = status.phase ? PHASE_LABEL[status.phase] : 'Processando...'
  const isAnalyzing = status.phase === 'analyzing'

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-heading text-base font-semibold text-[#181818]">
          {phaseLabel}
        </h3>
        {status.postsCollected > 0 && (
          <p className="mt-1 text-[11px] text-[#666]">
            {status.postsCollected} {status.postsCollected === 1 ? 'post curtido buscado' : 'posts curtidos buscados'}
          </p>
        )}
      </div>

      {isAnalyzing && status.totalVideosToAnalyze > 0 && (
        <AnalysisProgress done={status.analyzedVideos} total={status.totalVideosToAnalyze} />
      )}

      {status.jobs.length > 0 && (
        <div className="mt-4 space-y-2">
          {status.jobs.map(job => (
            <JobProgressCard key={job.id} job={job} />
          ))}
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        {status.failedJobs > 0 && (
          <div className="col-span-2">
            <StatCard label="Com erro" value={status.failedJobs} variant="error" />
          </div>
        )}
      </div>

      {status.errorMessage && (
        <p className="mt-3 rounded-[12px] border border-red-100 bg-red-50 px-3 py-2.5 text-xs text-red-600">
          {status.errorMessage}
        </p>
      )}
    </div>
  )
}

function CompletedContent({ cooldownEndsAt, status }: { cooldownEndsAt: string; status?: UserSocialJobsStatus }) {
  const [remaining, setRemaining] = useState(() => formatCooldownRemaining(cooldownEndsAt))

  useEffect(() => {
    const update = () => setRemaining(formatCooldownRemaining(cooldownEndsAt))
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [cooldownEndsAt])

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-heading text-base font-semibold text-[#181818]">Última execução</h3>
        {remaining && (
          <span className="shrink-0 rounded-full bg-[#f4f4f2] px-2 py-0.5 text-[10px] font-semibold text-[#666]">
            {remaining} restantes
          </span>
        )}
      </div>

      {status ? (
        <>
          {status.jobs.length > 0 && (
            <div className="mb-3 space-y-2">
              {status.jobs.map(job => (
                <JobProgressCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {status.generatedTopics > 0 && (
            <p className="text-[11px] font-semibold text-[#1d9a52]">
              {status.generatedTopics} {status.generatedTopics === 1 ? 'tópico gerado' : 'tópicos gerados'}
            </p>
          )}

          {status.failedJobs > 0 && (
            <p className="mt-1 text-[11px] text-red-600">
              {status.failedJobs} {status.failedJobs === 1 ? 'job falhou' : 'jobs falharam'}
            </p>
          )}

          {status.errorMessage && (
            <p className="mt-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
              {status.errorMessage}
            </p>
          )}
        </>
      ) : (
        <p className="text-xs text-[#666]">Execute novamente para ver os resultados aqui.</p>
      )}
    </div>
  )
}

export function GenerateTopicsButton({
  canRun,
  isProcessing,
  isStatusError,
  cooldownEndsAt,
  status,
  onRun,
}: GenerateTopicsButtonProps) {
  const [open, setOpen] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!cooldownEndsAt) {
      return
    }
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [cooldownEndsAt])

  const isInCooldown = !!cooldownEndsAt && new Date(cooldownEndsAt).getTime() > now
  const hasTooltip = isProcessing || isInCooldown

  function cancelClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  function handleMouseEnter() {
    cancelClose()
    if (hasTooltip) setOpen(true)
  }

  function handleMouseLeave() {
    closeTimerRef.current = setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  return (
    <Popover open={open && hasTooltip} onOpenChange={setOpen}>
      {/*
        PopoverAnchor wraps the button div so hover events fire even when
        the button is disabled (disabled elements suppress mouse events).
      */}
      <PopoverAnchor asChild>
        <div
          className="inline-flex"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Button
            variant="secondary"
            size="sm"
            className='rounded-full'
            icon={
              isProcessing
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Sparkles className="h-4 w-4" />
            }
            disabled={!canRun}
            onClick={canRun ? onRun : undefined}
          >
            {isProcessing ? <span className="animate-pulse">Processando</span> : 'Gerar tópicos'}
          </Button>
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="center"
        side="bottom"
        className="w-[300px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isProcessing || !cooldownEndsAt
          ? <ProcessingContent status={status} isStatusError={isStatusError} />
          : <CompletedContent cooldownEndsAt={cooldownEndsAt} status={status} />
        }
      </PopoverContent>
    </Popover>
  )
}
