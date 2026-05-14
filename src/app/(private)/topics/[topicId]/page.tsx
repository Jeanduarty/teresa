import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useAuthSession } from '../../../../hooks/use-auth'
import { useContentTopicDetail, useTopicGroups } from '../../../../hooks/use-content-topics'
import { TopicEditFieldDialog, type EditFieldState } from './topic-edit-field-dialog'
import { TopicGroupsCard } from './topic-groups-card'
import { TopicOverview } from './topic-overview'
import { TopicReferenceCard } from './topic-reference-card'
import { TopicScriptEditor } from './topic-script-editor'
import { TopicTagsCard } from './topic-tags-card'

function TopicDetailsLoadingState() {
  return (
    <div className="space-y-5">
      <div className="h-[180px] animate-pulse rounded-[24px] bg-[#f0f0ee]" />
      <div className="h-[420px] animate-pulse rounded-[24px] bg-[#f0f0ee]" />
    </div>
  )
}

function TopicDetailsErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-[22px] border border-red-200 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
      {message}
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

      {topicQuery.isLoading ? <TopicDetailsLoadingState /> : null}
      {topicQuery.error ? <TopicDetailsErrorState message={topicQuery.error.message} /> : null}

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
            <TopicScriptEditor
              key={`${topic.id}-${topic.currentScript}`}
              topic={topic}
              isSaving={updateScriptMutation.isPending}
              isResetting={resetScriptMutation.isPending}
              onSave={handleSaveScript}
              onReset={handleResetScript}
            />

            <aside className="space-y-4">
              <TopicTagsCard
                tags={topic.tags}
                isSaving={updateTopicMutation.isPending}
                onSave={(tags) => updateTopicMutation.mutateAsync({ tags })}
              />

              <TopicGroupsCard
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
              <h2 className="font-heading text-2xl font-semibold text-[#141414]">
                Referencias do topico
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#666]">
                Posts e videos que sustentaram a sugestao criada pela IA.
              </p>
            </div>

            <div className="grid gap-4">
              {topic.topicReferences.map((reference) => (
                <TopicReferenceCard key={reference.id} reference={reference} />
              ))}
            </div>
          </section>

          <TopicEditFieldDialog
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
