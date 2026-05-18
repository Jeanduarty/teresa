import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import {
  Button,
  ButtonLink,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui'
import { useAuthSession } from '../../hooks/use-auth'
import { useAvatarUpload } from '../../hooks/use-avatar-upload'
import { useContentTopics, useTopicGroups } from '../../hooks/use-content-topics'
import { useExploreAnalyses } from '../../hooks/use-explore-analyses'
import { useSocialAccounts } from '../../hooks/use-social-accounts'
import { useUserAvatar } from '../../hooks/use-user-avatar'
import { UserAvatar } from '../../components/user-avatar'
import type {
  ContentTopicFilters,
  ContentTopicStatusFilter,
} from '../../shared/types/account-types'
import { ExploreListPanel } from './explore/_components/explore-list-panel'
import { GroupDialog } from './home/group-dialog'
import { GroupsButton } from './home/groups-button'
import { HOME_TABS, type HomeTab } from './home/home-tabs'
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

const PAGE_SIZE = 6

export function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { groupId } = useParams<{ groupId?: string }>()
  const { user } = useAuthSession()
  const avatarQuery = useUserAvatar(user)
  const { uploadMutation: uploadAvatarMutation } = useAvatarUpload()
  const [groupDialogState, setGroupDialogState] = useState<GroupDialogState>(null)
  const [titleFilter, setTitleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContentTopicStatusFilter>('all')
  const [tagsFilter, setTagsFilter] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [groupsOpen, setGroupsOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const activeTab: HomeTab = location.pathname.startsWith('/explore')
    ? 'explore'
    : 'creator'
  const groupContextId = activeTab === 'creator' ? groupId : undefined

  const topicFilters = useMemo<ContentTopicFilters>(
    () => {
      if (groupContextId) {
        return {
          status: 'all',
          groupId: groupContextId,
        }
      }

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
  const { accountsQuery } = useSocialAccounts(user?.id)
  const { analysesQuery } = useExploreAnalyses(user?.id)

  const topics = useMemo(() => topicsQuery.data ?? [], [topicsQuery.data])
  const groups = useMemo(() => groupsQuery.data ?? [], [groupsQuery.data])
  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === groupContextId) ?? null,
    [groupContextId, groups],
  )
  const visibleTopics = useMemo(() => topics.slice(0, visibleCount), [topics, visibleCount])
  const hasMoreTopics = visibleCount < topics.length
  const filters: TopicFiltersState = {
    status: statusFilter,
    tags: tagsFilter,
    title: titleFilter,
  }
  const filterActions: TopicFilterActions = {
    onClear: clearFilters,
    onApply: applyFilters,
  }
  const topicList: TopicListState = {
    errorMessage: topicsQuery.error?.message,
    hasMore: hasMoreTopics,
    isLoading: topicsQuery.isLoading,
    topics: visibleTopics,
  }
  const topicListActionState: TopicListActionState = {
    addingToGroup: addGroupMutation.variables,
    isAddingToGroup: addGroupMutation.isPending,
    isMarkingDone: markDoneMutation.isPending,
    isMarkingPending: markPendingMutation.isPending,
    isRemovingFromGroup: removeGroupMutation.isPending,
    markingDoneTopicId: markDoneMutation.variables,
    markingPendingTopicId: markPendingMutation.variables,
    removingFromGroup: removeGroupMutation.variables,
  }
  const topicListActions: TopicListActions = {
    onAddToGroup: (topicId, groupId) => {
      void addGroupMutation.mutateAsync({ topicId, groupId })
    },
    onMarkDone: (topicId) => {
      void markDoneMutation.mutateAsync(topicId)
    },
    onMarkPending: (topicId) => {
      void markPendingMutation.mutateAsync(topicId)
    },
    onOpen: (topicId) => navigate(`/topics/${topicId}`),
    onRemoveFromGroup: (topicId, groupId) => {
      void removeGroupMutation.mutateAsync({ topicId, groupId })
    },
  }
  const connectedAccountsCount = accountsQuery.data?.filter((account) => account.isConnected).length ?? 0
  const shouldShowSocialShortcut =
    activeTab === 'creator' &&
    !accountsQuery.isLoading &&
    !accountsQuery.error &&
    connectedAccountsCount === 0
  const socialAccountsLabel = accountsQuery.isLoading
    ? 'Verificando redes'
    : connectedAccountsCount === 1
      ? '1 rede conectada'
      : `${connectedAccountsCount} redes conectadas`
  const socialAccountsStatusClassName =
    !accountsQuery.isLoading && connectedAccountsCount === 0
      ? 'border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:text-red-800'
      : 'border-black/10 bg-white text-[#666] hover:border-black/20 hover:text-[#141414]'
  const socialAccountsDotClassName =
    !accountsQuery.isLoading && connectedAccountsCount === 0 ? 'bg-red-500' : 'bg-[#1d9a52]'

  useEffect(() => {
    function handleScroll() {
      const distanceToBottom =
        document.documentElement.scrollHeight - window.innerHeight - window.scrollY

      if (distanceToBottom < 260) {
        setVisibleCount((current) => Math.min(current + PAGE_SIZE, topics.length))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [topics.length])

  function resetPagination() {
    setVisibleCount(PAGE_SIZE)
  }

  function clearFilters() {
    setTitleFilter('')
    setStatusFilter('all')
    setTagsFilter('')
    resetPagination()
  }

  function applyFilters(nextFilters: TopicFiltersState) {
    setTitleFilter(nextFilters.title)
    setStatusFilter(nextFilters.status)
    setTagsFilter(nextFilters.tags)
    resetPagination()
  }

  function handleTabChange(value: string) {
    const nextTab = value as HomeTab
    const definition = HOME_TABS.find((tab) => tab.value === nextTab)

    if (!definition) {
      return
    }

    clearFilters()
    navigate(definition.path)
  }

  const creatorContent = (
    <>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {groupContextId ? (
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 mb-3 rounded-full"
              icon={<ChevronLeft className="h-4 w-4" />}
              onClick={() => {
                navigate('/')
                resetPagination()
              }}
            >
              Voltar
            </Button>
          ) : null}
          <h2 className="font-heading text-2xl font-semibold text-[#141414]">
            {groupContextId ? (selectedGroup?.name ?? 'Grupo') : 'Tópicos'}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#666]">
            {groupContextId
              ? 'Tópicos vinculados a este grupo.'
              : 'Use os filtros para encontrar ideias por status, titulo ou tags.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <GroupsButton
            groups={groups}
            isLoading={groupsQuery.isLoading}
            open={groupsOpen}
            onOpenChange={setGroupsOpen}
            selectedGroupId={groupContextId}
            onCreate={() => setGroupDialogState({ mode: 'create' })}
            onEdit={(group) => setGroupDialogState({ mode: 'edit', group })}
            onSelect={(group) => {
              if (group) {
                navigate(`/groups/${group.id}`)
              } else {
                navigate('/')
              }
              resetPagination()
            }}
          />

          {!groupContextId ? (
            <FiltersButton
              filters={filters}
              open={filtersOpen}
              onOpenChange={setFiltersOpen}
              actions={filterActions}
            />
          ) : null}
        </div>
      </div>

      {!groupContextId ? (
        <ActiveFilters
          filters={filters}
          actions={filterActions}
        />
      ) : null}

      <TopicList
        list={topicList}
        actionState={topicListActionState}
        actions={topicListActions}
        groups={groups}
      />
    </>
  )

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 py-12 md:px-10">
      <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-6">
          <UserAvatar
            editable
            disabled={uploadAvatarMutation.isPending}
            avatarUrl={avatarQuery.avatarUrl}
            name={user?.realName?.trim() || user?.userName || 'Criador'}
            className="h-24 w-24"
            iconClassName="h-12 w-12"
            onChange={(file) => {
              uploadAvatarMutation.reset()
              void uploadAvatarMutation.mutateAsync(file)
            }}
          />

          <div className="min-w-0">
            <h1 className="font-heading mb-1 text-3xl font-bold text-[#141414]">
              {user?.realName?.trim() || 'Criador'}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-lg text-[#666]">@{user?.userName ?? 'usuario'}</p>
              <Link
                to="/settings/social"
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${socialAccountsStatusClassName}`}
              >
                <span className={`h-2 w-2 rounded-full ${socialAccountsDotClassName}`} />
                {socialAccountsLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="mb-8 flex justify-center">
          <TabsList aria-label="Visualizacao da home">
            {HOME_TABS.map((tab) => {
              const Icon = tab.icon

              return (
                <TabsTrigger key={tab.value} value={tab.value} aria-label={tab.ariaLabel}>
                  <Icon className="h-5 w-5" />
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        <section className="app-panel rounded-[18px] p-6 md:p-8">
          {shouldShowSocialShortcut ? (
            <div className="mb-6 flex flex-col gap-4 rounded-[18px] border border-dashed border-black/15 bg-[#fbfbfa] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-lg font-semibold text-[#181818]">
                  Vincule uma rede social
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#666]">
                  Conecte Twitter/X ou TikTok para começar a gerar tópicos automaticamente.
                </p>
              </div>

              <ButtonLink to="/settings/social" className="shrink-0 rounded-full">
                Configurar redes
              </ButtonLink>
            </div>
          ) : null}

          <TabsContent value="creator" className="mt-0">
            {creatorContent}
          </TabsContent>

          <TabsContent value="explore" className="mt-0">
            <ExploreListPanel
              analyses={analysesQuery.data ?? []}
              isLoading={analysesQuery.isLoading}
              errorMessage={analysesQuery.error?.message}
            />
          </TabsContent>
        </section>
      </Tabs>

      <GroupDialog
        key={groupDialogState?.mode === 'edit' ? groupDialogState.group.id : (groupDialogState?.mode ?? 'closed')}
        state={groupDialogState}
        isSaving={createGroupMutation.isPending || updateGroupMutation.isPending}
        isDeleting={deleteGroupMutation.isPending}
        onClose={() => setGroupDialogState(null)}
        onCreate={(name) => createGroupMutation.mutateAsync(name)}
        onUpdate={(groupId, name) => updateGroupMutation.mutateAsync({ groupId, name })}
        onDelete={(groupId) => {
          if (groupContextId === groupId) {
            navigate('/')
          }

          return deleteGroupMutation.mutateAsync(groupId)
        }}
      />
    </main>
  )
}
