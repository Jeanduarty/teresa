import { useState } from 'react'
import {
  ArrowLeft,
  History,
  Loader2,
  Pencil,
  RefreshCw,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui'
import { useAuthSession } from '../../../hooks/use-auth'
import { useCreatorProfile } from '../../../hooks/use-creator-profile'
import type {
  CreatorProfile,
  CreatorProfileFieldKey,
  CreatorProfileSnapshot,
  CreatorProfileSnapshotSource,
} from '../../../shared/types/account-types'

const FIELDS: Array<{
  key: CreatorProfileFieldKey
  label: string
  description: string
}> = [
  {
    key: 'niche',
    label: 'Nicho percebido',
    description: 'O assunto que parece organizar tudo que você consome.',
  },
  {
    key: 'communicationStyle',
    label: 'Estilo de comunicação',
    description: 'O tom e ritmo que você gravita em torno.',
  },
  {
    key: 'perceivedAudience',
    label: 'Público percebido',
    description: 'Quem esse conteúdo parece servir, em uma frase.',
  },
  {
    key: 'retentionMechanism',
    label: 'O que prende sua atenção',
    description: 'O gancho recorrente nos conteúdos que você salva.',
  },
  {
    key: 'uniqueAngle',
    label: 'Ângulo único',
    description: 'O que diferencia seu padrão do óbvio do nicho.',
  },
  {
    key: 'contentConstraints',
    label: 'O que você evita',
    description: 'Restrições inferidas por ausência. Pode estar vazio.',
  },
]

const SOURCE_LABEL: Record<CreatorProfileSnapshotSource, string> = {
  inferred: 'Inferência automática',
  manual: 'Ajuste manual',
  new_direction: 'Nova direção',
  reset: 'Reset',
  restored: 'Restauração',
}

const CONFIDENCE_LABEL: Record<'low' | 'medium' | 'high', string> = {
  low: 'baixa',
  medium: 'média',
  high: 'alta',
}

function formatRelativeDate(iso: string | null): string {
  if (!iso) return '—'
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 30) return `há ${days} dias`
  const months = Math.floor(days / 30)
  if (months === 1) return 'há 1 mês'
  return `há ${months} meses`
}

