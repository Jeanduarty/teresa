import { useState, type FormEvent } from 'react'
import { ChevronLeft, Link2, Plus, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button, Input } from '../../../../components/ui'
import { useAuthSession } from '../../../../hooks/use-auth'
import { useExploreAnalyses } from '../../../../hooks/use-explore-analyses'

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

export function ExploreNewAnalysisPage() {
  const navigate = useNavigate()
  const { user } = useAuthSession()
  const { createMutation } = useExploreAnalyses(user?.id)

  const [name, setName] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [urls, setUrls] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const canSubmit = name.trim().length > 0 && urls.length > 0

  function handleAddUrl() {
    const normalized = normalizeUrl(urlInput)

    if (!normalized) {
      setErrorMessage('Cole um link válido.')
      return
    }

    if (urls.includes(normalized)) {
      setErrorMessage('Esse link já foi adicionado.')
      return
    }

    if (urls.length >= MAX_URLS) {
      setErrorMessage(`Máximo de ${MAX_URLS} links por análise.`)
      return
    }

    setUrls((current) => [...current, normalized])
    setUrlInput('')
    setErrorMessage(null)
  }

  function handleRemoveUrl(url: string) {
    setUrls((current) => current.filter((entry) => entry !== url))
  }

  function handleClearAll() {
    setUrls([])
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!canSubmit || createMutation.isPending) {
      return
    }

    try {
      const analysis = await createMutation.mutateAsync({
        name: name.trim(),
        urls,
      })

      navigate(`/explore/${analysis.id}`)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Falha ao criar análise. Tente novamente.',
      )
    }
  }

  return (
    <main className="mx-auto w-full max-w-[860px] px-6 py-10 md:px-10">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 mb-4 rounded-full"
        icon={<ChevronLeft className="h-4 w-4" />}
        onClick={() => navigate('/explore')}
      >
        Voltar para explorar
      </Button>

      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-[#141414]">
          Criar uma análise
        </h1>
        <p className="mt-2 max-w-[640px] text-sm leading-6 text-[#666]">
          Adicione links de conteúdos do seu nicho ou concorrentes. A Teresa
          analisa cada um e identifica padrões, posicionamentos e oportunidades
          de diferenciação.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-[22px] border border-black/10 bg-white p-6">
          <Input
            id="analysis-name"
            label="Nome da análise"
            placeholder="Ex: Lançamentos SaaS que estão bombando"
            value={name}
            onChange={setName}
            maxLength={80}
          />
        </section>

        <section className="rounded-[22px] border border-black/10 bg-white p-6">
          <div className="mb-4 flex items-end gap-3">
            <div className="flex-1">
              <label
                htmlFor="analysis-url"
                className="font-body block text-sm font-semibold leading-6 text-[#666]"
              >
                Adicionar link
              </label>
              <p className="mt-1 text-xs text-[#888]">
                Suportamos: YouTube, LinkedIn, Twitter/X, Instagram, TikTok,
                blogs, sites, anúncios e muito mais.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                id="analysis-url"
                placeholder="Cole aqui o link do conteúdo"
                value={urlInput}
                onChange={(value) => {
                  setUrlInput(value)
                  if (errorMessage) {
                    setErrorMessage(null)
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    handleAddUrl()
                  }
                }}
              />
            </div>
            <Button
              type="button"
              className="shrink-0 rounded-full"
              icon={<Plus className="h-4 w-4" />}
              onClick={handleAddUrl}
              disabled={urls.length >= MAX_URLS}
            >
              Adicionar
            </Button>
          </div>

          {errorMessage ? (
            <p className="mt-3 rounded-[12px] bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {errorMessage}
            </p>
          ) : null}
        </section>

        <section className="rounded-[22px] border border-black/10 bg-white p-6">
          <header className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-heading text-base font-semibold text-[#141414]">
              Links adicionados ({urls.length})
            </h2>
            {urls.length > 0 ? (
              <Button
                type="button"
                size="xs"
                variant="ghost"
                className="rounded-full text-red-600 hover:bg-red-50"
                icon={<Trash2 className="h-3.5 w-3.5" />}
                onClick={handleClearAll}
              >
                Limpar todos
              </Button>
            ) : null}
          </header>

          {urls.length === 0 ? (
            <p className="rounded-[14px] border border-dashed border-black/10 bg-[#fbfbfa] px-4 py-8 text-center text-sm text-[#888]">
              Nenhum link adicionado. Cole pelo menos um link para iniciar a
              análise.
            </p>
          ) : (
            <ul className="space-y-2">
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
          )}
        </section>

        <footer className="flex items-center justify-between gap-3 border-t border-black/10 pt-6">
          <p className="text-xs font-medium text-[#777]">
            {urls.length} link{urls.length === 1 ? '' : 's'} adicionado
            {urls.length === 1 ? '' : 's'}
          </p>
          <Button
            type="submit"
            disabled={!canSubmit || createMutation.isPending}
            className="rounded-full"
          >
            {createMutation.isPending ? 'Iniciando análise…' : 'Finalizar e analisar'}
          </Button>
        </footer>
      </form>
    </main>
  )
}
