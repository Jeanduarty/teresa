import { Check, Folder, Pencil, Trash2, User } from 'lucide-react'

import { Button } from '../../../../components/ui'
import { RichContentText } from '../../../../components/rich-content-text'
import type { ContentTopic } from '../../../../shared/types/account-types'
import { ProviderBadge } from '../../home/provider-badge'
import type { EditFieldState } from './topic-edit-field-dialog'
import { formatTopicDate } from './topic-details-utils'

type TopicOverviewProps = {
  topic: ContentTopic
  isMarkingDone: boolean
  isMarkingPending: boolean
  isDeleting: boolean
  onEdit: (field: EditFieldState) => void
  onMarkDone: () => void
  onMarkPending: () => void
  onDelete: () => void
}

function EditableHeader({
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
        className="group inline-flex max-w-full gap-2 text-left"
      >
        <h1 className="font-heading text-3xl font-bold leading-tight text-[#141414]">
          {topic.title}
        </h1>
        <Pencil className="mt-1 h-4 w-4 shrink-0 text-[#999] opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      <div className="group mt-4 flex max-w-[760px] items-start gap-2 text-left">
        <RichContentText
          text={topic.summary}
          className="text-base leading-7 text-[#666]"
        />
        <button
          type="button"
          onClick={() => onEdit({ field: 'summary', value: topic.summary })}
          className="mt-1.5 shrink-0 rounded-full p-1 text-[#999] opacity-0 transition-opacity hover:bg-[#f4f4f2] hover:text-[#181818] group-hover:opacity-100 focus-visible:opacity-100"
          aria-label="Editar descricao"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function TopicOverview({
  topic,
  isMarkingDone,
  isMarkingPending,
  isDeleting,
  onEdit,
  onMarkDone,
  onMarkPending,
  onDelete,
}: TopicOverviewProps) {
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

          <EditableHeader topic={topic} onEdit={onEdit} />

          <dl className="mt-5 grid gap-3 text-sm text-[#666] sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-[#181818]">Gerado em</dt>
              <dd className="mt-1">{formatTopicDate(topic.generatedAt)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#181818]">Feito em</dt>
              <dd className="mt-1">
                {topic.completedAt ? formatTopicDate(topic.completedAt) : 'Pendente'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <Button
          variant={isCompleted ? 'outline' : 'primary'}
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
