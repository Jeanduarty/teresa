import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  AtSign,
  Check,
  ExternalLink,
  Folder,
  Music2,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  User,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  Button,
  ButtonAnchor,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from '../../../../components/ui'
import { useAuthSession } from '../../../../hooks/use-auth'
import { useContentTopicDetail, useTopicGroups } from '../../../../hooks/use-content-topics'
import type {
  ContentTopic,
  ContentTopicGroup,
  TopicReference,
  SocialProvider,
} from '../../../../shared/types/account-types'

const PROVIDERS: Record<
  SocialProvider,
  { label: string; icon: LucideIcon; className: string }
> = {
  twitter: {
    label: 'Twitter/X',
    icon: AtSign,
    className: 'border-zinc-200 bg-zinc-50 text-zinc-800',
  },
  tiktok: {
    label: 'TikTok',
    icon: Music2,
    className: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  },
}

type EditFieldState = { field: 'title' | 'summary'; value: string } | null

function formatDate(dateString: string | null): string {
  if (!dateString) {
    return 'Nao registrado'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString))
}

function ProviderBadge({ provider }: { provider: SocialProvider }) {
  const config = PROVIDERS[provider]
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  )
}

function TagBadge({
  tag,
  onRemove,
}: {
  tag: string
  onRemove?: () => void
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#f4f4f2] px-3 py-1.5 text-xs font-semibold text-[#666]">
      {tag}
      {onRemove ? (
        <button type="button" onClick={onRemove} className="text-[#999] transition-colors hover:text-[#181818]">
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </span>
  )
}

function SavedPostCard({ post }: { post: TopicReference }) {
  const signalLabel = post.likedAt ? 'Curtido' : 'Salvo'

  return (
    <Card as="article" variant="muted" className="rounded-[20px] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <ProviderBadge provider={post.provider} />
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-[#666]">
              {signalLabel}
            </span>
          </div>

          <h3 className="font-heading text-lg font-semibold leading-tight text-[#181818]">
            {post.title}
          </h3>
          <p className="mt-1 font-mono text-sm text-[#666]">{post.creatorHandle}</p>

          <div className="mt-4 rounded-[16px] border border-black/10 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">
              Por que entrou no topico
            </p>
            <p className="mt-2 text-sm leading-6 text-[#666]">{post.engagementReason}</p>
          </div>

          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-[#181818]">Coletado em</dt>
              <dd className="mt-1 text-[#666]">{formatDate(post.savedAt)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#181818]">Curtido em</dt>
              <dd className="mt-1 text-[#666]">
                {post.likedAt ? formatDate(post.likedAt) : 'Nao informado'}
              </dd>
            </div>
          </dl>
        </div>

        <ButtonAnchor
          href={post.url}
          target="_blank"
          rel="noreferrer"
          variant="secondary"
          className="h-10 shrink-0 rounded-full px-4"
          icon={<ExternalLink className="h-4 w-4" />}
        >
          Abrir post
        </ButtonAnchor>
      </div>
    </Card>
  )
}

function EditableTitle({
  topic,
  onEdit,
}: {
  topic: ContentTopic
  onEdit: (field: EditFieldState) => void
}) {
  return (
    <div>
      <button
        type="button"
        onClick={() => onEdit({ field: 'title', value: topic.title })}
        className="group inline-flex max-w-full items-center gap-2 text-left"
      >
        <h1 className="font-heading text-3xl font-bold leading-tight text-[#141414]">
          {topic.title}
        </h1>
        <Pencil className="mt-1 h-4 w-4 shrink-0 text-[#999] opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      <button
        type="button"
        onClick={() => onEdit({ field: 'summary', value: topic.summary })}
        className="group mt-4 flex max-w-[760px] items-start gap-2 text-left"
      >
        <p className="text-base leading-7 text-[#666]">{topic.summary}</p>
        <Pencil className="mt-1.5 h-4 w-4 shrink-0 text-[#999] opacity-0 transition-opacity group-hover:opacity-100" />
      </button>
    </div>
  )
}

function TopicOverview({
  topic,
  isMarkingDone,
  isMarkingPending,
  isDeleting,
  onEdit,
  onMarkDone,
  onMarkPending,
  onDelete,
}: {
  topic: ContentTopic
  isMarkingDone: boolean
  isMarkingPending: boolean
  isDeleting: boolean
  onEdit: (field: EditFieldState) => void
  onMarkDone: () => void
  onMarkPending: () => void
  onDelete: () => void
}) {
  const isEdited = Boolean(topic.editedAt)
  const isDeleted = topic.status === 'deleted'
  const isCompleted = topic.status === 'completed' || Boolean(topic.completedAt)

  return (
    <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 items-start gap-6">
        <div className="app-icon-badge-user flex h-20 w-20 shrink-0 items-center justify-center rounded-full">
          <User className="h-10 w-10 text-white" strokeWidth={2} />
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <ProviderBadge provider={topic.sourceProvider} />
            {topic.groups.map((group) => (
              <span
                key={group.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-[#666]"
              >
                <Folder className="h-3.5 w-3.5" />
                {group.name}
              </span>
            ))}
            {isEdited ? (
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
                Editado
              </span>
            ) : null}
          </div>

          <EditableTitle topic={topic} onEdit={onEdit} />

          <dl className="mt-5 grid gap-3 text-sm text-[#666] sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-[#181818]">Gerado em</dt>
              <dd className="mt-1">{formatDate(topic.generatedAt)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#181818]">Feito em</dt>
              <dd className="mt-1">{topic.completedAt ? formatDate(topic.completedAt) : 'Pendente'}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <Button
          disabled={isDeleted || isMarkingDone || isMarkingPending}
          onClick={isCompleted ? onMarkPending : onMarkDone}
          className="rounded-full"
          icon={<Check className="h-4 w-4" />}
        >
          {isMarkingDone || isMarkingPending
            ? 'Marcando...'
            : isCompleted
              ? 'Marcar como nao feito'
              : 'Marcar como feito'}
        </Button>

        <Button
          variant="danger"
          disabled={isDeleted || isDeleting}
          className="rounded-full"
          icon={<Trash2 className="h-4 w-4" />}
          onClick={onDelete}
        >
          {isDeleting ? 'Apagando...' : 'Apagar'}
        </Button>
      </div>
    </section>
  )
}

function EditFieldDialog({
  state,
  isSaving,
  onClose,
  onSave,
}: {
  state: EditFieldState
  isSaving: boolean
  onClose: () => void
  onSave: (value: string) => Promise<unknown>
}) {
  const [value, setValue] = useState(state?.value ?? '')

  if (!state) {
    return null
  }

  const isSummary = state.field === 'summary'

  return (
    <Dialog open onOpenChange={(open) => {
      if (!open) {
        onClose()
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSummary ? 'Editar descricao' : 'Editar titulo'}</DialogTitle>
          <DialogDescription>
            {isSummary ? 'Atualize o resumo do topico.' : 'Defina um nome claro para o topico.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {isSummary ? (
            <textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              rows={6}
              className="w-full resize-y rounded-[16px] border border-black/10 bg-white px-4 py-3 text-sm font-medium leading-6 text-[#181818] outline-none transition-colors placeholder:text-[#a0a0a0] focus:border-black/20"
            />
          ) : (
            <Input
              id="topic-field-value"
              label="Titulo"
              value={value}
              onChange={setValue}
              placeholder="Titulo do topico"
            />
          )}

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              disabled={!value.trim() || isSaving}
              icon={<Save className="h-4 w-4" />}
              onClick={() => {
                void onSave(value.trim()).then(onClose)
              }}
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AddTagDialog({
  open,
  isSaving,
  onClose,
  onAdd,
}: {
  open: boolean
  isSaving: boolean
  onClose: () => void
  onAdd: (tag: string) => Promise<unknown>
}) {
  const [tag, setTag] = useState('')

  if (!open) {
    return null
  }

  return (
    <Dialog open onOpenChange={(nextOpen) => {
      if (!nextOpen) {
        onClose()
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar tag</DialogTitle>
          <DialogDescription>Crie uma nova tag para este topico.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input id="new-tag" label="Tag" value={tag} onChange={setTag} placeholder="Ex: futebol" />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              disabled={!tag.trim() || isSaving}
              icon={<Plus className="h-4 w-4" />}
              onClick={() => {
                void onAdd(tag.trim()).then(() => {
                  setTag('')
                  onClose()
                })
              }}
            >
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ManageTagsDialog({
  open,
  tags,
  isSaving,
  onClose,
  onSave,
}: {
  open: boolean
  tags: string[]
  isSaving: boolean
  onClose: () => void
  onSave: (tags: string[]) => Promise<unknown>
}) {
  const [draftTags, setDraftTags] = useState(tags)

  if (!open) {
    return null
  }

  function updateTag(index: number, value: string) {
    setDraftTags((current) => current.map((tag, itemIndex) => (itemIndex === index ? value : tag)))
  }

  function removeTag(index: number) {
    setDraftTags((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <Dialog open onOpenChange={(nextOpen) => {
      if (!nextOpen) {
        onClose()
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar tags</DialogTitle>
          <DialogDescription>Ajuste ou remova as tags do topico.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            {draftTags.length === 0 ? (
              <p className="rounded-[16px] border border-dashed border-black/10 bg-[#fbfbfa] px-4 py-5 text-center text-sm text-[#666]">
                Nenhuma tag adicionada.
              </p>
            ) : null}

            {draftTags.map((tag, index) => (
              <div key={`${tag}-${index}`} className="flex items-center gap-2">
                <Input
                  id={`tag-${index}`}
                  value={tag}
                  onChange={(value) => updateTag(index, value)}
                  className="min-w-0"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 shrink-0 rounded-full px-0"
                  aria-label="Remover tag"
                  icon={<X className="h-4 w-4" />}
                  onClick={() => removeTag(index)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              disabled={isSaving}
              icon={<Save className="h-4 w-4" />}
              onClick={() => {
                void onSave(draftTags.map((tag) => tag.trim()).filter(Boolean)).then(onClose)
              }}
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TagsCard({
  tags,
  isSaving,
  onSave,
}: {
  tags: string[]
  isSaving: boolean
  onSave: (tags: string[]) => Promise<unknown>
}) {
  const [isEditingTags, setIsEditingTags] = useState(false)
  const [isAddingTag, setIsAddingTag] = useState(false)

  async function addTag(tag: string) {
    const nextTags = Array.from(new Set([...tags, tag]))
    await onSave(nextTags)
  }

  return (
    <Card className="rounded-[24px] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-semibold text-[#141414]">Tags</h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="xs"
            className="h-8 w-8 rounded-full px-0"
            aria-label="Editar tags"
            icon={<Pencil className="h-3.5 w-3.5" />}
            onClick={() => setIsEditingTags(true)}
          />
          <Button
            size="xs"
            className="h-8 w-8 rounded-full px-0"
            aria-label="Adicionar tag"
            icon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setIsAddingTag(true)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.length === 0 ? (
          <p className="text-sm leading-6 text-[#666]">Nenhuma tag adicionada.</p>
        ) : null}
        {tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>

      <ManageTagsDialog
        key={`manage-${tags.join(',')}`}
        open={isEditingTags}
        tags={tags}
        isSaving={isSaving}
        onClose={() => setIsEditingTags(false)}
        onSave={onSave}
      />
      <AddTagDialog
        key={isAddingTag ? 'adding-tag' : 'closed-tag'}
        open={isAddingTag}
        isSaving={isSaving}
        onClose={() => setIsAddingTag(false)}
        onAdd={addTag}
      />
    </Card>
  )
}

function GroupsCard({
  topic,
  groups,
  isAdding,
  isRemoving,
  onAdd,
  onRemove,
}: {
  topic: ContentTopic
  groups: ContentTopicGroup[]
  isAdding: boolean
  isRemoving: boolean
  onAdd: (groupId: string) => Promise<unknown>
  onRemove: (groupId: string) => Promise<unknown>
}) {
  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const topicGroupIds = new Set(topic.groups.map((group) => group.id))
  const availableGroups = groups.filter((group) => !topicGroupIds.has(group.id))

  return (
    <Card className="rounded-[24px] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-semibold text-[#141414]">Grupos</h2>
        <Button
          size="xs"
          variant="secondary"
          className="h-8 w-8 rounded-full px-0"
          aria-label="Adicionar grupo"
          icon={<Plus className="h-3.5 w-3.5" />}
          onClick={() => setIsAddingGroup(true)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {topic.groups.length === 0 ? (
          <p className="text-sm leading-6 text-[#666]">Este topico ainda nao esta em nenhum grupo.</p>
        ) : null}
        {topic.groups.map((group) => (
          <TagBadge
            key={group.id}
            tag={group.name}
            onRemove={() => {
              void onRemove(group.id)
            }}
          />
        ))}
      </div>

      {isAddingGroup ? (
        <Dialog open onOpenChange={setIsAddingGroup}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar a um grupo</DialogTitle>
              <DialogDescription>Escolha um ou mais grupos para este topico.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              {availableGroups.length === 0 ? (
                <p className="rounded-[16px] border border-dashed border-black/10 bg-[#fbfbfa] px-4 py-5 text-center text-sm text-[#666]">
                  Todos os grupos ja estao vinculados.
                </p>
              ) : null}
              {availableGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  disabled={isAdding || isRemoving}
                  onClick={() => {
                    void onAdd(group.id)
                  }}
                  className="flex items-center justify-between rounded-[16px] border border-black/10 bg-white px-4 py-3 text-left text-sm font-semibold text-[#181818] transition-colors hover:border-black/20 hover:bg-[#fbfbfa] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{group.name}</span>
                  <Plus className="h-4 w-4 text-[#777]" />
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </Card>
  )
}

function ScriptEditor({
  topic,
  isSaving,
  isResetting,
  onSave,
  onReset,
}: {
  topic: ContentTopic
  isSaving: boolean
  isResetting: boolean
  onSave: (script: string) => Promise<void>
  onReset: () => Promise<void>
}) {
  const [draftScript, setDraftScript] = useState(topic.currentScript)
  const hasDraftChanges = useMemo(
    () => draftScript !== topic.currentScript,
    [draftScript, topic.currentScript],
  )

  return (
    <div className="app-panel rounded-[24px] p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-[#141414]">
            Previa e sugestao
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#666]">
            Ajuste a ideia antes de transformar em roteiro, post ou outro formato.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {topic.editedAt ? (
            <Button
              onClick={onReset}
              disabled={isResetting}
              variant="secondary"
              className="h-10 rounded-full px-4"
              icon={<RotateCcw className="h-4 w-4" />}
            >
              {isResetting ? 'Restaurando...' : 'Ver original'}
            </Button>
          ) : null}

          <Button
            onClick={() => onSave(draftScript.trim())}
            disabled={!draftScript.trim() || !hasDraftChanges || isSaving}
            className="h-10 rounded-full px-4"
            icon={<Save className="h-4 w-4" />}
          >
            {isSaving ? 'Salvando...' : 'Salvar sugestao'}
          </Button>
        </div>
      </div>

      <textarea
        value={draftScript}
        onChange={(event) => setDraftScript(event.target.value)}
        rows={18}
        className="min-h-[520px] w-full resize-y rounded-[18px] border border-black/10 bg-[#fbfbfa] px-5 py-4 font-body text-[0.98rem] leading-7 text-[#181818] outline-none transition-colors placeholder:text-[#8f8f8f] focus:border-black/25 focus:bg-white"
      />
    </div>
  )
}

export function TopicDetailsPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthSession()
  const {
    topicQuery,
    updateTopicMutation,
    updateScriptMutation,
    resetScriptMutation,
    markDoneMutation,
    markPendingMutation,
    addGroupMutation,
    removeGroupMutation,
    deleteTopicMutation,
  } = useContentTopicDetail({ userId: user?.id, topicId })
  const { groupsQuery } = useTopicGroups(user?.id)
  const [editField, setEditField] = useState<EditFieldState>(null)
  const topic = topicQuery.data
  const groups = groupsQuery.data ?? []

  async function handleSaveScript(script: string): Promise<void> {
    if (!script) {
      return
    }

    await updateScriptMutation.mutateAsync(script)
  }

  async function handleResetScript(): Promise<void> {
    await resetScriptMutation.mutateAsync()
  }

  async function handleDeleteTopic(): Promise<void> {
    if (!window.confirm('Apagar este topico? Ele ficara com status apagado.')) {
      return
    }

    await deleteTopicMutation.mutateAsync()
    navigate('/')
  }

  return (
    <main className="mx-auto w-full max-w-[1128px] px-6 py-10 md:px-0">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-[0.96rem] font-medium text-[#666] transition-colors hover:text-[#141414]"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para topicos
      </Link>

      {topicQuery.isLoading ? (
        <div className="space-y-5">
          <div className="h-[180px] animate-pulse rounded-[24px] bg-[#f0f0ee]" />
          <div className="h-[420px] animate-pulse rounded-[24px] bg-[#f0f0ee]" />
        </div>
      ) : null}

      {topicQuery.error ? (
        <div className="rounded-[22px] border border-red-200 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
          {topicQuery.error.message}
        </div>
      ) : null}

      {topic ? (
        <div className="space-y-6">
          <TopicOverview
            topic={topic}
            isMarkingDone={markDoneMutation.isPending}
            isMarkingPending={markPendingMutation.isPending}
            isDeleting={deleteTopicMutation.isPending}
            onEdit={setEditField}
            onMarkDone={() => {
              void markDoneMutation.mutateAsync()
            }}
            onMarkPending={() => {
              void markPendingMutation.mutateAsync()
            }}
            onDelete={() => {
              void handleDeleteTopic()
            }}
          />

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <ScriptEditor
              key={`${topic.id}-${topic.currentScript}`}
              topic={topic}
              isSaving={updateScriptMutation.isPending}
              isResetting={resetScriptMutation.isPending}
              onSave={handleSaveScript}
              onReset={handleResetScript}
            />

            <aside className="space-y-4">
              <TagsCard
                tags={topic.tags}
                isSaving={updateTopicMutation.isPending}
                onSave={(tags) => updateTopicMutation.mutateAsync({ tags })}
              />

              <GroupsCard
                topic={topic}
                groups={groups}
                isAdding={addGroupMutation.isPending}
                isRemoving={removeGroupMutation.isPending}
                onAdd={(groupId) => addGroupMutation.mutateAsync(groupId)}
                onRemove={(groupId) => removeGroupMutation.mutateAsync(groupId)}
              />
            </aside>
          </section>

          <section className="app-panel rounded-[24px] p-6">
            <div className="mb-5">
              <h2 className="font-heading text-2xl font-semibold text-[#141414]">Referencias do topico</h2>
              <p className="mt-2 text-sm leading-6 text-[#666]">
                Posts e videos que sustentaram a sugestao criada pela IA.
              </p>
            </div>

            <div className="grid gap-4">
              {topic.topicReferences.map((post) => (
                <SavedPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>

          <EditFieldDialog
            key={`${editField?.field ?? 'closed'}-${editField?.value ?? ''}`}
            state={editField}
            isSaving={updateTopicMutation.isPending}
            onClose={() => setEditField(null)}
            onSave={(value) =>
              updateTopicMutation.mutateAsync(
                editField?.field === 'summary' ? { summary: value } : { title: value },
              )
            }
          />
        </div>
      ) : null}
    </main>
  )
}
