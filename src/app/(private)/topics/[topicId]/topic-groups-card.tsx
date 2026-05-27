import { Check, Folder, Plus, X } from 'lucide-react'
import { useRef, useState } from 'react'

import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui'
import type { ContentTopic, ContentTopicGroup } from '../../../../shared/types/account-types'
import { TopicTagBadge } from './topic-tag-badge'

type TopicGroupsCardProps = {
  topic: ContentTopic
  groups: ContentTopicGroup[]
  isAdding: boolean
  isRemoving: boolean
  isCreating: boolean
  onAdd: (groupId: string) => Promise<unknown>
  onRemove: (groupId: string) => Promise<unknown>
  onCreateGroup: (name: string) => Promise<unknown>
}

export function TopicGroupsCard({
  topic,
  groups,
  isAdding,
  isRemoving,
  isCreating,
  onAdd,
  onRemove,
  onCreateGroup,
}: TopicGroupsCardProps) {
  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const topicGroupIds = new Set(topic.groups.map((group) => group.id))
  const availableGroups = groups.filter((group) => !topicGroupIds.has(group.id))

  function openCreateForm() {
    setIsCreatingNew(true)
    setNewGroupName('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function cancelCreate() {
    setIsCreatingNew(false)
    setNewGroupName('')
  }

  async function handleCreateGroup() {
    const name = newGroupName.trim()
    if (!name || isCreating) return
    await onCreateGroup(name)
    cancelCreate()
  }

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
          <TopicTagBadge
            key={group.id}
            tag={group.name}
            onRemove={() => {
              void onRemove(group.id)
            }}
          />
        ))}
      </div>

      {isAddingGroup ? (
        <Dialog open onOpenChange={(open) => { setIsAddingGroup(open); if (!open) cancelCreate() }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar a um grupo</DialogTitle>
              <DialogDescription>Escolha um grupo existente ou crie um novo.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              {availableGroups.length === 0 && !isCreatingNew ? (
                <div className="rounded-[18px] border border-dashed border-black/10 bg-[#fbfbfa] px-4 py-8 text-center">
                  <Folder className="mx-auto h-5 w-5 text-[#8a8a8a]" />
                  <p className="mt-3 text-sm leading-6 text-[#666]">
                    Todos os grupos ja estao vinculados.
                  </p>
                </div>
              ) : null}

              {availableGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  disabled={isAdding || isRemoving || isCreating}
                  onClick={() => { void onAdd(group.id) }}
                  className="flex items-center justify-between rounded-[16px] border border-black/10 bg-white px-4 py-3 text-left text-sm font-semibold text-[#181818] transition-colors hover:border-black/20 hover:bg-[#fbfbfa] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{group.name}</span>
                  <Plus className="h-4 w-4 text-[#777]" />
                </button>
              ))}

              {isCreatingNew ? (
                <div className="flex items-center gap-2 rounded-[16px] border border-black/20 bg-white px-4 py-2.5">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void handleCreateGroup()
                      if (e.key === 'Escape') cancelCreate()
                    }}
                    placeholder="Nome do grupo"
                    disabled={isCreating}
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#181818] outline-none placeholder:font-normal placeholder:text-[#999] disabled:opacity-60"
                  />
                  <button
                    type="button"
                    disabled={!newGroupName.trim() || isCreating}
                    onClick={() => void handleCreateGroup()}
                    aria-label="Confirmar criação"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#181818] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelCreate}
                    aria-label="Cancelar criação"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/10 text-[#777] transition-colors hover:border-black/20 hover:text-[#181818]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="flex items-center gap-2 rounded-[16px] border border-dashed border-black/15 px-4 py-3 text-sm font-medium text-[#666] transition-colors hover:border-black/25 hover:text-[#181818]"
                >
                  <Plus className="h-4 w-4" />
                  Criar novo grupo
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </Card>
  )
}
