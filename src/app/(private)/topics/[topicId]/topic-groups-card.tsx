import { Folder, Plus } from 'lucide-react'
import { useState } from 'react'

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
  onAdd: (groupId: string) => Promise<unknown>
  onRemove: (groupId: string) => Promise<unknown>
}

export function TopicGroupsCard({
  topic,
  groups,
  isAdding,
  isRemoving,
  onAdd,
  onRemove,
}: TopicGroupsCardProps) {
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
        <Dialog open onOpenChange={setIsAddingGroup}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar a um grupo</DialogTitle>
              <DialogDescription>Escolha um ou mais grupos para este topico.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              {availableGroups.length === 0 ? (
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
