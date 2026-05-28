import { ArrowRight, Lightbulb, Loader2, Sparkles, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

import { useIdeaDialogContext } from '../../../contexts/idea-dialog-context'
import { useAuthSession } from '../../../hooks/use-auth'
import { useIdeaTopic } from '../../../hooks/use-idea-topic'

function HeroDecorations() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 hidden h-[140px] w-[210px] lg:block">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-2 top-0 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#ede9fe] shadow-sm"
      >
        <Sparkles className="h-6 w-6 text-[#7c3aed]" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute right-0 top-4 flex h-12 w-12 items-center justify-center rounded-[16px] bg-amber-100 shadow-sm"
      >
        <Lightbulb className="h-5 w-5 text-amber-600" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute left-14 top-[68px] flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#ecfdf5] shadow-sm"
      >
        <TrendingUp className="h-4 w-4 text-[#1d9a52]" />
      </motion.div>

      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.8, repeat: Infinity }}
        className="absolute right-16 top-1 h-2 w-2 rounded-full bg-[#c4b5fd]"
      />
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity, delay: 0.6 }}
        className="absolute left-0 top-[90px] h-1.5 w-1.5 rounded-full bg-amber-300"
      />
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 3.2, repeat: Infinity, delay: 1.2 }}
        className="absolute right-4 top-[100px] h-2 w-2 rounded-full bg-[#a7f3d0]"
      />
    </div>
  )
}

export function IdeaHero() {
  const { user } = useAuthSession()
  const { openIdeaDialogAtQuestions } = useIdeaDialogContext()
  const { questionsMutation } = useIdeaTopic(user?.id)
  const [ideaInput, setIdeaInput] = useState('')

  async function handleSubmit() {
    const idea = ideaInput.trim()
    if (!idea || questionsMutation.isPending) return
    try {
      const result = await questionsMutation.mutateAsync({ rawIdea: idea })
      setIdeaInput('')
      openIdeaDialogAtQuestions(idea, result.questions)
    } catch {
      // error shown via questionsMutation.error?.message
    }
  }

  return (
    <div className="mb-10">
      <div className="relative">
        <h2 className="font-heading text-2xl font-bold text-[#141414] sm:text-3xl">
          O que você vai criar hoje?
        </h2>
        <p className="mt-2 max-w-[520px] text-sm leading-6 text-[#999]">
          Sua ideia, sua voz. Escreva seu insight e deixe a Teresa extrair o potencial máximo da sua mente.
        </p>
        <HeroDecorations />
      </div>

      <div className="mt-6">
        <div className="relative rounded-[18px] border border-black/10 bg-white shadow-sm focus-within:border-black/20">
          <textarea
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void handleSubmit()
              }
            }}
            placeholder="Conta uma ideia — pode ser qualquer coisa."
            rows={3}
            aria-label="Descreva sua ideia"
            disabled={questionsMutation.isPending}
            className="w-full resize-none rounded-[18px] bg-transparent px-5 py-4 pr-16 text-sm leading-6 text-[#141414] outline-none placeholder:text-[#bbb] disabled:opacity-60"
          />
          <button
            type="button"
            aria-label="Gerar tópico a partir da ideia"
            disabled={!ideaInput.trim() || questionsMutation.isPending}
            onClick={() => { void handleSubmit() }}
            className="absolute bottom-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#141414] text-white transition-colors hover:bg-[#242424] disabled:bg-[#e6e6e6] disabled:text-[#bbb]"
          >
            {questionsMutation.isPending
              ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>

        {questionsMutation.error?.message && (
          <p role="alert" className="mt-2 text-xs text-red-600">
            {questionsMutation.error.message}
          </p>
        )}

        <p className="mt-2 text-[11px] text-[#bbb]">Enter para enviar · Shift+Enter para nova linha</p>
      </div>
    </div>
  )
}
