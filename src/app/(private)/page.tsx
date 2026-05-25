import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, AtSign, ChevronLeft, Lightbulb, Music2, Sparkles } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import {
  Button,
  ButtonLink,
  Card,
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
import { useUserSocialJobs } from '../../hooks/use-user-social-jobs'
import { UserAvatar } from '../../components/user-avatar'
import type {
  ContentTopicFilters,
  ContentTopicStatusFilter,
} from '../../shared/types/account-types'
import { ExploreListPanel } from './explore/_components/explore-list-panel'
import { GroupDialog } from './home/group-dialog'
import { GenerateTopicsButton } from './home/generate-topics-button'
import { GroupsButton } from './home/groups-button'
import { IdeaDialog } from './home/idea-dialog'
import { MarkDoneDialog } from './home/mark-done-dialog'
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
  const [ideaDialogOpen, setIdeaDialogOpen] = useState(false)
  const [markDoneTopicId, setMarkDoneTopicId] = useState<string | null>(null)
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
  const { accessQuery, runMutation, statusQuery, hasActiveRun } = useUserSocialJobs(user?.id)
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
    markingDoneTopicId: markDoneMutation.variables?.topicId ?? markDoneTopicId ?? undefined,
    markingPendingTopicId: markPendingMutation.variables,
    removingFromGroup: removeGroupMutation.variables,
  }
  const topicListActions: TopicListActions = {
    onAddToGroup: (topicId, groupId) => {
      void addGroupMutation.mutateAsync({ topicId, groupId })
    },
    onMarkDone: (topicId) => {
      setMarkDoneTopicId(topicId)
    },
    onMarkPending: (topicId) => {
      void markPendingMutation.mutateAsync(topicId)
    },
    onOpen: (topicId) => navigate(`/topics/${topicId}`),
    onRemoveFromGroup: (topicId, groupId) => {
      void removeGroupMutation.mutateAsync({ topicId, groupId })
    },
  }
  const isJobRunning = hasActiveRun && !statusQuery.data?.isComplete
  const isProcessing = runMutation.isPending || isJobRunning
  const canRunSocialJob =
    (accessQuery.data?.hasConnectedSocialAccount ?? false) &&
    !isProcessing
  const connectedSocialAccounts = useMemo(
    () => (accountsQuery.data ?? []).filter(account => {
      if (account.provider === 'idea') return false
      if (account.provider === 'tiktok') return account.webSessionStatus === 'active'
      return account.isConnected
    }),
    [accountsQuery.data],
  )
  const connectedAccountsCount = connectedSocialAccounts.length
  const shouldShowSocialShortcut =
    activeTab === 'creator' &&
    !accountsQuery.isLoading &&
    !accountsQuery.error &&
    connectedAccountsCount === 0

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
              : 'Use os filtros para encontrar ideias por status, título ou tags.'}
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
              {accountsQuery.isLoading ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#999]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#ccc]" />
                  Verificando redes
                </span>
              ) : connectedSocialAccounts.length === 0 ? (
                <Link
                  to="/settings/social"
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:border-red-300 hover:text-red-800"
                >
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  0 redes conectadas
                </Link>
              ) : (
                connectedSocialAccounts.map(account => {
                  const Icon = account.provider === 'tiktok' ? Music2 : AtSign
                  const label = account.provider === 'tiktok' ? 'TikTok' : 'X'
                  return (
                    <Link
                      key={account.provider}
                      to="/settings/social"
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#666] transition-colors hover:border-black/20 hover:text-[#141414]"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#1d9a52]" />
                      <Icon className="h-3 w-3" />
                      {label} conectado
                    </Link>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {activeTab === 'creator' ? (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="rounded-[20px] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
              <Lightbulb className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-[#181818]">Tenho uma ideia</h3>
            <p className="mt-2 text-sm leading-6 text-[#666]">
              Conte para a Teresa sua ideia inicial e receba perguntas estratégicas para transformá-la em um tópico poderoso.
            </p>
            <div className="mt-5">
              <Button
                size='sm'
                icon={<ArrowRight className="h-4 w-4" />}
                onClick={() => setIdeaDialogOpen(true)}
              >
                Começar agora
              </Button>
            </div>
          </Card>

          <Card className="rounded-[20px] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf7f1]">
              <Sparkles className="h-6 w-6 text-[#1d9a52]" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-[#181818]">Gerar tópicos</h3>
            <p className="mt-2 text-sm leading-6 text-[#666]">
              Conecte suas redes e deixa a Teresa analisar o que você consome para sugerir os melhores tópicos.
            </p>
            <div className="mt-5">
              <GenerateTopicsButton
                canRun={canRunSocialJob}
                isProcessing={isProcessing}
                isStatusError={statusQuery.isError}
                cooldownEndsAt={accessQuery.data?.cooldownEndsAt ?? null}
                status={statusQuery.data}
                onRun={() => runMutation.mutate()}
              />
            </div>
          </Card>
        </div>
      ) : null}

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

      <IdeaDialog
        open={ideaDialogOpen}
        onOpenChange={setIdeaDialogOpen}
        userId={user?.id}
      />

      <MarkDoneDialog
        open={markDoneTopicId !== null}
        isPending={markDoneMutation.isPending}
        onOpenChange={(open) => { if (!open) setMarkDoneTopicId(null) }}
        onConfirm={(publishedUrl) => {
          if (!markDoneTopicId) return
          void markDoneMutation.mutateAsync(
            { topicId: markDoneTopicId, publishedUrl, publishedAt: new Date().toISOString() },
          ).then(() => setMarkDoneTopicId(null))
        }}
      />
    </main>
  )
}
