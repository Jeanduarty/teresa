import { Save } from 'lucide-react'
import { useState } from 'react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from '../../../../components/ui'

export type EditFieldState = { field: 'title' | 'summary'; value: string } | null

type TopicEditFieldDialogProps = {
  state: EditFieldState
  isSaving: boolean
  onClose: () => void
  onSave: (value: string) => Promise<unknown>
}

export function TopicEditFieldDialog({
  state,
  isSaving,
  onClose,
  onSave,
}: TopicEditFieldDialogProps) {
  const [value, setValue] = useState(state?.value ?? '')

  if (!state) {
    return null
  }

  const isSummary = state.field === 'summary'

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
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
              className="min-h-[180px] w-full resize-y rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm font-medium leading-6 text-[#181818] outline-none transition-colors placeholder:text-[#a0a0a0] focus:border-black/20"
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
