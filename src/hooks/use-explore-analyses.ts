import { useMutation, useQuery } from '@tanstack/react-query'

import { mockAnalysisSummaries, mockCompletedAnalysis } from '../mocks/explore-fixtures'
import { exploreService } from '../services/explore-service'
import { queryClient } from '../shared/lib/query-client'
import type {
  CreateExploreAnalysisInput,
  ExploreAnalysis,
  ExploreAnalysisSummary,
  UpdateExploreAnalysisInput,
} from '../shared/types/account-types'

const ACTIVE_POLL_INTERVAL_MS = 4000

function useMocks(): boolean {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  return params.get('useMocks') === 'true'
}

function exploreListKey(userId: string | undefined) {
  return ['explore-analyses', userId, 'list'] as const
}

function exploreDetailKey(
  userId: string | undefined,
  exploreAnalysisId: string | undefined,
) {
  return ['explore-analyses', userId, 'detail', exploreAnalysisId] as const
}

function updateSummaryInListCache(
  userId: string | undefined,
  updated: ExploreAnalysisSummary,
) {
  queryClient.setQueryData<ExploreAnalysisSummary[]>(
    exploreListKey(userId),
    (current = []) => {
      const exists = current.some((analysis) => analysis.id === updated.id)

      if (!exists) {
        return [updated, ...current]
      }

      return current.map((analysis) =>
        analysis.id === updated.id ? { ...analysis, ...updated } : analysis,
      )
    },
  )
}

function syncDetailCache(
  userId: string | undefined,
  analysis: ExploreAnalysis,
) {
  queryClient.setQueryData<ExploreAnalysis>(
    exploreDetailKey(userId, analysis.id),
    analysis,
  )
  updateSummaryInListCache(userId, analysis)
}

export function useExploreAnalyses(userId?: string) {
  const shouldUseMocks = useMocks()

  const analysesQuery = useQuery<ExploreAnalysisSummary[], Error>({
    queryKey: exploreListKey(userId),
    queryFn: () => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      if (shouldUseMocks) {
        return Promise.resolve(mockAnalysisSummaries)
      }

      return exploreService.listAnalyses()
    },
    enabled: Boolean(userId),
    refetchInterval: (query) => {
      const analyses = query.state.data ?? []
      const hasActive = analyses.some(
        (analysis) =>
          analysis.status === 'pending' || analysis.status === 'analyzing',
      )

      return hasActive ? ACTIVE_POLL_INTERVAL_MS : false
    },
  })

  const createMutation = useMutation<
    ExploreAnalysis,
    Error,
    CreateExploreAnalysisInput
  >({
    mutationFn: (input) => exploreService.createAnalysis(input),
    onSuccess: (analysis) => {
      syncDetailCache(userId, analysis)
      void queryClient.invalidateQueries({ queryKey: exploreListKey(userId) })
    },
  })

  const updateMutation = useMutation<
    ExploreAnalysisSummary,
    Error,
    UpdateExploreAnalysisInput
  >({
    mutationFn: (input) => exploreService.updateAnalysis(input),
    onSuccess: (analysis) => {
      updateSummaryInListCache(userId, analysis)
      queryClient.setQueryData<ExploreAnalysis>(
        exploreDetailKey(userId, analysis.id),
        (current) =>
          current ? { ...current, name: analysis.name, updatedAt: analysis.updatedAt } : current,
      )
    },
  })

  const deleteMutation = useMutation<{ exploreAnalysisId: string }, Error, string>({
    mutationFn: (exploreAnalysisId) =>
      exploreService.deleteAnalysis(exploreAnalysisId),
    onSuccess: ({ exploreAnalysisId }) => {
      queryClient.setQueryData<ExploreAnalysisSummary[]>(
        exploreListKey(userId),
        (current = []) =>
          current.filter((analysis) => analysis.id !== exploreAnalysisId),
      )
      queryClient.removeQueries({
        queryKey: exploreDetailKey(userId, exploreAnalysisId),
      })
    },
  })

  return {
    analysesQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  }
}

export function useExploreAnalysis({
  userId,
  exploreAnalysisId,
}: {
  userId?: string
  exploreAnalysisId?: string
}) {
  const shouldUseMocks = useMocks()

  const analysisQuery = useQuery<ExploreAnalysis, Error>({
    queryKey: exploreDetailKey(userId, exploreAnalysisId),
    queryFn: () => {
      if (!userId || !exploreAnalysisId) {
        throw new Error('ID do usuário e ID da análise são obrigatórios')
      }

      if (shouldUseMocks) {
        return Promise.resolve(mockCompletedAnalysis)
      }

      return exploreService.getAnalysis(exploreAnalysisId)
    },
    enabled: Boolean(userId && exploreAnalysisId),
    refetchInterval: (query) => {
      const data = query.state.data

      if (!data) {
        return false
      }

      const hasActive =
        data.status === 'pending' ||
        data.status === 'analyzing' ||
        data.contents.some(
          (content) =>
            content.status === 'pending' ||
            content.status === 'fetching' ||
            content.status === 'analyzing',
        )

      return hasActive ? ACTIVE_POLL_INTERVAL_MS : false
    },
  })

  const runMutation = useMutation<ExploreAnalysis, Error, void>({
    mutationFn: () => {
      if (!exploreAnalysisId) {
        throw new Error('ID da análise é obrigatório')
      }

      return exploreService.runAnalysis(exploreAnalysisId)
    },
    onSuccess: (analysis) => {
      syncDetailCache(userId, analysis)
    },
  })

  const addLinksMutation = useMutation<ExploreAnalysis, Error, string[]>({
    mutationFn: (urls) => {
      if (!exploreAnalysisId) {
        throw new Error('ID da análise é obrigatório')
      }

      return exploreService.addLinks({ exploreAnalysisId, urls })
    },
    onSuccess: (analysis) => {
      syncDetailCache(userId, analysis)
    },
  })

  return {
    analysisQuery,
    runMutation,
    addLinksMutation,
  }
}
