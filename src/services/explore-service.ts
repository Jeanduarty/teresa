import { apiRequest } from '../shared/lib/api-client'
import type {
  AddExploreAnalysisLinksInput,
  CreateExploreAnalysisInput,
  ExploreAnalysis,
  ExploreAnalysisSummary,
  UpdateExploreAnalysisInput,
} from '../shared/types/account-types'

export const exploreService = {
  async listAnalyses(): Promise<ExploreAnalysisSummary[]> {
    const { analyses } = await apiRequest<{ analyses: ExploreAnalysisSummary[] }>(
      '/explore/analyses',
    )
    return analyses
  },

  async getAnalysis(exploreAnalysisId: string): Promise<ExploreAnalysis> {
    const { analysis } = await apiRequest<{ analysis: ExploreAnalysis }>(
      `/explore/analyses/${exploreAnalysisId}`,
    )
    return analysis
  },

  async createAnalysis(input: CreateExploreAnalysisInput): Promise<ExploreAnalysis> {
    const { analysis } = await apiRequest<{ analysis: ExploreAnalysis }>(
      '/explore/analyses',
      {
        method: 'POST',
        body: input,
      },
    )
    return analysis
  },

  async updateAnalysis({
    exploreAnalysisId,
    name,
  }: UpdateExploreAnalysisInput): Promise<ExploreAnalysisSummary> {
    const { analysis } = await apiRequest<{ analysis: ExploreAnalysisSummary }>(
      `/explore/analyses/${exploreAnalysisId}`,
      {
        method: 'PATCH',
        body: { name },
      },
    )
    return analysis
  },

  async deleteAnalysis(
    exploreAnalysisId: string,
  ): Promise<{ exploreAnalysisId: string }> {
    return apiRequest<{ exploreAnalysisId: string }>(
      `/explore/analyses/${exploreAnalysisId}`,
      {
        method: 'DELETE',
      },
    )
  },

  async runAnalysis(exploreAnalysisId: string): Promise<ExploreAnalysis> {
    const { analysis } = await apiRequest<{ analysis: ExploreAnalysis }>(
      `/explore/analyses/${exploreAnalysisId}/run`,
      {
        method: 'POST',
      },
    )
    return analysis
  },

  async addLinks({
    exploreAnalysisId,
    urls,
  }: AddExploreAnalysisLinksInput): Promise<ExploreAnalysis> {
    const { analysis } = await apiRequest<{ analysis: ExploreAnalysis }>(
      `/explore/analyses/${exploreAnalysisId}/links`,
      {
        method: 'POST',
        body: { urls },
      },
    )
    return analysis
  },
}
