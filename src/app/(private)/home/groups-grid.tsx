import { Folder, Pencil, Plus } from 'lucide-react'

import { Button } from '../../../components/ui'
import type { ContentTopicGroup } from '../../../shared/types/account-types'

export function GroupsGrid({
  groups,
  isLoading,
  onCreate,
  onEdit,
  onSelect,
}: {
  groups: ContentTopicGroup[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (group: ContentTopicGroup) => void
  onSelect: (group: ContentTopicGroup) => void
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-[#141414]">Grupos</h2>
          <p className="mt-1 text-sm leading-6 text-[#666]">
            Organize os tópicos em coleções reutilizáveis.
          </p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="rounded-full"
          icon={<Plus className="h-4 w-4" />}
          onClick={onCreate}
        >
          Novo grupo
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-[150px] animate-pulse rounded-[22px] bg-[#f0f0ee]" />
          ))}
        </div>
      ) : null}

      {!isLoading && groups.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-black/15 bg-[#fbfbfa] px-6 py-12 text-center">
          <Folder className="mx-auto h-8 w-8 text-[#777]" />
          <h3 className="mt-4 font-heading text-xl font-semibold text-[#181818]">Nenhum grupo ainda</h3>
          <p className="mx-auto mt-2 max-w-[420px] text-sm leading-6 text-[#666]">
            Crie o primeiro grupo para separar topicos por tema ou projeto.
          </p>
          <Button className="mt-5 rounded-full" icon={<Plus className="h-4 w-4" />} onClick={onCreate}>
            Criar grupo
          </Button>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <article
            key={group.id}
            className="group relative cursor-pointer rounded-[22px] border border-black/10 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_48px_-34px_rgba(0,0,0,0.55)]"
            onClick={() => onSelect(group)}
          >
            <Button
              variant="ghost"
              size="xs"
              className="absolute right-3 top-3 h-8 w-8 rounded-full px-0 opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Editar grupo"
              icon={<Pencil className="h-4 w-4" />}
              onClick={(event) => {
                event.stopPropagation()
                onEdit(group)
              }}
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#181818] text-white">
              <Folder className="h-5 w-5" />
            </div>
            <h3 className="mt-5 truncate font-heading text-xl font-semibold text-[#181818]">
              {group.name}
            </h3>
            <p className="mt-2 text-sm font-medium text-[#666]">
              {group.topicsCount} topico{group.topicsCount === 1 ? '' : 's'}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