export function CreatorProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuthSession()
  const {
    profileQuery,
    historyQuery,
    refreshMutation,
    resetMutation,
    adjustFieldMutation,
    applyDirectionMutation,
    restoreMutation,
  } = useCreatorProfile(user?.id)

  const [editingField, setEditingField] = useState<CreatorProfileFieldKey | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [directionOpen, setDirectionOpen] = useState(false)
  const [directionValue, setDirectionValue] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)

  const profile = profileQuery.data
  const isLoading = profileQuery.isLoading
  const errorMessage = profileQuery.error?.message
    ?? refreshMutation.error?.message
    ?? resetMutation.error?.message
    ?? adjustFieldMutation.error?.message
    ?? applyDirectionMutation.error?.message
    ?? restoreMutation.error?.message

  function openEdit(field: CreatorProfileFieldKey, currentValue: string | null) {
    setEditingField(field)
    setEditingValue(currentValue ?? '')
  }

  function closeEdit() {
    setEditingField(null)
    setEditingValue('')
  }

  async function submitEdit() {
    if (!editingField) return
    const value = editingValue.trim()
    if (!value) return
    try {
      await adjustFieldMutation.mutateAsync({ field: editingField, value })
      closeEdit()
    } catch {
      // erro mostrado no banner
    }
  }

  async function submitDirection() {
    const value = directionValue.trim()
    if (!value) return
    try {
      await applyDirectionMutation.mutateAsync(value)
      setDirectionValue('')
      setDirectionOpen(false)
    } catch {
      // erro mostrado no banner
    }
  }

  return (
    <main className="mx-auto w-full max-w-[820px] px-6 py-12 md:px-10">
      <Button
        variant="ghost"
        size="sm"
        icon={<ArrowLeft className="h-4 w-4" />}
        className="-ml-2 mb-4 rounded-full"
        onClick={() => navigate('/')}
      >
        Voltar
      </Button>

      <header className="mb-8 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold text-[#141414]">
          Como a Teresa te vê
        </h1>
        <p className="text-sm leading-6 text-[#666]">
          Perfil inferido a partir do que você curte e salva. Você pode ajustar,
          dar nova direção ou pedir uma reinferência a qualquer momento.
        </p>
      </header>

      {errorMessage ? (
        <div className="mb-4 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-[18px] border border-black/10 bg-white p-12 text-center text-sm text-[#666]">
          Carregando perfil...
        </div>
      ) : !profile ? null : !profile.readyForInference && !profile.niche ? (
        <ProfileEmptyState
          availableSignalsCount={profile.availableSignalsCount}
        />
      ) : !profile.niche ? (
        <ProfileFirstRun
          availableSignalsCount={profile.availableSignalsCount}
          isPending={refreshMutation.isPending}
          onRefresh={() => refreshMutation.mutate()}
        />
      ) : (
        <ProfileMirror
          profile={profile}
          onEditField={openEdit}
          onOpenDirection={() => {
            setDirectionValue(profile.userDirection ?? '')
            setDirectionOpen(true)
          }}
          onOpenHistory={() => setHistoryOpen(true)}
          onRefresh={() => refreshMutation.mutate()}
          onReset={() => setResetConfirm(true)}
          isRefreshing={refreshMutation.isPending}
          isResetting={resetMutation.isPending}
        />
      )}

      <Dialog open={editingField !== null} onOpenChange={(open) => { if (!open) closeEdit() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Ajustar {FIELDS.find((f) => f.key === editingField)?.label ?? 'campo'}
            </DialogTitle>
            <DialogDescription>
              Escreva em linguagem natural. A Teresa interpreta o sentido — não
              precisa usar marketing nem categorias técnicas.
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={editingValue}
            onChange={(event) => setEditingValue(event.target.value)}
            placeholder="Ex: na verdade, meu foco é mais em empreendedoras mães"
            className="min-h-[120px] w-full rounded-[14px] border border-black/10 bg-white p-3 text-sm leading-6 outline-none focus:border-black/30"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={closeEdit}>Cancelar</Button>
            <Button
              onClick={() => { void submitEdit() }}
              disabled={adjustFieldMutation.isPending || !editingValue.trim()}
            >
              {adjustFieldMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Salvar ajuste'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={directionOpen} onOpenChange={setDirectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dar nova direção</DialogTitle>
            <DialogDescription>
              Conte em uma frase para onde você quer levar seu conteúdo agora. A
              Teresa vai usar isso para enviesar as próximas inferências e gerações.
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={directionValue}
            onChange={(event) => setDirectionValue(event.target.value)}
            placeholder="Ex: quero focar mais em humor agora"
            className="min-h-[120px] w-full rounded-[14px] border border-black/10 bg-white p-3 text-sm leading-6 outline-none focus:border-black/30"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDirectionOpen(false)}>Cancelar</Button>
            <Button
              onClick={() => { void submitDirection() }}
              disabled={applyDirectionMutation.isPending || !directionValue.trim()}
            >
              {applyDirectionMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Aplicar direção'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={resetConfirm} onOpenChange={setResetConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resetar perfil?</DialogTitle>
            <DialogDescription>
              Vamos inferir tudo do zero a partir dos seus sinais atuais. Sua
              direção e ajustes manuais vão ser limpos. Você ainda pode restaurar
              versões anteriores pelo histórico.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setResetConfirm(false)}>Cancelar</Button>
            <Button
              onClick={async () => {
                try {
                  await resetMutation.mutateAsync()
                  setResetConfirm(false)
                } catch {
                  // banner
                }
              }}
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Resetar e reinferir'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Histórico do perfil</DialogTitle>
            <DialogDescription>
              Cada alteração vira uma versão. Você pode restaurar qualquer uma
              sem perder o histórico atual.
            </DialogDescription>
          </DialogHeader>
          <HistoryList
            snapshots={historyQuery.data ?? []}
            isLoading={historyQuery.isLoading}
            isRestoring={restoreMutation.isPending}
            currentVersion={profile?.currentVersion ?? 0}
            onRestore={async (snapshotId) => {
              try {
                await restoreMutation.mutateAsync(snapshotId)
              } catch {
                // banner
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </main>
  )
}

function ProfileEmptyState({ availableSignalsCount }: { availableSignalsCount: number }) {
  return (
    <div className="rounded-[18px] border border-dashed border-black/15 bg-[#fbfbfa] p-8 text-sm leading-6 text-[#666]">
      <p className="font-heading text-lg font-semibold text-[#141414]">
        Ainda não há sinais suficientes
      </p>
      <p className="mt-2">
        Conecte uma rede social e sincronize seus curtidos/salvos. Quando tiver
        ao menos <strong>10 sinais analisados</strong>, a Teresa consegue inferir
        seu perfil criativo. Você tem {availableSignalsCount} sinal{availableSignalsCount === 1 ? '' : 's'} disponível{availableSignalsCount === 1 ? '' : 's'} hoje.
      </p>
    </div>
  )
}

function ProfileFirstRun({
  availableSignalsCount,
  isPending,
  onRefresh,
}: {
  availableSignalsCount: number
  isPending: boolean
  onRefresh: () => void
}) {
  return (
    <div className="rounded-[18px] border border-black/10 bg-white p-8">
      <div className="flex items-start gap-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f4f4f2]">
          <Sparkles className="h-5 w-5 text-[#141414]" />
        </span>
        <div className="flex-1">
          <h2 className="font-heading text-xl font-semibold text-[#141414]">
            Pronto para a primeira inferência
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#666]">
            Você tem {availableSignalsCount} sinais disponíveis para análise.
            Vamos olhar o padrão e te mostrar como te enxergamos como criador.
          </p>
        </div>
      </div>
      <Button
        className="mt-4"
        onClick={onRefresh}
        disabled={isPending}
        icon={isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      >
        {isPending ? 'Inferindo perfil...' : 'Inferir meu perfil'}
      </Button>
    </div>
  )
}

function ProfileMirror({
  profile,
  onEditField,
  onOpenDirection,
  onOpenHistory,
  onRefresh,
  onReset,
  isRefreshing,
  isResetting,
}: {
  profile: CreatorProfile
  onEditField: (field: CreatorProfileFieldKey, value: string | null) => void
  onOpenDirection: () => void
  onOpenHistory: () => void
  onRefresh: () => void
  onReset: () => void
  isRefreshing: boolean
  isResetting: boolean
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-[18px] border border-black/10 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#666]">
            Baseado em <strong>{profile.signalsAnalyzedCount}</strong> sinais ·
            atualizado <strong>{formatRelativeDate(profile.lastInferredAt)}</strong>
            {profile.confidence ? (
              <> · confiança <strong>{CONFIDENCE_LABEL[profile.confidence]}</strong></>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<History className="h-4 w-4" />}
              onClick={onOpenHistory}
            >
              Histórico
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              Reinferir
            </Button>
          </div>
        </div>

        {profile.summary ? (
          <p className="mt-4 text-sm leading-6 text-[#141414]">{profile.summary}</p>
        ) : null}

        {profile.divergenceFromPrevious ? (
          <p className="mt-3 rounded-[12px] bg-[#fff7ea] px-3 py-2 text-xs text-[#8a5a00]">
            Mudança detectada: {profile.divergenceFromPrevious}
          </p>
        ) : null}

        {profile.userDirection ? (
          <div className="mt-3 rounded-[12px] bg-[#f4f4f2] px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-[#666]">Sua direção atual</p>
            <p className="mt-1 text-sm leading-6 text-[#141414]">{profile.userDirection}</p>
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        {FIELDS.map((field) => {
          const value = profile[field.key]
          return (
            <div
              key={field.key}
              className="rounded-[16px] border border-black/10 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wide text-[#666]">{field.label}</p>
                  <p className="mt-1 text-sm leading-6 text-[#141414]">
                    {value || <span className="italic text-[#999]">não inferido</span>}
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-[#999]">{field.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Pencil className="h-3.5 w-3.5" />}
                  onClick={() => onEditField(field.key, value)}
                >
                  Ajustar
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={onOpenDirection} icon={<Sparkles className="h-4 w-4" />}>
          Dar nova direção
        </Button>
        <Button
          variant="ghost"
          onClick={onReset}
          disabled={isResetting}
          icon={<RotateCcw className="h-4 w-4" />}
        >
          {isResetting ? 'Resetando...' : 'Resetar perfil'}
        </Button>
      </div>
    </div>
  )
}

function HistoryList({
  snapshots,
  isLoading,
  isRestoring,
  currentVersion,
  onRestore,
}: {
  snapshots: CreatorProfileSnapshot[]
  isLoading: boolean
  isRestoring: boolean
  currentVersion: number
  onRestore: (snapshotId: string) => Promise<void>
}) {
  if (isLoading) {
    return <p className="text-sm text-[#666]">Carregando histórico...</p>
  }
  if (snapshots.length === 0) {
    return <p className="text-sm text-[#666]">Ainda sem versões registradas.</p>
  }
  return (
    <ul className="space-y-3">
      {snapshots.map((snapshot) => {
        const isCurrent = snapshot.version === currentVersion
        return (
          <li
            key={snapshot.id}
            className={`rounded-[12px] border px-3 py-2.5 ${isCurrent ? 'border-black/30 bg-[#f4f4f2]' : 'border-black/10 bg-white'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs text-[#666]">
                  v{snapshot.version} · {SOURCE_LABEL[snapshot.source]} · {formatRelativeDate(snapshot.createdAt)}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#141414]">
                  {snapshot.description}
                </p>
                {snapshot.data.summary ? (
                  <p className="mt-1 text-xs leading-5 text-[#666]">{snapshot.data.summary}</p>
                ) : null}
              </div>
              {!isCurrent ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { void onRestore(snapshot.id) }}
                  disabled={isRestoring}
                >
                  Restaurar
                </Button>
              ) : (
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#1d9a52]">Atual</span>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
