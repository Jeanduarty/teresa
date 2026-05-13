import type { SessionClientType } from '../../../shared/types/account-types'
import { Apple, Globe, Monitor, Terminal } from 'lucide-react'

import {
  formatSessionCreatedDate,
  formatSessionLastActive,
  getSessionClientLabel,
  getSessionPlatformLabel,
} from './account-settings-utils'
import type { SessionList, SessionPagination } from './account-settings-types'

interface SessionIconProps {
  clientType: SessionClientType
}

interface AccountSettingsSessionsSectionProps {
  sessions: SessionList
  pagination?: SessionPagination
  isLoading: boolean
  isFetching: boolean
  loadErrorMessage?: string
  onRetry: () => void
  onNextPage: () => void
  onPreviousPage: () => void
}

function SessionIcon({ clientType }: SessionIconProps) {
  if (clientType === 'web') {
    return <Globe className="h-4 w-4 text-[#666]" />
  }

  if (clientType === 'cli') {
    return <Terminal className="h-4 w-4 text-[#666]" />
  }

  return <Monitor className="h-4 w-4 text-[#666]" />
}

function SessionPlatform({ platformLabel }: { platformLabel: string }) {
  return (
    <div className="group relative flex max-w-[128px] items-center gap-2 text-[#4f4f4f]">
      <Apple className="h-4 w-4" />
      <span className="min-w-0 truncate">{platformLabel}</span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden max-w-[260px] rounded-[12px] border border-black/10 bg-[#181818] px-3 py-2 text-xs font-medium leading-5 text-white shadow-[0_18px_36px_-24px_rgba(0,0,0,0.55)] group-hover:block group-focus-within:block"
      >
        {platformLabel}
      </span>
    </div>
  )
}

export function AccountSettingsSessionsSection({
  sessions,
  pagination,
  isLoading,
  isFetching,
  loadErrorMessage,
  onRetry,
  onNextPage,
  onPreviousPage,
}: AccountSettingsSessionsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-[1.72rem] font-bold tracking-[-0.02em] text-[#181818]">
          Sessões ativas
        </h2>
        <p className="mt-1.5 text-[0.96rem] text-[#666]">
          Dispositivos conectados à sua conta, carregados por página para manter a tela leve.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-[18px] border border-black/10 bg-[#fbfbfb] px-5 py-12 text-center text-sm text-[#666]">
          Carregando sessões ativas...
        </div>
      ) : null}

      {!isLoading && loadErrorMessage ? (
        <div className="rounded-[18px] border border-red-200 bg-red-50 px-5 py-5 text-sm">
          <p className="font-semibold text-red-700">Falha ao carregar sessões.</p>
          <p className="mt-1 text-red-600">{loadErrorMessage}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 text-sm font-semibold text-red-700 hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      ) : null}

      {!isLoading && !loadErrorMessage && sessions.length === 0 ? (
        <div className="rounded-[18px] border border-black/10 bg-[#fbfbfb] px-5 py-12 text-center text-sm text-[#666]">
          Nenhuma sessão ativa.
        </div>
      ) : null}

      {!isLoading && !loadErrorMessage && sessions.length > 0 ? (
        <>
          <div className="flex flex-col gap-3 rounded-[18px] border border-black/10 bg-[#fbfbfb] px-4 py-3 text-sm text-[#666] sm:flex-row sm:items-center sm:justify-between">
            <p>
              {pagination
                ? `Página ${pagination.page} de ${pagination.totalPages} · ${pagination.total} sessões ativas`
                : 'Sessões ativas'}
            </p>
            {isFetching ? <p className="font-medium text-[#141414]">Atualizando...</p> : null}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full table-fixed text-left text-[0.95rem]">
              <thead>
                <tr className="border-b border-black/10 text-[#666]">
                  <th className="w-[31%] pb-4 font-semibold">Cliente</th>
                  <th className="w-[19%] pb-4 font-semibold">Plataforma</th>
                  <th className="w-[25%] pb-4 font-semibold">Criada em</th>
                  <th className="w-[25%] pb-4 font-semibold">Última atividade</th>
                </tr>
              </thead>

              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-b border-black/10 last:border-b-0">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <SessionIcon clientType={session.clientType} />
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#141414]">
                            {getSessionClientLabel(session)}
                          </span>
                          {session.isCurrent ? (
                            <span className="rounded-full bg-[#e9f9ef] px-2 py-[0.18rem] text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#1d9a52]">
                              Atual
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <SessionPlatform platformLabel={getSessionPlatformLabel(session)} />
                    </td>
                    <td className="py-4 pr-4 text-[#666]">
                      {formatSessionCreatedDate(session.createdAt)}
                    </td>
                    <td className="py-4 pr-4 text-[#666]">
                      {formatSessionLastActive(session.lastUsedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 md:hidden">
            {sessions.map((session) => (
              <div key={session.id} className="rounded-[20px] border border-black/10 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <SessionIcon clientType={session.clientType} />
                    <div>
                      <p className="font-semibold text-[#141414]">{getSessionClientLabel(session)}</p>
                      <div className="mt-1">
                        <SessionPlatform platformLabel={getSessionPlatformLabel(session)} />
                      </div>
                    </div>
                  </div>

                  {session.isCurrent ? (
                    <span className="rounded-full bg-[#e9f9ef] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1d9a52]">
                      Atual
                    </span>
                  ) : null}
                </div>

                <dl className="mt-4 grid gap-3 text-sm text-[#666]">
                  <div className="flex items-center justify-between gap-4">
                    <dt>Criada em</dt>
                    <dd className="text-right text-[#141414]">
                      {formatSessionCreatedDate(session.createdAt)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Última atividade</dt>
                    <dd className="text-right text-[#141414]">
                      {formatSessionLastActive(session.lastUsedAt)}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          {pagination ? (
            <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onPreviousPage}
                disabled={!pagination.hasPreviousPage || isFetching}
                className="app-btn-secondary inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sessões mais recentes
              </button>

              <span className="text-center text-sm font-medium text-[#666]">
                {pagination.perPage} por página
              </span>

              <button
                type="button"
                onClick={onNextPage}
                disabled={!pagination.hasNextPage || isFetching}
                className="app-btn-secondary inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sessões antigas
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
