import { Loader2, Search, X } from 'lucide-react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { useAuthSession } from '../../../hooks/use-auth'
import { useContentTopics } from '../../../hooks/use-content-topics'
import type { ContentTopic } from '../../../shared/types/account-types'

const SEARCH_PAGE_SIZE = 8

function statusLabel(status: ContentTopic['status']): string {
  if (status === 'completed') return 'Publicado'
  if (status === 'deleted') return 'Apagado'
  return 'Pendente'
}

function statusClass(status: ContentTopic['status']): string {
  if (status === 'completed') return 'bg-[#edf7f1] text-[#1d9a52]'
  if (status === 'deleted') return 'bg-red-50 text-red-700'
  return 'bg-amber-50 text-amber-700'
}

export function TopicSearch() {
  const listboxId = useId()
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const { user } = useAuthSession()

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [visibleCount, setVisibleCount] = useState(SEARCH_PAGE_SIZE)

  const trimmedSearch = searchTerm.trim()

  // Fetch all topics without title filter — filtering is done client-side
  // so the search is always case-insensitive regardless of backend behavior
  const { topicsQuery } = useContentTopics(user?.id, undefined)

  const filteredTopics = useMemo(() => {
    if (!trimmedSearch) return []
    const lower = trimmedSearch.toLowerCase()
    return (topicsQuery.data ?? []).filter((t) =>
      t.title.toLowerCase().includes(lower),
    )
  }, [topicsQuery.data, trimmedSearch])

  const visibleTopics = filteredTopics.slice(0, visibleCount)
  const hasMore = visibleCount < filteredTopics.length
  const isLoading = topicsQuery.isLoading && !!trimmedSearch
  const showEmpty = !!trimmedSearch && !isLoading && filteredTopics.length === 0

  // Reset pagination + active index whenever search changes
  useEffect(() => {
    setVisibleCount(SEARCH_PAGE_SIZE)
    setActiveIndex(-1)
  }, [trimmedSearch])

  const handleClose = useCallback(() => {
    // Focus BEFORE unmounting portal — prevents browser scroll jump on ESC
    triggerRef.current?.focus({ preventScroll: true })
    setIsOpen(false)
    setSearchTerm('')
    setActiveIndex(-1)
    setVisibleCount(SEARCH_PAGE_SIZE)
  }, [])

  function handleSelect(topicId: string) {
    handleClose()
    navigate(`/topics/${topicId}`)
  }

  function handleResultsScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80 && hasMore) {
      setVisibleCount((c) => c + SEARCH_PAGE_SIZE)
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.min(activeIndex + 1, visibleTopics.length - 1)
      setActiveIndex(next)
      scrollActiveIntoView(next)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = Math.max(activeIndex - 1, -1)
      setActiveIndex(prev)
      scrollActiveIntoView(prev)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const topic = visibleTopics[activeIndex]
      if (topic) handleSelect(topic.id)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      handleClose()
    }
  }

  function scrollActiveIntoView(index: number) {
    if (!listRef.current) return
    const item = listRef.current.querySelector(`[data-index="${index}"]`)
    item?.scrollIntoView({ block: 'nearest' })
  }

  // Focus input when portal opens
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  const activeOptionId =
    activeIndex >= 0 && visibleTopics[activeIndex]
      ? `${listboxId}-option-${visibleTopics[activeIndex].id}`
      : undefined

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Buscar tópicos"
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-full items-center gap-2.5 rounded-full border border-black/10 bg-white px-4 text-left text-sm text-[#999] shadow-sm transition-colors hover:border-black/20 hover:text-[#666]"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 text-sm">Buscar tópicos...</span>
      </button>

      {/* Portal overlay */}
      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Pesquisar tópicos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[90] bg-black/25 backdrop-blur-[2px]"
              onMouseDown={handleClose}
            >
              <div
                className="absolute left-1/2 top-[18vh] w-[min(600px,calc(100vw-32px))] -translate-x-1/2"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  type="button"
                  aria-label="Fechar pesquisa"
                  onClick={handleClose}
                  className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>

                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_24px_80px_-24px_rgba(0,0,0,0.45)]"
                >
                  {/* Search input row */}
                  <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3.5">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#999]" aria-hidden="true" />
                    ) : (
                      <Search className="h-4 w-4 shrink-0 text-[#999]" aria-hidden="true" />
                    )}
                    <input
                      ref={inputRef}
                      type="text"
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={visibleTopics.length > 0}
                      aria-controls={listboxId}
                      aria-activedescendant={activeOptionId}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleInputKeyDown}
                      placeholder="Buscar tópicos..."
                      autoComplete="off"
                      spellCheck={false}
                      className="flex-1 bg-transparent text-sm text-[#141414] outline-none placeholder:text-[#999]"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        aria-label="Limpar busca"
                        onClick={() => {
                          setSearchTerm('')
                          inputRef.current?.focus()
                        }}
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e6e6e6] text-[#666] hover:bg-[#d4d4d4]"
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  {/* Results */}
                  <div
                    ref={listRef}
                    id={listboxId}
                    role="listbox"
                    aria-label="Resultados da busca"
                    onScroll={handleResultsScroll}
                    className="max-h-[400px] overflow-y-auto"
                  >
                    {showEmpty && (
                      <div className="px-4 py-8 text-center text-sm text-[#999]">
                        Nenhum tópico encontrado para &ldquo;{trimmedSearch}&rdquo;
                      </div>
                    )}

                    {!trimmedSearch && (
                      <div className="px-4 py-6 text-center text-sm text-[#999]">
                        Digite para buscar seus tópicos
                      </div>
                    )}

                    {visibleTopics.length > 0 && (
                      <ul className="py-2">
                        {visibleTopics.map((topic, index) => {
                          const isActive = index === activeIndex
                          return (
                            <li key={topic.id}>
                              <button
                                type="button"
                                id={`${listboxId}-option-${topic.id}`}
                                role="option"
                                aria-selected={isActive}
                                data-index={index}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => handleSelect(topic.id)}
                                className={[
                                  'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                                  isActive ? 'bg-[#f4f4f2]' : 'hover:bg-[#f9f9f9]',
                                ].join(' ')}
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="font-heading truncate text-sm font-semibold text-[#141414]">
                                    {topic.title}
                                  </p>
                                  {topic.summary && (
                                    <p className="mt-0.5 line-clamp-1 text-xs text-[#999]">
                                      {topic.summary}
                                    </p>
                                  )}
                                </div>
                                <span
                                  className={[
                                    'mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
                                    statusClass(topic.status),
                                  ].join(' ')}
                                >
                                  {statusLabel(topic.status)}
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}

                    {hasMore && (
                      <div className="border-t border-black/5 px-4 py-2 text-center text-xs text-[#999]">
                        Role para ver mais resultados
                      </div>
                    )}
                  </div>

                  {/* Footer hint */}
                  <div className="flex items-center gap-4 border-t border-black/5 px-4 py-2 text-[10px] text-[#bbb]">
                    <span><kbd className="font-mono">↑↓</kbd> navegar</span>
                    <span><kbd className="font-mono">↵</kbd> abrir</span>
                    <span><kbd className="font-mono">Esc</kbd> fechar</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}
