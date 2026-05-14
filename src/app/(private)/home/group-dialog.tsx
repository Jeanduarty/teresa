import { useState } from 'react'
import { Check, Trash2 } from 'lucide-react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from '../../../components/ui'
import type { GroupDialogState } from './home-types'

export function GroupDialog({
  state,
  isSaving,
  isDeleting,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: {
  state: GroupDialogState
  isSaving: boolean
  isDeleting: boolean
  onClose: () => void
  onCreate: (name: string) => Promise<unknown>
  onUpdate: (groupId: string, name: string) => Promise<unknown>
  onDelete: (groupId: string) => Promise<unknown>
}) {
  const [name, setName] = useState(state?.mode === 'edit' ? state.group.name : '')

  if (!state) {
    return null
  }

  const isEditing = state.mode === 'edit'

  async function handleSave() {
    const normalizedName = name.trim()

    if (!normalizedName || !state) {
      return
    }

    if (state.mode === 'edit') {
      await onUpdate(state.group.id, normalizedName)
    } else {
      await onCreate(normalizedName)
    }

    onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => {
      if (!open) {
        onClose()
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar grupo' : 'Novo grupo'}</DialogTitle>
          <DialogDescription>
            Use grupos para organizar topicos por projeto, cliente ou linha editorial.
          </DialogDescription>
        </DialogHeader>
      <div className="space-y-4">
        <Input
          id="group-dialog-name"
          label="Nome"
          value={name}
          onChange={setName}
          placeholder="Ex: Ideias para Reels"
        />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {isEditing ? (
            <Button
              variant="danger"
              disabled={isDeleting}
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => {
                if (window.confirm('Apagar este grupo? Os topicos continuarao existindo.')) {
                  void onDelete(state.group.id).then(onClose)
                }
              }}
            >
              {isDeleting ? 'Apagando...' : 'Apagar'}
            </Button>
          ) : null}
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={!name.trim() || isSaving}
            icon={<Check className="h-4 w-4" />}
            onClick={() => {
              void handleSave()
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
