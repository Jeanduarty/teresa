import { ArrowLeft, ArrowRight, Check, Lightbulb, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui'
import { useIdeaTopic } from '../../../hooks/use-idea-topic'

type Stage = 'idea' | 'questions' | 'references' | 'generating'

type Reference = {
  url: string
  note: string
}

type AnswerMap = Record<number, string>

export function IdeaDialog({
  open,
  onOpenChange,
  userId,
  initialIdea = '',
  initialStage = 'idea',
  initialQuestions = [],
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: string
  initialIdea?: string
  initialStage?: Stage
  initialQuestions?: string[]
}) {
  const navigate = useNavigate()
  const { questionsMutation, generateMutation } = useIdeaTopic(userId)

  const [stage, setStage] = useState<Stage>(initialStage)
  const [rawIdea, setRawIdea] = useState(initialIdea)
  const [questions, setQuestions] = useState<string[]>(initialQuestions)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [references, setReferences] = useState<Reference[]>([])
  const questionTextareaRef = useRef<HTMLTextAreaElement | null>(null)

  function reset() {
    setStage('idea')
    setRawIdea(initialIdea)
    setQuestions([])
    setAnswers({})
    setCurrentQuestionIndex(0)
    setReferences([])
    questionsMutation.reset()
    generateMutation.reset()
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset()
    }
    onOpenChange(nextOpen)
  }

  async function handleGenerateQuestions() {
    const idea = rawIdea.trim()
    if (!idea) return
    try {
      const result = await questionsMutation.mutateAsync({ rawIdea: idea })
      setQuestions(result.questions)
      setAnswers({})
      setCurrentQuestionIndex(0)
      setStage('questions')
    } catch {
      // erro mostrado no banner
    }
  }

  useEffect(() => {
    if (stage === 'questions') {
      const timer = window.setTimeout(() => {
        questionTextareaRef.current?.focus()
      }, 50)
      return () => window.clearTimeout(timer)
    }
  }, [stage, currentQuestionIndex])

  function answeredCount(): number {
    return questions.filter((_, index) => answers[index]?.trim()).length
  }

  function allAnswered(): boolean {
    return questions.length > 0 && answeredCount() === questions.length
  }

  async function handleGenerateTopic() {
    setStage('generating')
    try {
      const conversation = questions
        .map((question, index) => ({
          question,
          answer: answers[index]?.trim() ?? '',
        }))
        .filter((turn) => turn.answer)

      const refs = references
        .map((ref) => ({
          url: ref.url.trim() || null,
          note: ref.note.trim() || null,
        }))
        .filter((ref) => ref.url || ref.note)

      const topic = await generateMutation.mutateAsync({
        rawIdea: rawIdea.trim(),
        conversation,
        references: refs,
      })

      handleOpenChange(false)
      navigate(`/topics/${topic.id}`)
    } catch {
      setStage('references')
    }
  }

  function addReference() {
    setReferences((prev) => [...prev, { url: '', note: '' }])
  }

  function updateReference(index: number, patch: Partial<Reference>) {
    setReferences((prev) => prev.map((ref, idx) => (idx === index ? { ...ref, ...patch } : ref)))
  }

  function removeReference(index: number) {
    setReferences((prev) => prev.filter((_, idx) => idx !== index))
  }

  const errorMessage =
    questionsMutation.error?.message ?? generateMutation.error?.message ?? null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[640px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Tenho uma ideia
          </DialogTitle>
          <DialogDescription>
            {stage === 'idea' && 'Descreva a ideia em poucas palavras. A Teresa vai te fazer algumas perguntas para amadurecer.'}
            {stage === 'questions' && 'Responda do jeito que você fala. Pode ser frase curta.'}
            {stage === 'references' && 'Opcional: adicione links de vídeos, posts ou artigos que te inspiraram.'}
            {stage === 'generating' && 'A Teresa está montando seu tópico...'}
          </DialogDescription>
        </DialogHeader>

        {errorMessage ? (
          <div className="mb-3 rounded-[12px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <AnimatePresence mode="wait">
        {stage === 'idea' && (
          <motion.div
            key="idea"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="space-y-3"
          >
            <textarea
              value={rawIdea}
              onChange={(event) => setRawIdea(event.target.value)}
              placeholder="Ex: quero fazer um vídeo sobre procrastinação usando um método que uso no trabalho"
              className="min-h-[160px] w-full rounded-[14px] border border-black/10 bg-white p-3 text-sm leading-6 outline-none focus:border-black/30"
              maxLength={2000}
            />
            <div className="flex justify-end">
              <Button
                onClick={() => { void handleGenerateQuestions() }}
                disabled={questionsMutation.isPending || !rawIdea.trim()}
                icon={questionsMutation.isPending
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Sparkles className="h-4 w-4" />}
              >
                {questionsMutation.isPending ? 'Pensando nas perguntas...' : 'Próximo'}
              </Button>
            </div>
          </motion.div>
        )}

        {stage === 'questions' && questions.length > 0 && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="space-y-4"
          >
            <QuestionProgress
              total={questions.length}
              currentIndex={currentQuestionIndex}
              answers={answers}
              onJump={(index) => setCurrentQuestionIndex(index)}
            />

            <div className="rounded-2xl border border-black/10 bg-[#fbfbfa] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#666]">
                Pergunta {currentQuestionIndex + 1} de {questions.length}
              </p>
              <p className="mt-2 text-base font-semibold leading-6 text-[#141414]">
                {questions[currentQuestionIndex]}
              </p>
              <textarea
                ref={questionTextareaRef}
                value={answers[currentQuestionIndex] ?? ''}
                onChange={(event) =>
                  setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: event.target.value }))
                }
                placeholder="Sua resposta..."
                className="mt-3 min-h-28 w-full rounded-xl border border-black/10 bg-white p-3 text-sm leading-6 outline-none focus:border-black/30"
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                    event.preventDefault()
                    if (answers[currentQuestionIndex]?.trim()) {
                      if (currentQuestionIndex < questions.length - 1) {
                        setCurrentQuestionIndex((index) => index + 1)
                      } else if (allAnswered()) {
                        setStage('references')
                      }
                    }
                  }
                }}
              />
              <p className="mt-1 text-[11px] text-[#999]">⌘/Ctrl + Enter para avançar</p>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                icon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => {
                  if (currentQuestionIndex === 0) {
                    setStage('idea')
                  } else {
                    setCurrentQuestionIndex((index) => index - 1)
                  }
                }}
              >
                {currentQuestionIndex === 0 ? 'Voltar à ideia' : 'Pergunta anterior'}
              </Button>

              {currentQuestionIndex < questions.length - 1 ? (
                <Button
                  icon={<ArrowRight className="h-4 w-4" />}
                  onClick={() => setCurrentQuestionIndex((index) => index + 1)}
                  disabled={!answers[currentQuestionIndex]?.trim()}
                >
                  Próxima pergunta
                </Button>
              ) : (
                <Button
                  icon={<Check className="h-4 w-4" />}
                  onClick={() => setStage('references')}
                  disabled={!allAnswered()}
                >
                  Concluir ({answeredCount()}/{questions.length})
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {stage === 'references' && (
          <motion.div
            key="references"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="space-y-4"
          >
            {references.length === 0 ? (
              <p className="rounded-[12px] bg-[#fbfbfa] px-3 py-3 text-xs text-[#666]">
                Você pode pular essa etapa. As referências entram no contexto e
                ajudam a Teresa a calibrar formato e estética.
              </p>
            ) : null}
            {references.map((ref, index) => (
              <div key={index} className="space-y-2 rounded-[12px] border border-black/10 bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#666]">Referência {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={<Trash2 className="h-3.5 w-3.5" />}
                    onClick={() => removeReference(index)}
                  >
                    Remover
                  </Button>
                </div>
                <input
                  value={ref.url}
                  onChange={(event) => updateReference(index, { url: event.target.value })}
                  placeholder="URL do vídeo, post ou artigo"
                  className="h-10 w-full rounded-[10px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/30"
                />
                <input
                  value={ref.note}
                  onChange={(event) => updateReference(index, { note: event.target.value })}
                  placeholder="O que aproveitar dessa referência (opcional)"
                  className="h-10 w-full rounded-[10px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/30"
                />
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              icon={<Plus className="h-3.5 w-3.5" />}
              onClick={addReference}
              disabled={references.length >= 8}
            >
              Adicionar referência
            </Button>

            <div className="flex items-center justify-between gap-2 pt-2">
              <Button variant="ghost" onClick={() => setStage('questions')}>Voltar</Button>
              <Button
                onClick={() => { void handleGenerateTopic() }}
                icon={<Sparkles className="h-4 w-4" />}
              >
                Gerar tópico
              </Button>
            </div>
          </motion.div>
        )}

        {stage === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="flex flex-col items-center gap-3 py-10 text-sm text-[#666]"
          >
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Montando seu tópico a partir da ideia...</p>
          </motion.div>
        )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

function QuestionProgress({
  total,
  currentIndex,
  answers,
  onJump,
}: {
  total: number
  currentIndex: number
  answers: AnswerMap
  onJump: (index: number) => void
}) {
  const answeredCount = Object.values(answers).filter((value) => value?.trim()).length
  const percent = total > 0 ? Math.round((answeredCount / total) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] text-[#666]">
        <span>
          {answeredCount} de {total} respondidas
        </span>
        <span>{percent}%</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, index) => {
          const isCurrent = index === currentIndex
          const isAnswered = Boolean(answers[index]?.trim())
          const baseClass = 'h-1.5 flex-1 rounded-full transition-colors'
          const stateClass = isCurrent
            ? 'bg-[#141414]'
            : isAnswered
              ? 'bg-[#1d9a52]'
              : 'bg-black/10 hover:bg-black/20'
          return (
            <button
              key={index}
              type="button"
              aria-label={`Ir para pergunta ${index + 1}`}
              onClick={() => onJump(index)}
              className={`${baseClass} ${stateClass}`}
            />
          )
        })}
      </div>
    </div>
  )
}
