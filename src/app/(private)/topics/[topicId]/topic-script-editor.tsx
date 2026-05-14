import { RotateCcw, Save } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '../../../../components/ui'
import type { ContentTopic } from '../../../../shared/types/account-types'

type TopicScriptEditorProps = {
  topic: ContentTopic
  isSaving: boolean
  isResetting: boolean
  onSave: (script: string) => Promise<void>
  onReset: () => Promise<void>
}

export function TopicScriptEditor({
  topic,
  isSaving,
  isResetting,
  onSave,
  onReset,
}: TopicScriptEditorProps) {
  const [draftScript, setDraftScript] = useState(topic.currentScript)
  const hasDraftChanges = useMemo(
    () => draftScript !== topic.currentScript,
    [draftScript, topic.currentScript],
  )

  return (
    <div className="app-panel rounded-[24px] p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-[#141414]">
            Previa e sugestao
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#666]">
            Ajuste a ideia antes de transformar em roteiro, post ou outro formato.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {topic.editedAt ? (
            <Button
              onClick={onReset}
              disabled={isResetting}
              variant="secondary"
              className="h-10 rounded-full px-4"
              icon={<RotateCcw className="h-4 w-4" />}
            >
              {isResetting ? 'Restaurando...' : 'Ver original'}
            </Button>
          ) : null}

          <Button
            onClick={() => onSave(draftScript.trim())}
            disabled={!draftScript.trim() || !hasDraftChanges || isSaving}
            className="h-10 rounded-full px-4"
            icon={<Save className="h-4 w-4" />}
          >
            {isSaving ? 'Salvando...' : 'Salvar sugestao'}
          </Button>
        </div>
      </div>

      <textarea
        value={draftScript}
        onChange={(event) => setDraftScript(event.target.value)}
        rows={18}
        className="min-h-[520px] w-full resize-y rounded-[18px] border border-black/10 bg-[#fbfbfa] px-5 py-4 font-body text-[0.98rem] leading-7 text-[#181818] outline-none transition-colors placeholder:text-[#8f8f8f] focus:border-black/25 focus:bg-white"
      />
    </div>
  )
}
