import { useState } from 'react'
import { Link2, Plus, X } from 'lucide-react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from '../../../../components/ui'

const MAX_URLS = 25

function normalizeUrl(rawValue: string): string | null {
  const trimmed = rawValue.trim()

  if (!trimmed) {
    return null
  }

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    const parsed = new URL(withScheme)

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null
    }

    return parsed.toString()
  } catch {
    return null
  }
}

function deriveHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

interface AddLinksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentCount: number
  isPending: boolean
  onConfirm: (urls: string[]) => void
}

export function AddLinksDialog({
  open,
  onOpenChange,
  currentCount,
  isPending,
  onConfirm,
}: AddLinksDialogProps) {
  const [urlInput, setUrlInput] = useState('')
  const [urls, setUrls] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const remaining = MAX_URLS - currentCount
  const canAdd = urls.length < remaining

  function handleAddUrl() {
    const normalized = normalizeUrl(urlInput)

    if (!normalized) {
      setErrorMessage('Cole um link válido (http ou https).')
      return
    }

    if (urls.includes(normalized)) {
      setErrorMessage('Esse link já foi adicionado.')
      return
    }

    if (!canAdd) {
      setErrorMessage(`Limite atingido. Esta análise suporta no máximo ${MAX_URLS} links.`)
      return
    }

    setUrls((current) => [...current, normalized])
    setUrlInput('')
    setErrorMessage(null)
  }

  function handleRemoveUrl(url: string) {
    setUrls((current) => current.filter((entry) => entry !== url))
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setUrlInput('')
      setUrls([])
      setErrorMessage(null)
    }

    onOpenChange(nextOpen)
  }

  function handleConfirm() {
    if (urls.length === 0 || isPending) return
    onConfirm(urls)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showClose>
        <DialogHeader>
          <DialogTitle>Adicionar mais links</DialogTitle>
          <DialogDescription>
            {remaining > 0
              ? `Você pode adicionar até ${remaining} link${remaining === 1 ? '' : 's'} nesta análise.`
              : `Esta análise já atingiu o limite de ${MAX_URLS} links.`}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                id="add-links-url"
                placeholder="Cole aqui o link do conteúdo"
                value={urlInput}
                onChange={(value) => {
                  setUrlInput(value)
                  if (errorMessage) setErrorMessage(null)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    handleAddUrl()
                  }
                }}
                disabled={!canAdd}
              />
            </div>
            <Button
              type="button"
              className="shrink-0 rounded-full"
              icon={<Plus className="h-4 w-4" />}
              onClick={handleAddUrl}
              disabled={!canAdd}
            >
              Adicionar
            </Button>
          </div>

          {errorMessage ? (
            <p className="rounded-[12px] bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {errorMessage}
            </p>
          ) : null}

          {urls.length > 0 ? (
            <ul className="max-h-[240px] space-y-2 overflow-y-auto">
              {urls.map((url) => (
                <li
                  key={url}
                  className="flex items-center gap-3 rounded-[14px] border border-black/10 bg-[#fbfbfa] px-3 py-2"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#181818] text-white">
                    <Link2 className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#181818]">
                      {deriveHost(url)}
                    </p>
                    <p className="truncate text-xs text-[#888]">{url}</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full p-1.5 text-[#888] transition-colors hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleRemoveUrl(url)}
                    aria-label={`Remover ${url}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-[14px] border border-dashed border-black/10 bg-[#fbfbfa] px-4 py-6 text-center text-sm text-[#888]">
              Nenhum link adicionado ainda.
            </p>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-black/10 pt-4">
            <p className="text-xs font-medium text-[#777]">
              {urls.length} link{urls.length === 1 ? '' : 's'} para adicionar
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="rounded-full"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                className="rounded-full"
                disabled={urls.length === 0 || isPending}
                onClick={handleConfirm}
              >
                {isPending ? 'Adicionando…' : `Adicionar ${urls.length > 0 ? urls.length : ''} link${urls.length === 1 ? '' : 's'}`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
