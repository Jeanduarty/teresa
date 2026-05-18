import { useState } from 'react'
import {
  ChevronLeft,
  Layers,
  Lightbulb,
  Loader2,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  Button,
  ConfirmDialog,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../components/ui'
import { useAuthSession } from '../../../../hooks/use-auth'
import {
  useExploreAnalyses,
  useExploreAnalysis,
} from '../../../../hooks/use-explore-analyses'
import { AnalysisContents } from '../_components/analysis-contents'
import { AnalysisOpportunitiesAndTrends } from '../_components/analysis-opportunities-trends'
import { AnalysisOverview } from '../_components/analysis-overview'
import {
  formatDate,
  getAnalysisStatusClassName,
  getAnalysisStatusLabel,
  getProgressPercent,
} from '../_components/explore-utils'

type DetailTab = 'overview' | 'contents' | 'opportunities-trends'

export function ExploreAnalysisPage() {
  const navigate = useNavigate()
  const { exploreAnalysisId } = useParams<{ exploreAnalysisId: string }>()
  const { user } = useAuthSession()
  const { analysisQuery, runMutation } = useExploreAnalysis({
    userId: user?.id,
    exploreAnalysisId,
  })
  const { deleteMutation } = useExploreAnalyses(user?.id)
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  if (analysisQuery.isLoading) {
    return (
      <main className="mx-auto w-full max-w-[1100px] px-6 py-10 md:px-10">
        <div className="h-12 w-40 animate-pulse rounded-full bg-[#f0f0ee]" />
        <div className="mt-6 h-24 animate-pulse rounded-[18px] bg-[#f0f0ee]" />
        <div className="mt-6 h-64 animate-pulse rounded-[18px] bg-[#f0f0ee]" />
      </main>
    )
  }

  if (analysisQuery.isError || !analysisQuery.data) {
    return (
      <main className="mx-auto w-full max-w-[1100px] px-6 py-10 md:px-10">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-4 rounded-full"
          icon={<ChevronLeft className="h-4 w-4" />}
          onClick={() => navigate('/explore')}
        >
          Voltar para explorar
        </Button>
        <div className="rounded-[18px] border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-700">
          {analysisQuery.error?.message ?? 'Análise não encontrada.'}
        </div>
      </main>
    )
  }

  const analysis = analysisQuery.data
  const progress = getProgressPercent(
    analysis.analyzedCount,
    analysis.linksCount,
  )
  const isActive = analysis.status === 'analyzing' || analysis.status === 'pending'
  const hasFailures = analysis.failedCount > 0 || analysis.status === 'failed'

  async function handleDelete() {
    if (!exploreAnalysisId) return

    try {
      await deleteMutation.mutateAsync(exploreAnalysisId)
      setConfirmDeleteOpen(false)
      navigate('/explore')
    } catch (error) {
      console.error('[explore] delete failed', error)
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-10 md:px-10">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 mb-4 rounded-full"
        icon={<ChevronLeft className="h-4 w-4" />}
        onClick={() => navigate('/explore')}
      >
        Voltar para explorar
      </Button>

      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-3xl font-bold text-[#141414]">
            {analysis.name}
          </h1>
          <p className="mt-1 text-sm text-[#666]">
            {analysis.linksCount} link{analysis.linksCount === 1 ? '' : 's'} ·
            {analysis.analyzedAt
              ? ` Analisado em ${formatDate(analysis.analyzedAt)}`
              : ` Criado em ${formatDate(analysis.createdAt)}`}
          </p>
          {isActive ? (
            <div className="mt-4 flex items-center gap-3">
              <div className="h-1.5 w-40 overflow-hidden rounded-full bg-[#f0f0ee]">
                <div
                  className="h-full rounded-full bg-[#181818] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-[#666]">
                {analysis.analyzedCount}/{analysis.linksCount} conteúdos
              </span>
            </div>
          ) : null}
          {analysis.lastError ? (
            <p className="mt-3 rounded-[10px] bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {analysis.lastError}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${getAnalysisStatusClassName(
              analysis.status,
            )}`}
          >
            {isActive ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                {getAnalysisStatusLabel(analysis.status)}
              </span>
            ) : (
              getAnalysisStatusLabel(analysis.status)
            )}
          </span>

          {hasFailures || analysis.status === 'failed' ? (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              icon={<RefreshCw className="h-3.5 w-3.5" />}
              disabled={runMutation.isPending}
              onClick={() => {
                void runMutation.mutate()
              }}
            >
              {runMutation.isPending ? 'Reanalisando…' : 'Reanalisar'}
            </Button>
          ) : null}

          <Button
            size="sm"
            variant="ghost"
            className="rounded-full text-red-600 hover:bg-red-50"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => setConfirmDeleteOpen(true)}
            disabled={deleteMutation.isPending}
            aria-label="Apagar análise"
          />
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DetailTab)}>
        <TabsList
          aria-label="Visualização da análise"
          className="mb-6 flex w-full gap-1 p-1 sm:inline-flex sm:w-auto"
        >
          <TabsTrigger
            value="overview"
            className="h-10 w-auto flex-1 gap-2 px-3 text-sm font-medium sm:flex-none sm:px-5"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Visão geral</span>
            <span className="sm:hidden">Geral</span>
          </TabsTrigger>
          <TabsTrigger
            value="contents"
            aria-label={`Conteúdos (${analysis.contents.length})`}
            className="h-10 w-auto flex-1 gap-2 px-3 text-sm font-medium sm:flex-none sm:px-5"
          >
            <Layers className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">
              Conteúdos ({analysis.contents.length})
            </span>
            <span className="sm:hidden">Conteúdos</span>
          </TabsTrigger>
          <TabsTrigger
            value="opportunities-trends"
            className="h-10 w-auto flex-1 gap-2 px-3 text-sm font-medium sm:flex-none sm:px-5"
          >
            <Lightbulb className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Oportunidades e tendências</span>
            <span className="sm:hidden">Insights</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <AnalysisOverview analysis={analysis} />
        </TabsContent>

        <TabsContent value="contents" className="mt-0">
          <AnalysisContents
            analysisId={analysis.id}
            contents={analysis.contents}
          />
        </TabsContent>

        <TabsContent value="opportunities-trends" className="mt-0">
          <AnalysisOpportunitiesAndTrends insights={analysis.insights} />
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Apagar essa análise?"
        description="Os conteúdos analisados e insights gerados serão removidos permanentemente. Esta ação não pode ser desfeita."
        confirmLabel="Apagar análise"
        tone="danger"
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </main>
  )
}
