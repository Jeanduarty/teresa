import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, Folder, Plus } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { Button } from '../../components/ui'
import { useAuthSession } from '../../hooks/use-auth'
import { useContentTopics, useTopicGroups } from '../../hooks/use-content-topics'
import { useExploreAnalyses } from '../../hooks/use-explore-analyses'
import { useUserSocialJobs } from '../../hooks/use-user-social-jobs'
import { GenerateTopicsButton } from './home/generate-topics-button'
import type {
  ContentTopicFilters,
  ContentTopicStatusFilter,
} from '../../shared/types/account-types'
import { ExploreListPanel } from './explore/_components/explore-list-panel'
import { GroupDialog } from './home/group-dialog'
import { GroupRow } from './home/group-row'
import { IdeaHero } from './home/idea-hero'
import { MarkDoneDialog } from './home/mark-done-dialog'
import { UserCard } from './home/user-card'
import type {
  GroupDialogState,
  TopicFilterActions,
  TopicFiltersState,
  TopicListActions,
  TopicListActionState,
  TopicListState,
} from './home/home-types'
import { parseTagInput } from './home/home-utils'
import { ActiveFilters, FiltersButton } from './home/topic-filters'
import { TopicList } from './home/topic-list'

type HomeView = 'topics' | 'groups' | 'analyses'

const PAGE_SIZE = 6

const HOME_TABS: Array<{ id: HomeView; label: string; href: string }> = [
  { id: 'topics', label: 'Tópicos', href: '/' },
  { id: 'groups', label: 'Grupos', href: '/groups' },
  { id: 'analyses', label: 'Análises', href: '/explore' },
]

