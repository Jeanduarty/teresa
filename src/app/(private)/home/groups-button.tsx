import { Folder, Pencil, Plus, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

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
import type { ContentTopicGroup } from '../../../shared/types/account-types'

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

function GroupsContent({
  groups,
  isLoading,
  selectedGroupId,
  onCreate,
  onEdit,
  onSelect,
}: {
  groups: ContentTopicGroup[]
  isLoading: boolean
  selectedGroupId?: string
  onCreate: () => void
  onEdit: (group: ContentTopicGroup) => void
  onSelect: (group: ContentTopicGroup | null) => void
}) {
  const [search, setSearch] = useState('')

  const filteredGroups = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) {
      return groups
    }

    return groups.filter((group) => group.name.toLowerCase().includes(term))
  }, [groups, search])

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`Buscar entre ${groups.length} grupo${groups.length === 1 ? '' : 's'}`}
          className="w-full rounded-full border border-black/10 bg-white px-9 py-2 text-sm text-[#181818] outline-none placeholder:text-[#999] focus:border-black/30"
        />
      </div>

      <Button
        size="sm"
        variant="secondary"
        className="w-full justify-center rounded-full"
        icon={<Plus className="h-4 w-4" />}
        onClick={onCreate}
      >
        Novo grupo
      </Button>

      <div className="max-h-[280px] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-12 animate-pulse rounded-[14px] bg-[#f0f0ee]" />
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <p className="rounded-[14px] border border-dashed border-black/10 bg-[#fbfbfa] px-3 py-6 text-center text-xs text-[#888]">
            {groups.length === 0
              ? 'Nenhum grupo criado ainda.'
              : 'Nenhum grupo encontrado.'}
          </p>
        ) : (
          <ul className="space-y-1.5">
            <li>
              <button
                type="button"
                onClick={() => onSelect(null)}
                className={`flex w-full items-center gap-3 rounded-[14px] border px-3 py-2 text-left transition-colors ${
                  !selectedGroupId
                    ? 'border-[#181818] bg-[#181818] text-white'
                    : 'border-transparent bg-transparent text-[#181818] hover:bg-[#f4f4f2]'
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    !selectedGroupId ? 'bg-white/15 text-white' : 'bg-[#181818] text-white'
                  }`}
                >
                  <Folder className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">Todos os tópicos</p>
                  <p
                    className={`mt-0.5 truncate text-[11px] font-medium ${
                      !selectedGroupId ? 'text-white/70' : 'text-[#888]'
                    }`}
                  >
                    Sem filtro de grupo
                  </p>
                </div>
              </button>
            </li>
            {filteredGroups.map((group) => {
              const isActive = group.id === selectedGroupId

              return (
                <li key={group.id}>
                  <div
                    className={`group flex items-center gap-3 rounded-[14px] border px-3 py-2 transition-colors ${
                      isActive
                        ? 'border-[#181818] bg-[#181818] text-white'
                        : 'border-transparent bg-transparent text-[#181818] hover:bg-[#f4f4f2]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(group)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isActive ? 'bg-white/15 text-white' : 'bg-[#181818] text-white'
                        }`}
                      >
                        <Folder className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{group.name}</p>
                        <p
                          className={`mt-0.5 truncate text-[11px] font-medium ${
                            isActive ? 'text-white/70' : 'text-[#888]'
                          }`}
                        >
                          {group.topicsCount} tópico{group.topicsCount === 1 ? '' : 's'}
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        onEdit(group)
                      }}
                      aria-label={`Editar ${group.name}`}
                      className={`shrink-0 rounded-full p-1.5 opacity-0 transition-opacity group-hover:opacity-100 ${
                        isActive ? 'text-white hover:bg-white/15' : 'text-[#888] hover:bg-black/5 hover:text-[#181818]'
                      }`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export function GroupsButton({
  groups,
  isLoading,
  open,
  onOpenChange,
  selectedGroupId,
  onCreate,
  onEdit,
  onSelect,
}: {
  groups: ContentTopicGroup[]
  isLoading: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedGroupId?: string
  onCreate: () => void
  onEdit: (group: ContentTopicGroup) => void
  onSelect: (group: ContentTopicGroup | null) => void
}) {
  const isDesktop = useIsDesktop()
  const hasSelection = Boolean(selectedGroupId)

  function handleCreate() {
    onCreate()
    onOpenChange(false)
  }

  function handleEdit(group: ContentTopicGroup) {
    onEdit(group)
    onOpenChange(false)
  }

  function handleSelect(group: ContentTopicGroup | null) {
    onSelect(group)
    onOpenChange(false)
  }

  const content = (
    <GroupsContent
      groups={groups}
      isLoading={isLoading}
      selectedGroupId={selectedGroupId}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onSelect={handleSelect}
    />
  )

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={hasSelection ? 'primary' : 'secondary'}
            size="sm"
            className="rounded-full my-auto"
            icon={<Folder className="h-4 w-4" />}
          >
            Grupos
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" side="left" className="w-[390px]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-heading text-base font-semibold text-[#181818]">Grupos</h3>
              <p className="mt-1 text-xs leading-5 text-[#666]">
                Selecione um grupo para filtrar os tópicos.
              </p>
            </div>
            <PopoverClose asChild>
              <Button
                variant="ghost"
                size="xs"
                className="h-8 w-8 rounded-full px-0"
                aria-label="Fechar grupos"
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={hasSelection ? 'primary' : 'secondary'}
          size="sm"
          className="rounded-full w-fit"
          icon={<Folder className="h-4 w-4" />}
        >
          Grupos
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-none overflow-y-auto rounded-[24px]">
        <DialogHeader>
          <DialogTitle>Grupos</DialogTitle>
          <DialogDescription>
            Selecione um grupo para filtrar os tópicos.
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
