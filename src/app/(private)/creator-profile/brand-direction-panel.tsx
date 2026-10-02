import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Flag,
  Route,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'

import { Button, Card } from '../../../components/ui'
import type { BrandDirection } from '../../../shared/types/account-types'

interface BrandDirectionPanelProps {
  direction: BrandDirection | null
  isPending: boolean
  userDirection: string | null
  onOpenDirection: () => void
}

export function BrandDirectionPanel({
  direction,
  isPending,
  userDirection,
  onOpenDirection,
}: BrandDirectionPanelProps) {
  if (!direction) {
    return (
      <Card
        as="section"
        className="overflow-hidden rounded-[20px] bg-[#181818] p-6 text-white sm:p-7"
      >
        <div className="max-w-[620px]">
          <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/10">
            <Compass className="h-5 w-5" />
          </span>
          <h2 className="font-heading mt-5 text-2xl font-semibold text-white">
            Qual marca você quer deixar?
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Conte para onde você quer levar sua presença. A Teresa vai partir do
            que já percebe em você e desenhar um caminho possível para chegar lá.
          </p>
          <Button
            className="mt-5 bg-white !text-[#181818] hover:bg-[#f4f4f2]"
            icon={<ArrowRight className="h-4 w-4" />}
            onClick={onOpenDirection}
            disabled={isPending}
          >
            Desenhar meu caminho
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <section className="space-y-5" aria-label="Direção de marca">
      <Card
        as="section"
        className="overflow-hidden rounded-[20px] bg-[#181818] p-6 text-white sm:p-7"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-[660px]">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/55">
              <Compass className="h-4 w-4" />
              Seu norte
            </p>
            <h2 className="font-heading mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl">
              {direction.desiredPerception}
            </h2>
            <p className="mt-4 border-l border-white/30 pl-4 text-sm leading-6 text-white/75">
              {direction.guidingIdea}
            </p>
          </div>
          <Button
            size="sm"
            className="shrink-0 bg-white !text-[#181818] hover:bg-[#f4f4f2]"
            onClick={onOpenDirection}
            disabled={isPending}
          >
            Redesenhar caminho
          </Button>
        </div>
      </Card>

      {userDirection ? (
        <div className="rounded-[16px] border border-black/10 bg-[#fbfbfa] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#888]">
            O que você escolheu construir
          </p>
          <p className="mt-1 text-sm leading-6 text-[#444]">{userDirection}</p>
        </div>
      ) : null}

      <Card as="section" className="rounded-[18px] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#888]">
          Seu ponto de partida
        </p>
        <p className="mt-2 text-sm leading-6 text-[#333]">{direction.startingPoint}</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card as="section" className="rounded-[18px] p-5">
          <h3 className="font-heading flex items-center gap-2 text-lg font-semibold text-[#181818]">
            <CheckCircle2 className="h-4 w-4 text-[#1d9a52]" />
            O que já joga a seu favor
          </h3>
          <ul className="mt-4 space-y-3">
            {direction.strengths.map((strength) => (
              <li key={strength} className="flex gap-3 text-sm leading-6 text-[#555]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1d9a52]" />
                {strength}
              </li>
            ))}
          </ul>
        </Card>

        <Card as="section" className="rounded-[18px] p-5">
          <h3 className="font-heading flex items-center gap-2 text-lg font-semibold text-[#181818]">
            <Route className="h-4 w-4 text-[#c27a00]" />
            O que merece mudar
          </h3>
          <div className="mt-4 space-y-4">
            {direction.perceptionGaps.map((gap) => (
              <div key={gap.title}>
                <p className="text-sm font-semibold text-[#333]">{gap.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#666]">{gap.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card as="section" className="rounded-[18px] p-5 sm:p-6">
        <h3 className="font-heading flex items-center gap-2 text-xl font-semibold text-[#181818]">
          <Flag className="h-5 w-5" />
          O caminho daqui para frente
        </h3>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {direction.roadmap.map((step) => (
            <article
              key={`${step.horizon}-${step.title}`}
              className="border-t border-black/10 pt-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#888]">
                {step.horizon}
              </p>
              <h4 className="font-heading mt-2 text-base font-semibold text-[#181818]">
                {step.title}
              </h4>
              <p className="mt-2 text-sm leading-6 text-[#666]">{step.description}</p>
              <ul className="mt-3 space-y-2">
                {step.actions.map((action) => (
                  <li key={action} className="flex gap-2 text-xs leading-5 text-[#555]">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#999]" />
                    {action}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Card>

      <Card as="section" className="rounded-[18px] p-5 sm:p-6">
        <h3 className="font-heading flex items-center gap-2 text-xl font-semibold text-[#181818]">
          <Sparkles className="h-5 w-5" />
          Comece nesta semana
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {direction.firstMoves.map((move) => (
            <article
              key={move.title}
              className="rounded-[14px] border border-black/10 bg-[#fbfbfa] p-4"
            >
              <p className="text-sm font-semibold text-[#181818]">{move.title}</p>
              <p className="mt-2 text-xs leading-5 text-[#666]">{move.description}</p>
            </article>
          ))}
        </div>
      </Card>

      <aside className="rounded-[18px] border border-amber-200 bg-amber-50 p-5">
        <h3 className="font-heading flex items-center gap-2 text-base font-semibold text-amber-900">
          <ShieldAlert className="h-4 w-4" />
          Não perca isso de vista
        </h3>
        <ul className="mt-3 space-y-2">
          {direction.watchOutFor.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-amber-900/80">
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-amber-700" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-amber-200 pt-4 text-sm leading-6 text-amber-950">
          {direction.closingNote}
        </p>
      </aside>
    </section>
  )
}
