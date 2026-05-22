import type { ContentTopic, ScriptType, ScriptView } from '../../../../shared/types/account-types'
import { ScriptFieldEditor } from './script-field-editor'

type TopicScriptEditorProps = {
  topic: ContentTopic
  isSavingStrategic: boolean
  isSavingSimplified: boolean
  isRefiningStrategic: boolean
  isRefiningSimplified: boolean
  onSave: (scriptType: ScriptType, view: ScriptView, script: string) => Promise<void>
  onRefine: (scriptType: ScriptType, userPrompt: string) => Promise<void>
}

export function TopicScriptEditor({
  topic,
  isSavingStrategic,
  isSavingSimplified,
  isRefiningStrategic,
  isRefiningSimplified,
  onSave,
  onRefine,
}: TopicScriptEditorProps) {
  return (
    <div className="space-y-6">
      <ScriptFieldEditor
        key={`${topic.id}-strategic`}
        topic={topic}
        scriptType="strategic"
        isSaving={isSavingStrategic}
        isRefining={isRefiningStrategic}
        onSave={onSave}
        onRefine={onRefine}
      />
      <ScriptFieldEditor
        key={`${topic.id}-simplified`}
        topic={topic}
        scriptType="simplified"
        isSaving={isSavingSimplified}
        isRefining={isRefiningSimplified}
        onSave={onSave}
        onRefine={onRefine}
      />
    </div>
  )
}
