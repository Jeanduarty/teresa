import { Filter, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui'
import { hasActiveFilters, parseTagInput } from './home-utils'
import type { TopicFilterActions, TopicFiltersState } from './home-types'

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia('(min-width: 640px)').matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)')
    const handleChange = () => setIsDesktop(mediaQuery.matches)

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return isDesktop
}

function StatusButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? 'border-[#181818] bg-[#181818] text-white'
          : 'border-black/10 bg-white text-[#666] hover:border-black/20 hover:text-[#181818]'
      }`}
    >
      {children}
    </button>
  )
}

function FiltersContent({
  filters,
  onChange,
  onApply,
  onClear,
}: {
  filters: TopicFiltersState
  onChange: (filters: TopicFiltersState) => void
  onApply: () => void
  onClear: () => void
}) {
  const { status, tags, title } = filters
  const active = hasActiveFilters(filters)

  return (
    <div className="space-y-4">
      <Input
        id="topic-title-filter"
        label="Titulo"
        value={title}
        onChange={(value) => onChange({ ...filters, title: value })}
        placeholder="Buscar por titulo"
      />

      <div>
        <p className="mb-2 text-sm font-semibold leading-6 text-[#666]">Status</p>
        <div className="flex flex-wrap gap-2">
          <StatusButton active={status === 'all'} onClick={() => onChange({ ...filters, status: 'all' })}>
            Todos
          </StatusButton>
          <StatusButton active={status === 'pending'} onClick={() => onChange({ ...filters, status: 'pending' })}>
            Pendentes
          </StatusButton>
          <StatusButton active={status === 'completed'} onClick={() => onChange({ ...filters, status: 'completed' })}>
            Feitos
          </StatusButton>
        </div>
      </div>

      <Input
        id="topic-tags-filter"
        label="Tags"
        value={tags}
        onChange={(value) => onChange({ ...filters, tags: value })}
        placeholder="IA, futebol, roteiro"
      />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {active ? (
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full"
            icon={<X className="h-4 w-4" />}
            onClick={onClear}
          >
            Limpar filtros
          </Button>
        ) : null}
        <Button
          size="sm"
          className="rounded-full"
          icon={<Filter className="h-4 w-4" />}
          onClick={onApply}
        >
          Filtrar
        </Button>
      </div>
    </div>
  )
}

export function FiltersButton({
  filters,
  open,
  onOpenChange,
  actions,
}: {
  filters: TopicFiltersState
  open: boolean
  onOpenChange: (open: boolean) => void
  actions: TopicFilterActions
}) {
  const active = hasActiveFilters(filters)
  const isDesktop = useIsDesktop()
  const [draftFilters, setDraftFilters] = useState<TopicFiltersState>(filters)

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setDraftFilters(filters)
    }

    onOpenChange(nextOpen)
  }

  function applyFilters() {
    actions.onApply(draftFilters)
    onOpenChange(false)
  }

  function clearDraftFilters() {
    const clearedFilters: TopicFiltersState = {
      status: 'all',
      tags: '',
      title: '',
    }

    setDraftFilters(clearedFilters)
    actions.onClear()
    onOpenChange(false)
  }

  const content = (
    <FiltersContent
      filters={draftFilters}
      onChange={setDraftFilters}
      onApply={applyFilters}
      onClear={clearDraftFilters}
    />
  )

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={active ? 'primary' : 'secondary'}
            size="sm"
            className="rounded-full my-auto"
            icon={<Filter className="h-4 w-4" />}
          >
            Filtros
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" side="left" className="w-[390px]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-heading text-base font-semibold text-[#181818]">Filtrar topicos</h3>
              <p className="mt-1 text-xs leading-5 text-[#666]">Refine a lista sem sair da pagina.</p>
            </div>
            <PopoverClose asChild>
              <Button
                variant="ghost"
                size="xs"
                className="h-8 w-8 rounded-full px-0"
                aria-label="Fechar filtros"
                icon={<X className="h-4 w-4" />}
              />
            </PopoverClose>
          </div>
          {content}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={active ? 'primary' : 'secondary'}
          size="sm"
          className="rounded-full w-fit"
          icon={<Filter className="h-4 w-4" />}
        >
          Filtros
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-none overflow-y-auto rounded-[24px]">
        <DialogHeader>
          <DialogTitle>Filtrar topicos</DialogTitle>
          <DialogDescription>Refine a lista sem sair da pagina.</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}

export function ActiveFilters({
  filters,
  actions,
}: {
  filters: TopicFiltersState
  actions: TopicFilterActions
}) {
  const { status, tags, title } = filters
  const tagList = parseTagInput(tags)

  if (!hasActiveFilters(filters)) {
    return null
  }

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {title.trim() ? (
        <FilterChip
          label={`Titulo: ${title.trim()}`}
          onRemove={() => actions.onApply({ ...filters, title: '' })}
        />
      ) : null}
      {status !== 'all' ? (
        <FilterChip
          label={`Status: ${status === 'pending' ? 'pendentes' : 'feitos'}`}
          onRemove={() => actions.onApply({ ...filters, status: 'all' })}
        />
      ) : null}
      {tagList.map((tag) => (
        <FilterChip
          key={tag}
          label={`Tag: ${tag}`}
          onRemove={() => actions.onApply({
            ...filters,
            tags: tagList.filter((item) => item !== tag).join(', '),
          })}
        />
      ))}
      <button
        type="button"
        onClick={actions.onClear}
        className="ml-1 text-xs font-semibold text-[#666] transition-colors hover:text-[#181818]"
      >
        Limpar tudo
      </button>
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#666] shadow-sm">
      <span className="max-w-[220px] truncate">{label}</span>
      <button type="button" onClick={onRemove} className="text-[#999] transition-colors hover:text-[#181818]">
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  )
}
