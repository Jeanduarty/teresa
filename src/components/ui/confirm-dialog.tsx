import { AlertTriangle, type LucideIcon } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

import { Button } from './button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog'

export type ConfirmDialogTone = 'danger' | 'warning' | 'info'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  tone?: ConfirmDialogTone
  icon?: LucideIcon
  confirmationText?: string
  isPending?: boolean
  onConfirm: () => void | Promise<void>
}

const TONE_STYLES: Record<
  ConfirmDialogTone,
  {
    iconWrap: string
    iconColor: string
    confirmVariant: 'primary' | 'danger'
  }
> = {
  danger: {
    iconWrap: 'bg-red-50 ring-1 ring-red-200',
    iconColor: 'text-red-600',
    confirmVariant: 'danger',
  },
  warning: {
    iconWrap: 'bg-amber-50 ring-1 ring-amber-200',
    iconColor: 'text-amber-600',
    confirmVariant: 'primary',
  },
  info: {
    iconWrap: 'bg-[#f4f4f2] ring-1 ring-black/10',
    iconColor: 'text-[#181818]',
    confirmVariant: 'primary',
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'danger',
  icon,
  confirmationText,
  isPending = false,
  onConfirm,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState('')
  const styles = TONE_STYLES[tone]
  const Icon = icon ?? AlertTriangle
  const requiresMatch = Boolean(confirmationText)
  const matches = !requiresMatch || typed.trim() === confirmationText

  useEffect(() => {
    if (!open) {
      setTyped('')
    }
  }, [open])

  async function handleConfirm() {
    if (!matches || isPending) {
      return
    }

    await onConfirm()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) {
          onOpenChange(next)
        }
      }}
    >
      <DialogContent showClose={!isPending}>
        <div className="flex items-start gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${styles.iconWrap}`}>
            <Icon className={`h-5 w-5 ${styles.iconColor}`} />
          </div>

          <DialogHeader className="mb-0 flex-1 pr-0">
            <DialogTitle>{title}</DialogTitle>
            {description ? (
              <DialogDescription className="mt-1">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>
        </div>

        {requiresMatch ? (
          <div className="mt-5">
            <label
              htmlFor="confirm-dialog-typing"
              className="block text-xs font-semibold leading-5 text-[#666]"
            >
              Digite <span className="font-mono text-[#181818]">{confirmationText}</span> para confirmar
            </label>
            <input
              id="confirm-dialog-typing"
              type="text"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="mt-2 w-full rounded-[12px] border border-black/10 bg-white px-3 py-2 text-sm text-[#181818] outline-none focus:border-black/30"
            />
          </div>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={styles.confirmVariant}
            disabled={!matches || isPending}
            onClick={() => {
              void handleConfirm()
            }}
          >
            {isPending ? 'Processando…' : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
