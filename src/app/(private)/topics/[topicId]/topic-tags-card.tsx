import { Pencil, Plus, Save, Tag, Trash2 } from 'lucide-react'
import { useState } from 'react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Card,
} from '../../../../components/ui'
import { TopicTagBadge } from './topic-tag-badge'

type TopicTagsCardProps = {
  tags: string[]
  isSaving: boolean
  onSave: (tags: string[]) => Promise<unknown>
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
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar tag</DialogTitle>
          <DialogDescription>Crie uma nova tag para este topico.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            id="new-tag"
            label="Tag"
            value={tag}
            onChange={setTag}
            placeholder="Ex: futebol"
          />

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
              {isSaving ? 'Adicionando...' : 'Adicionar'}
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
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-[620px]">
        <DialogHeader>
          <DialogTitle>Editar tags</DialogTitle>
          <DialogDescription>Ajuste ou remova as tags do topico.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {draftTags.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-black/10 bg-[#fbfbfa] px-4 py-8 text-center">
              <Tag className="mx-auto h-5 w-5 text-[#8a8a8a]" />
              <p className="mt-3 text-sm leading-6 text-[#666]">Nenhuma tag adicionada.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {draftTags.map((tag, index) => (
                <div
                  key={`${tag}-${index}`}
                  className="flex items-center gap-3 rounded-[18px] border border-black/10 bg-[#fbfbfa] p-3"
                >
                  <div className="min-w-0 flex-1">
                    <Input
                      id={`tag-${index}`}
                      value={tag}
                      onChange={(value) => updateTag(index, value)}
                    />
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    className="h-12 shrink-0 rounded-[16px] px-4"
                    aria-label="Remover tag"
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={() => removeTag(index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          )}

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

export function TopicTagsCard({
  tags,
  isSaving,
  onSave,
}: TopicTagsCardProps) {
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
          <TopicTagBadge key={tag} tag={tag} />
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