export function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { groupId } = useParams<{ groupId?: string }>()
  const { user } = useAuthSession()
  const { accessQuery, runMutation, statusQuery, hasActiveRun } = useUserSocialJobs(user?.id)

  const isJobRunning = hasActiveRun && !statusQuery.data?.isComplete
  const isProcessing = runMutation.isPending || isJobRunning
  const canRunSocialJob = (accessQuery.data?.hasConnectedSocialAccount ?? false) && !isProcessing

  const [groupDialogState, setGroupDialogState] = useState<GroupDialogState>(null)
  const [markDoneTopicId, setMarkDoneTopicId] = useState<string | null>(null)
  const [titleFilter, setTitleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContentTopicStatusFilter>('all')
  const [tagsFilter, setTagsFilter] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const activeView: HomeView =
    location.pathname.startsWith('/explore')
      ? 'analyses'
      : location.pathname === '/groups'
        ? 'groups'
        : 'topics'

  const groupContextId = activeView === 'topics' ? groupId : undefined

  const topicFilters = useMemo<ContentTopicFilters>(
    () => {
      if (groupContextId) return { status: 'all', groupId: groupContextId }
      return {
        title: titleFilter.trim() || undefined,
        status: statusFilter,
        tags: parseTagInput(tagsFilter),
      }
    },
    [groupContextId, statusFilter, tagsFilter, titleFilter],
  )

  const {
    topicsQuery,
    addGroupMutation,
    markDoneMutation,
    markPendingMutation,
    removeGroupMutation,
  } = useContentTopics(user?.id, topicFilters)

  const {
    groupsQuery,
    createGroupMutation,
    updateGroupMutation,
    deleteGroupMutation,
  } = useTopicGroups(user?.id)

  const { analysesQuery } = useExploreAnalyses(user?.id)

  const topics = useMemo(() => topicsQuery.data ?? [], [topicsQuery.data])
  const groups = useMemo(() => groupsQuery.data ?? [], [groupsQuery.data])
  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === groupContextId) ?? null,
    [groupContextId, groups],
  )
  const visibleTopics = useMemo(() => topics.slice(0, visibleCount), [topics, visibleCount])

  const filters: TopicFiltersState = { status: statusFilter, tags: tagsFilter, title: titleFilter }
  const filterActions: TopicFilterActions = { onClear: clearFilters, onApply: applyFilters }

  const topicList: TopicListState = {
    errorMessage: topicsQuery.error?.message,
    hasMore: visibleCount < topics.length,
    isLoading: topicsQuery.isLoading,
    topics: visibleTopics,
  }

  const topicListActionState: TopicListActionState = {
    addingToGroup: addGroupMutation.variables,
    isAddingToGroup: addGroupMutation.isPending,
    isMarkingDone: markDoneMutation.isPending,
    isMarkingPending: markPendingMutation.isPending,
    isRemovingFromGroup: removeGroupMutation.isPending,
    markingDoneTopicId: markDoneMutation.variables?.topicId ?? markDoneTopicId ?? undefined,
    markingPendingTopicId: markPendingMutation.variables,
    removingFromGroup: removeGroupMutation.variables,
  }

  const topicListActions: TopicListActions = {
    onAddToGroup: (topicId, gid) => { void addGroupMutation.mutateAsync({ topicId, groupId: gid }) },
    onMarkDone: (topicId) => { setMarkDoneTopicId(topicId) },
    onMarkPending: (topicId) => { void markPendingMutation.mutateAsync(topicId) },
    onOpen: (topicId) => navigate(`/topics/${topicId}`),
    onRemoveFromGroup: (topicId, gid) => { void removeGroupMutation.mutateAsync({ topicId, groupId: gid }) },
  }

  useEffect(() => {
    function handleScroll() {
      const dist = document.documentElement.scrollHeight - window.innerHeight - window.scrollY
      if (dist < 260) setVisibleCount((c) => Math.min(c + PAGE_SIZE, topics.length))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [topics.length])

  function resetPagination() { setVisibleCount(PAGE_SIZE) }

  function clearFilters() {
    setTitleFilter('')
    setStatusFilter('all')
    setTagsFilter('')
    resetPagination()
  }

  function applyFilters(next: TopicFiltersState) {
    setTitleFilter(next.title)
    setStatusFilter(next.status)
    setTagsFilter(next.tags)
    resetPagination()
  }

  function handleTabChange(view: HomeView) {
    clearFilters()
    const tab = HOME_TABS.find((t) => t.id === view)
    if (tab) navigate(tab.href)
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 py-10 md:px-10">
      <UserCard />
      <IdeaHero />

      {/* ── Tab nav ── */}
      <nav role="tablist" aria-label="Seções" className="mb-6 flex gap-1 border-b border-black/10">
        {HOME_TABS.map((tab) => {
          const isActive = activeView === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabChange(tab.id)}
              className={[
                'font-heading relative px-4 pb-3 pt-1 text-sm font-medium transition-colors',
                isActive ? 'text-[#141414]' : 'text-[#999] hover:text-[#666]',
              ].join(' ')}
            >
              {tab.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#141414]"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Tab content ── */}
      <section role="tabpanel" aria-label={HOME_TABS.find((t) => t.id === activeView)?.label}>

        {/* Tópicos */}
        {activeView === 'topics' && (
          <div className="app-panel rounded-[18px] p-6 md:p-8">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                {groupContextId ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2 mb-3 rounded-full"
                    icon={<ChevronLeft className="h-4 w-4" />}
                    onClick={() => { navigate('/groups'); resetPagination() }}
                  >
                    Voltar aos grupos
                  </Button>
                ) : null}
                <h2 className="font-heading text-2xl font-semibold text-[#141414]">
                  {groupContextId ? (selectedGroup?.name ?? 'Grupo') : 'Tópicos'}
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#666]">
                  {groupContextId
                    ? 'Tópicos vinculados a este grupo.'
                    : 'Use os filtros para encontrar ideias por status, título ou tags.'}
                </p>
              </div>
              {!groupContextId && (
                <div className="flex items-center gap-2">
                  <GenerateTopicsButton
                    canRun={canRunSocialJob}
                    isProcessing={isProcessing}
                    isStatusError={statusQuery.isError}
                    cooldownEndsAt={accessQuery.data?.cooldownEndsAt ?? null}
                    status={statusQuery.data}
                    onRun={() => runMutation.mutate()}
                  />
                  <FiltersButton
                    filters={filters}
                    open={filtersOpen}
                    onOpenChange={setFiltersOpen}
                    actions={filterActions}
                  />
                </div>
              )}
            </div>

            {!groupContextId && <ActiveFilters filters={filters} actions={filterActions} />}

            <TopicList
              list={topicList}
              actionState={topicListActionState}
              actions={topicListActions}
              groups={groups}
            />
          </div>
        )}

        {/* Grupos */}
        {activeView === 'groups' && (
          <div className="app-panel rounded-[18px] p-6 md:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-[#141414]">Grupos</h2>
                <p className="mt-1 text-sm leading-6 text-[#666]">Organize seus tópicos em grupos temáticos.</p>
              </div>
              <Button
                size="sm"
                className="rounded-full"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => setGroupDialogState({ mode: 'create' })}
              >
                Novo grupo
              </Button>
            </div>

            {groupsQuery.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-[14px] bg-[#f4f4f2]" />
                ))}
              </div>
            ) : groups.length === 0 ? (
              <div className="rounded-[14px] border border-dashed border-black/15 bg-[#fbfbfa] px-5 py-10 text-center">
                <Folder className="mx-auto mb-3 h-8 w-8 text-[#ccc]" aria-hidden="true" />
                <p className="text-sm font-medium text-[#666]">Nenhum grupo criado ainda</p>
                <p className="mt-1 text-xs text-[#999]">Grupos ajudam a organizar seus tópicos por projeto ou tema.</p>
              </div>
            ) : (
              <ul className="space-y-1.5">
                {groups.map((group) => (
                  <GroupRow
                    key={group.id}
                    group={group}
                    onOpen={() => navigate(`/groups/${group.id}`)}
                    onEdit={() => setGroupDialogState({ mode: 'edit', group })}
                  />
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Análises */}
        {activeView === 'analyses' && (
          <div className="app-panel rounded-[18px] p-6 md:p-8">
            <ExploreListPanel
              analyses={analysesQuery.data ?? []}
              isLoading={analysesQuery.isLoading}
              errorMessage={analysesQuery.error?.message}
            />
          </div>
        )}
      </section>

      <GroupDialog
        key={groupDialogState?.mode === 'edit' ? groupDialogState.group.id : (groupDialogState?.mode ?? 'closed')}
        state={groupDialogState}
        isSaving={createGroupMutation.isPending || updateGroupMutation.isPending}
        isDeleting={deleteGroupMutation.isPending}
        onClose={() => setGroupDialogState(null)}
        onCreate={(name) => createGroupMutation.mutateAsync(name)}
        onUpdate={(gid, name) => updateGroupMutation.mutateAsync({ groupId: gid, name })}
        onDelete={(gid) => {
          if (groupContextId === gid) navigate('/groups')
          return deleteGroupMutation.mutateAsync(gid)
        }}
      />

      <MarkDoneDialog
        open={markDoneTopicId !== null}
        isPending={markDoneMutation.isPending}
        onOpenChange={(open) => { if (!open) setMarkDoneTopicId(null) }}
        onConfirm={(publishedUrl) => {
          if (!markDoneTopicId) return
          void markDoneMutation
            .mutateAsync({ topicId: markDoneTopicId, publishedUrl, publishedAt: new Date().toISOString() })
            .then(() => setMarkDoneTopicId(null))
        }}
      />
    </main>
  )
}
