import { RotateCcw, Save, Sparkles, ToggleLeft, ToggleRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '../../../../components/ui'
import type { ContentTopic, ScriptType } from '../../../../shared/types/account-types'
import { TopicAiRefineDialog } from './topic-ai-refine-dialog'

type ScriptFieldEditorProps = {
  topic: ContentTopic
  scriptType: ScriptType
  isSaving: boolean
  isRefining: boolean
  onSave: (scriptType: ScriptType, view: 'original' | 'refined', script: string) => Promise<void>
  onRefine: (scriptType: ScriptType, userPrompt: string) => Promise<void>
}

const TITLE: Record<ScriptType, string> = {
  strategic: 'Modo estratégico',
  simplified: 'Pronto para gravar',
}

const DESCRIPTION: Record<ScriptType, string> = {
  strategic: 'Análise técnica do DNA viral, ângulo criativo e estrutura do conteúdo.',
  simplified: 'Roteiro prático com microcenas prontas para gravar.',
}

export function ScriptFieldEditor({
  topic,
  scriptType,
  isSaving,
  isRefining,
  onSave,
  onRefine,
}: ScriptFieldEditorProps) {
  const originalContent =
    scriptType === 'strategic' ? topic.strategicScript : topic.simplifiedScript
  const refinedContent =
    scriptType === 'strategic' ? topic.strategicRefined : topic.simplifiedRefined

  // State machine: 'original' | 'refined'
  // refined !== null means AI was already used
  const [view, setView] = useState<'original' | 'refined'>(() =>
    refinedContent !== null ? 'refined' : 'original',
  )
  // toggleRevealed: after clicking "undo" in the refined view, the toggle appears
  const [toggleRevealed, setToggleRevealed] = useState(false)
  const [aiDialogOpen, setAiDialogOpen] = useState(false)

  const currentContent = view === 'refined' && refinedContent !== null ? refinedContent : originalContent
  const [draft, setDraft] = useState(currentContent)
  const hasDraftChanges = useMemo(() => draft !== currentContent, [draft, currentContent])

  const isRefined = refinedContent !== null
  // AI button: disabled once refined
  const aiButtonDisabled = isRefined

  function handleViewChange(newView: 'original' | 'refined') {
    setView(newView)
    setDraft(newView === 'refined' && refinedContent !== null ? refinedContent : originalContent)
  }

  function handleUndo() {
    setToggleRevealed(true)
    handleViewChange('original')
  }

  async function handleRefine(userPrompt: string) {
    await onRefine(scriptType, userPrompt)
    // After successful refine, switch to refined view
    setView('refined')
    setDraft(refinedContent ?? draft)
    setToggleRevealed(false)
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
            {/* Toggle (appears after undo) */}
            {isRefined && toggleRevealed && (
              <button
                type="button"
                onClick={() => handleViewChange(view === 'original' ? 'refined' : 'original')}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 text-[0.82rem] font-medium text-[#444] transition-colors hover:border-black/20 hover:bg-[#f7f7f5]"
              >
                {view === 'refined' ? (
                  <ToggleRight className="h-4 w-4 text-violet-500" />
                ) : (
                  <ToggleLeft className="h-4 w-4 text-[#aaa]" />
                )}
                {view === 'refined' ? 'Ver original' : 'Ver versão IA'}
              </button>
            )}

            {/* Undo (shows in refined view before toggle is revealed) */}
            {isRefined && !toggleRevealed && view === 'refined' && (
              <Button
                variant="secondary"
                className="h-10 rounded-full px-4"
                onClick={handleUndo}
                icon={<RotateCcw className="h-4 w-4" />}
              >
                Desfazer
              </Button>
            )}

            {/* AI button */}
            <button
              type="button"
              disabled={aiButtonDisabled}
              onClick={() => !aiButtonDisabled && setAiDialogOpen(true)}
              title={aiButtonDisabled ? 'Refinamento já aplicado' : 'Refinar com IA'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#666] transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-black/10 disabled:hover:bg-white disabled:hover:text-[#666]"
            >
              <Sparkles className="h-4 w-4" />
            </button>

            {/* Save */}
            <Button
              onClick={() => void onSave(scriptType, view, draft.trim())}
              disabled={!draft.trim() || !hasDraftChanges || isSaving}
              className="h-10 rounded-full px-4"
              icon={<Save className="h-4 w-4" />}
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>

        {/* View badge */}
        {isRefined && (
          <div className="mb-3 flex items-center gap-1.5">
            <span
              className={`inline-flex h-5 items-center rounded-full px-2 text-[0.7rem] font-semibold ${
                view === 'refined'
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-[#f0f0ee] text-[#888]'
              }`}
            >
              {view === 'refined' ? 'Versão IA' : 'Original'}
            </span>
          </div>
        )}

        {/* Textarea */}
        <textarea
          key={`${topic.id}-${scriptType}-${view}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={16}
          className="min-h-[440px] w-full resize-y rounded-[18px] border border-black/10 bg-[#fbfbfa] px-5 py-4 font-body text-[0.98rem] leading-7 text-[#181818] outline-none transition-colors placeholder:text-[#8f8f8f] focus:border-black/25 focus:bg-white"
        />
      </div>

      <TopicAiRefineDialog
        open={aiDialogOpen}
        scriptType={scriptType}
        isRefining={isRefining}
        onClose={() => setAiDialogOpen(false)}
        onRefine={handleRefine}
      />
    </>
  )
}
