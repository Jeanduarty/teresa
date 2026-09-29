import { ExternalLink, Pencil, PenLine, Save, ToggleLeft, ToggleRight, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '../../../../components/ui'
import { splitTextWithLinks } from '../../../../shared/lib/text-links'
import type { ContentTopic, ScriptType, ScriptViewMode } from '../../../../shared/types/account-types'
import { TopicRefineDialog } from './topic-refine-dialog'

type ScriptFieldEditorProps = {
  topic: ContentTopic
  scriptType: ScriptType
  isSaving: boolean
  isRefining: boolean
  onSave: (scriptType: ScriptType, view: 'original' | 'refined', script: string) => Promise<void>
  onRefine: (scriptType: ScriptType, userPrompt: string) => Promise<void>
  onUpdateViewMode: (scriptType: ScriptType, viewMode: ScriptViewMode) => Promise<void>
}

const TITLE: Record<ScriptType, string> = {
  strategic: 'Modo estratégico',
  simplified: 'Pronto para gravar',
}

const DESCRIPTION: Record<ScriptType, string> = {
  strategic: 'Análise técnica do DNA viral, ângulo criativo e estrutura do conteúdo.',
  simplified: 'Roteiro prático com microcenas prontas para gravar.',
}

function ScriptReadView({ content }: { content: string }) {
  const parts = splitTextWithLinks(content)
  return (
    <div className="min-h-[440px] w-full break-words rounded-[18px] border border-black/10 bg-[#fbfbfa] px-5 py-4 font-body text-[0.98rem] leading-7 text-[#181818] whitespace-pre-wrap">
      {parts.map((part, i) =>
        part.type === 'link' ? (
          <a
            key={i}
            href={part.value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100"
          >
            <ExternalLink className="h-3 w-3" />
            clique aqui
          </a>
        ) : (
          <span key={i}>{part.value}</span>
        )
      )}
    </div>
  )
}

export function ScriptFieldEditor({
  topic,
  scriptType,
  isSaving,
  isRefining,
  onSave,
  onRefine,
  onUpdateViewMode,
}: ScriptFieldEditorProps) {
  const originalContent =
    scriptType === 'strategic' ? topic.strategicScript : topic.simplifiedScript
  const refinedContent =
    scriptType === 'strategic' ? topic.strategicRefined : topic.simplifiedRefined
  const viewMode =
    scriptType === 'strategic' ? topic.strategicViewMode : topic.simplifiedViewMode

  const [refineDialogOpen, setRefineDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const currentContent = viewMode === 'refined' && refinedContent !== null ? refinedContent : originalContent
  const [draft, setDraft] = useState(currentContent)
  const hasDraftChanges = useMemo(() => draft !== currentContent, [draft, currentContent])

  const isRefined = refinedContent !== null
  const refineButtonDisabled = isRefined

  function handleStartEdit() {
    setDraft(currentContent)
    setIsEditing(true)
  }

  function handleCancelEdit() {
    setDraft(currentContent)
    setIsEditing(false)
  }

  async function handleSwitchChange() {
    const newMode: ScriptViewMode = viewMode === 'refined' ? 'original' : 'refined'
    await onUpdateViewMode(scriptType, newMode)
    setDraft(newMode === 'refined' && refinedContent !== null ? refinedContent : originalContent)
  }

  async function handleRefine(userPrompt: string) {
    await onRefine(scriptType, userPrompt)
  }

  async function handleSave() {
    await onSave(scriptType, viewMode, draft.trim())
    setIsEditing(false)
  }

  return (
    <>
      <div className="app-panel rounded-[24px] p-6">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold text-[#141414]">
              {TITLE[scriptType]}
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-[#666]">{DESCRIPTION[scriptType]}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Switch (only shows if refined) */}
            {isRefined && (
              <button
                type="button"
                onClick={() => void handleSwitchChange()}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 text-[0.82rem] font-medium text-[#444] transition-colors hover:border-black/20 hover:bg-[#f7f7f5]"
              >
                {viewMode === 'refined' ? (
                  <ToggleRight className="h-4 w-4 text-violet-500" />
                ) : (
                  <ToggleLeft className="h-4 w-4 text-[#aaa]" />
                )}
                {viewMode === 'refined' ? 'Versão refinada' : 'Versão original'}
              </button>
            )}

            <button
              type="button"
              disabled={refineButtonDisabled}
              onClick={() => !refineButtonDisabled && setRefineDialogOpen(true)}
              title={refineButtonDisabled ? 'Refinamento já aplicado' : 'Refinar roteiro'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#666] transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-black/10 disabled:hover:bg-white disabled:hover:text-[#666]"
            >
              <PenLine className="h-4 w-4" />
            </button>

            {/* Edit / Save / Cancel */}
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 text-[0.82rem] font-medium text-[#444] transition-colors hover:border-black/20 hover:bg-[#f7f7f5]"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancelar
                </button>
                <Button
                  onClick={() => void handleSave()}
                  disabled={!draft.trim() || !hasDraftChanges || isSaving}
                  className="h-10 rounded-full px-4"
                  icon={<Save className="h-4 w-4" />}
                >
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 text-[0.82rem] font-medium text-[#444] transition-colors hover:border-black/20 hover:bg-[#f7f7f5]"
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <textarea
            key={`${topic.id}-${scriptType}-${viewMode}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={16}
            className="min-h-[440px] w-full resize-y rounded-[18px] border border-black/10 bg-[#fbfbfa] px-5 py-4 font-body text-[0.98rem] leading-7 text-[#181818] outline-none transition-colors placeholder:text-[#8f8f8f] focus:border-black/25 focus:bg-white"
          />
        ) : (
          <ScriptReadView content={currentContent} />
        )}
      </div>

      <TopicRefineDialog
        open={refineDialogOpen}
        scriptType={scriptType}
        isRefining={isRefining}
        onClose={() => setRefineDialogOpen(false)}
        onRefine={handleRefine}
      />
    </>
  )
}
