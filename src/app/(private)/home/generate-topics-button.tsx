import { Loader2, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button, Popover, PopoverContent, PopoverTrigger } from '../../../components/ui'
import type { UserSocialJobsStatus } from '../../../shared/types/account-types'

interface GenerateTopicsButtonProps {
  canRun: boolean
  isProcessing: boolean
  hasCooldown: boolean
  cooldownEndsAt: string | null
  status?: UserSocialJobsStatus
  onRun: () => void
}

function formatTimeRemaining(endsAt: string | null, now: number): string | null {
  if (!endsAt) return null
  const remaining = new Date(endsAt).getTime() - now
  if (remaining <= 0) return null
  const hours = Math.floor(remaining / (1000 * 60 * 60))
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) return `${hours}h ${minutes}min`
  return `${minutes}min`
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

function ProcessingContent({ status }: { status?: UserSocialJobsStatus }) {
  if (!status) {
    return (
      <div>
        <h3 className="font-heading text-base font-semibold text-[#181818]">Gerando tópicos</h3>
        <p className="mt-1 text-xs leading-5 text-[#666]">Aguardando informações do processamento.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-heading text-base font-semibold text-[#181818]">Gerando tópicos</h3>
        <p className="mt-1 text-xs leading-5 text-[#666]">Atualiza automaticamente.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <StatCard label="Enfileirados" value={status.enqueuedJobs} />
        <StatCard label="Processados" value={status.processedJobs} />
        <StatCard label="Concluídos" value={status.completedJobs} variant="success" />
        <StatCard label="Tópicos" value={status.generatedTopics} />
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

function CooldownContent({ cooldownEndsAt }: { cooldownEndsAt: string | null }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])

  const timeRemaining = formatTimeRemaining(cooldownEndsAt, now)

  return (
    <div>
      <h3 className="font-heading text-base font-semibold text-[#181818]">Próxima execução</h3>
      <p className="mt-1 text-xs leading-5 text-[#666]">
        {timeRemaining ? (
          <>Disponível em <span className="font-semibold text-[#181818]">{timeRemaining}</span>.</>
        ) : (
          'Disponível em breve.'
        )}
      </p>
    </div>
  )
}

export function GenerateTopicsButton({
  canRun,
  isProcessing,
  hasCooldown,
  cooldownEndsAt,
  status,
  onRun,
}: GenerateTopicsButtonProps) {
  const [open, setOpen] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasContent = isProcessing || hasCooldown

  function cancelClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  function handleMouseEnter() {
    cancelClose()
    if (hasContent) setOpen(true)
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
    <Popover open={open && hasContent} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="my-auto rounded-full"
          icon={
            isProcessing
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Sparkles className="h-4 w-4" />
          }
          disabled={!canRun}
          onClick={canRun ? onRun : undefined}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isProcessing ? <span className="animate-pulse">Processando</span> : 'Gerar tópicos'}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        side="bottom"
        className="w-[280px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isProcessing
          ? <ProcessingContent status={status} />
          : <CooldownContent cooldownEndsAt={cooldownEndsAt} />}
      </PopoverContent>
    </Popover>
  )
}
