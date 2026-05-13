import { apiRequest } from '../shared/lib/api-client'
import type { ContentReport, ContentReportMetrics } from '../shared/types/account-types'

export const contentReportsService = {
  async listReports(): Promise<ContentReport[]> {
    const { reports } = await apiRequest<{ reports: ContentReport[] }>('/reports')
    return reports
  },

  async getReport({ reportId }: { userId: string; reportId: string }): Promise<ContentReport> {
    const { report } = await apiRequest<{ report: ContentReport }>(`/reports/${reportId}`)
    return report
  },

  async getMetrics(): Promise<ContentReportMetrics> {
    const { metrics } = await apiRequest<{ metrics: ContentReportMetrics }>('/reports/metrics')
    return metrics
  },

  async markReportDone({ reportId }: { userId: string; reportId: string }): Promise<ContentReport> {
    const { report } = await apiRequest<{ report: ContentReport }>(`/reports/${reportId}/done`, {
      method: 'PATCH',
    })
    return report
  },

  async updateScript({
    reportId,
    script,
  }: {
    userId: string
    reportId: string
    script: string
  }): Promise<ContentReport> {
    const { report } = await apiRequest<{ report: ContentReport }>(`/reports/${reportId}/script`, {
      method: 'PATCH',
      body: { script },
    })
    return report
  },

  async resetScript({ reportId }: { userId: string; reportId: string }): Promise<ContentReport> {
    const { report } = await apiRequest<{ report: ContentReport }>(
      `/reports/${reportId}/script/reset`,
      {
        method: 'POST',
      },
    )
    return report
  },
}
