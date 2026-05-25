import { useState } from 'react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from '../../../components/ui'

interface MarkDoneDialogProps {
  open: boolean
  isPending: boolean
  onConfirm: (publishedUrl: string) => void
  onOpenChange: (open: boolean) => void
}

export function MarkDoneDialog({ open, isPending, onConfirm, onOpenChange }: MarkDoneDialogProps) {
  const [url, setUrl] = useState('')

  const trimmed = url.trim()

  function handleConfirm() {
    if (!trimmed) return
    onConfirm(trimmed)
  }

  function handleOpenChange(next: boolean) {
    if (!next) setUrl('')
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-120">
        <DialogHeader>
          <DialogTitle>Onde você postou?</DialogTitle>
          <DialogDescription>
            Cole o link do post para a Teresa acompanhar o resultado e aprender com o que funciona.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <Input
            id="published-url"
            type="url"
            value={url}
            onChange={setUrl}
            placeholder="https://www.tiktok.com/@usuario/video/..."
            shape="rounded"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConfirm()
            }}
            autoFocus
          />

          <div className="flex justify-end">
            <Button onClick={handleConfirm} disabled={isPending || !trimmed}>
              {isPending ? 'Salvando...' : 'Confirmar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
