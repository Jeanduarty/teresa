import { useMutation, useQuery } from '@tanstack/react-query'

import { contentReportsService } from '../services/content-reports-service'
import { queryClient } from '../shared/lib/query-client'
import type { ContentReport, ContentReportMetrics } from '../shared/types/account-types'

export function useContentReports(userId?: string) {
  const reportsQuery = useQuery<ContentReport[], Error>({
    queryKey: ['content-reports', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      void userId
      return contentReportsService.listReports()
    },
    enabled: Boolean(userId),
  })

  const metricsQuery = useQuery<ContentReportMetrics, Error>({
    queryKey: ['content-reports', 'metrics', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      void userId
      return contentReportsService.getMetrics()
    },
    enabled: Boolean(userId),
  })

  const markDoneMutation = useMutation<ContentReport, Error, string>({
    mutationFn: (reportId) => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return contentReportsService.markReportDone({ userId, reportId })
    },
    onSuccess: (updatedReport) => {
      queryClient.setQueryData<ContentReport>(['content-reports', userId, updatedReport.id], updatedReport)
      queryClient.setQueryData<ContentReport[]>(['content-reports', userId], (currentReports = []) =>
        currentReports.map((report) => (report.id === updatedReport.id ? updatedReport : report)),
      )
      void queryClient.invalidateQueries({ queryKey: ['content-reports', 'metrics', userId] })
    },
  })

  return {
    reportsQuery,
    metricsQuery,
    markDoneMutation,
  }
}

export function useContentReportDetail({ userId, reportId }: { userId?: string; reportId?: string }) {
  const reportQuery = useQuery<ContentReport, Error>({
    queryKey: ['content-reports', userId, reportId],
    queryFn: () => {
      if (!userId || !reportId) {
        throw new Error('ID do usuário e ID do relatório são obrigatórios')
      }

      return contentReportsService.getReport({ userId, reportId })
    },
    enabled: Boolean(userId && reportId),
  })

  const updateScriptMutation = useMutation<ContentReport, Error, string>({
    mutationFn: (script) => {
      if (!userId || !reportId) {
        throw new Error('ID do usuário e ID do relatório são obrigatórios')
      }

      return contentReportsService.updateScript({ userId, reportId, script })
    },
    onSuccess: (updatedReport) => {
      queryClient.setQueryData<ContentReport>(['content-reports', userId, reportId], updatedReport)
      queryClient.setQueryData<ContentReport[]>(['content-reports', userId], (currentReports = []) =>
        currentReports.map((report) => (report.id === updatedReport.id ? updatedReport : report)),
      )
    },
  })

  const resetScriptMutation = useMutation<ContentReport, Error, void>({
    mutationFn: () => {
      if (!userId || !reportId) {
        throw new Error('ID do usuário e ID do relatório são obrigatórios')
      }

      return contentReportsService.resetScript({ userId, reportId })
    },
    onSuccess: (updatedReport) => {
      queryClient.setQueryData<ContentReport>(['content-reports', userId, reportId], updatedReport)
      queryClient.setQueryData<ContentReport[]>(['content-reports', userId], (currentReports = []) =>
        currentReports.map((report) => (report.id === updatedReport.id ? updatedReport : report)),
      )
    },
  })

  const markDoneMutation = useMutation<ContentReport, Error, void>({
    mutationFn: () => {
      if (!userId || !reportId) {
        throw new Error('ID do usuário e ID do relatório são obrigatórios')
      }

      return contentReportsService.markReportDone({ userId, reportId })
    },
    onSuccess: (updatedReport) => {
      queryClient.setQueryData<ContentReport>(['content-reports', userId, reportId], updatedReport)
      queryClient.setQueryData<ContentReport[]>(['content-reports', userId], (currentReports = []) =>
        currentReports.map((report) => (report.id === updatedReport.id ? updatedReport : report)),
      )
      void queryClient.invalidateQueries({ queryKey: ['content-reports', 'metrics', userId] })
    },
  })

  return {
    reportQuery,
    updateScriptMutation,
    resetScriptMutation,
    markDoneMutation,
  }
}
