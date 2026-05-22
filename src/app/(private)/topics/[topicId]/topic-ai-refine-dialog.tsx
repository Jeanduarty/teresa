import { Sparkles } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../../../../components/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog'
import type { ScriptType } from '../../../../shared/types/account-types'

type TopicAiRefineDialogProps = {
  open: boolean
  scriptType: ScriptType
  isRefining: boolean
  onClose: () => void
  onRefine: (userPrompt: string) => Promise<void>
}

const LABEL: Record<ScriptType, string> = {
  strategic: 'modo estratégico',
  simplified: 'modo pronto para gravar',
}

export function TopicAiRefineDialog({
  open,
  scriptType,
  isRefining,
  onClose,
  onRefine,
}: TopicAiRefineDialogProps) {
  const [prompt, setPrompt] = useState('')

  async function handleSubmit() {
    if (!prompt.trim() || isRefining) return
    await onRefine(prompt.trim())
    setPrompt('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            Refinar com IA
          </DialogTitle>
          <DialogDescription>
            Diga à IA o que você quer mudar no {LABEL[scriptType]}. Ela vai aplicar sua instrução
            e devolver o texto atualizado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[0.82rem] font-medium text-[#444]">
              Sua instrução
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                scriptType === 'strategic'
                  ? 'Ex: deixa o ângulo mais provocativo e remove o tom corporativo'
                  : 'Ex: torna as falas mais naturais, como se fosse conversa entre amigos'
              }
              rows={4}
              disabled={isRefining}
              className="w-full resize-none rounded-[14px] border border-black/10 bg-[#fbfbfa] px-4 py-3 text-sm leading-6 text-[#181818] outline-none transition-colors placeholder:text-[#aaa] focus:border-black/25 focus:bg-white disabled:opacity-50"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              className="h-10 rounded-full px-4"
              onClick={onClose}
              disabled={isRefining}
            >
              Cancelar
            </Button>
            <Button
              className="h-10 rounded-full px-4"
              onClick={handleSubmit}
              disabled={!prompt.trim() || isRefining}
              icon={<Sparkles className="h-4 w-4" />}
            >
              {isRefining ? 'Refinando...' : 'Aplicar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
