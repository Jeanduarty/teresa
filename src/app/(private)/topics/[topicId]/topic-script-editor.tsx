import type { ContentTopic, ScriptType, ScriptView, ScriptViewMode } from '../../../../shared/types/account-types'
import { ScriptFieldEditor } from './script-field-editor'

type TopicScriptEditorProps = {
  topic: ContentTopic
  isSavingStrategic: boolean
  isSavingSimplified: boolean
  isRefiningStrategic: boolean
  isRefiningSimplified: boolean
  onSave: (scriptType: ScriptType, view: ScriptView, script: string) => Promise<void>
  onRefine: (scriptType: ScriptType, userPrompt: string) => Promise<void>
  onUpdateViewMode: (scriptType: ScriptType, viewMode: ScriptViewMode) => Promise<void>
}

export function TopicScriptEditor({
  topic,
  isSavingStrategic,
  isSavingSimplified,
  isRefiningStrategic,
  isRefiningSimplified,
  onSave,
  onRefine,
  onUpdateViewMode,
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
        onUpdateViewMode={onUpdateViewMode}
      />
      <ScriptFieldEditor
        key={`${topic.id}-simplified`}
        topic={topic}
        scriptType="simplified"
        isSaving={isSavingSimplified}
        isRefining={isRefiningSimplified}
        onSave={onSave}
        onRefine={onRefine}
        onUpdateViewMode={onUpdateViewMode}
      />
    </div>
  )
}
