import { useEffect, useState } from 'react'
import { Music2, QrCode, ShieldAlert } from 'lucide-react'

import { type TikTokQRCode, useTikTokLogin } from '../hooks/use-tiktok-login'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui'

interface TikTokLoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnected: () => void
}

export function TikTokLoginModal({ open, onOpenChange, onConnected }: TikTokLoginModalProps) {
  const tiktok = useTikTokLogin()
  const {
    abort,
    errorCode,
    errorMessage,
    handle,
    open: openTikTok,
    qrCode,
    reset,
    state,
  } = tiktok
  const [consentChecked, setConsentChecked] = useState(false)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      abort()
      setConsentChecked(false)
    }
    onOpenChange(nextOpen)
  }

  useEffect(() => {
    if (state === 'success') {
      const timer = setTimeout(() => {
        onConnected()
        reset()
        setConsentChecked(false)
        onOpenChange(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [state, onConnected, onOpenChange, reset])

  const handleStart = () => {
    void openTikTok()
  }

  const showConsent = state === 'idle'
  const showConnecting = state === 'connecting'
  const showQrCode = state === 'qr' && qrCode
  const isConnecting = state === 'connecting'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showClose={state !== 'connecting'}
        className="max-w-[440px] border-none bg-white p-0"
      >
        <div className="flex items-center gap-3 rounded-t-[20px] bg-black px-6 py-5 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <Music2 className="h-5 w-5 text-[#fe2c55]" />
          </div>
          <div>
            <DialogTitle className="font-heading text-lg font-bold text-white">
              Conectar TikTok
            </DialogTitle>
            <DialogDescription className="text-xs text-white/70">
              Escaneie com o app TikTok para autorizar a sessão
            </DialogDescription>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6">
          {showConsent && (
            <ConsentStep
              consentChecked={consentChecked}
              onToggle={setConsentChecked}
              onStart={handleStart}
              isConnecting={isConnecting}
            />
          )}

          {showConnecting && <ConnectingStep />}

          {showQrCode && qrCode && <QrCodeStep qrCode={qrCode} />}

          {state === 'success' && (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              <p className="font-semibold">Conexão criada com sucesso.</p>
              {handle && (
                <p className="mt-1 text-green-700">Vinculado como {handle}</p>
              )}
            </div>
          )}

          {state === 'error' && (
            <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <p className="font-semibold">{errorMessage ?? 'Falha no login.'}</p>
              {errorCode && (
                <p className="text-xs text-red-600">Código: {errorCode}</p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={reset}
              >
                Tentar de novo
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ConnectingStep() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#f8f8f6] p-4 text-sm text-[#555]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#fe2c55] border-t-transparent" />
      <span>Gerando QR code no TikTok...</span>
    </div>
  )
}

function QrCodeStep({ qrCode }: { qrCode: TikTokQRCode }) {
  const scale = Math.min(1, 260 / qrCode.width)
  const displayWidth = Math.round(qrCode.width * scale)
  const displayHeight = Math.round(qrCode.height * scale)

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-black/10 bg-[#f8f8f6] p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#181818]">
          <QrCode className="h-4 w-4 text-[#fe2c55]" />
          Escaneie com o app TikTok
        </div>

        <div className="flex justify-center rounded-xl bg-white p-4">
          <img
            src={`data:image/png;base64,${qrCode.image}`}
            alt="QR code de login do TikTok"
            className="select-none"
            style={{ width: displayWidth, height: displayHeight }}
          />
        </div>
      </div>

      <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-[#555]">
        <li>Abra o app TikTok no celular.</li>
        <li>Use o leitor de QR code do app ou a câmera do celular.</li>
        <li>Confirme o login no app e mantenha esta janela aberta.</li>
      </ol>

      <div className="flex items-center gap-2 rounded-2xl border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-800">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
        Aguardando confirmação do TikTok...
      </div>
    </div>
  )
}

function ConsentStep({
  consentChecked,
  onToggle,
  onStart,
  isConnecting,
}: {
  consentChecked: boolean
  onToggle: (value: boolean) => void
  onStart: () => void
  isConnecting: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="space-y-1">
          <p className="font-semibold">Como funciona</p>
          <ul className="list-disc space-y-1 pl-5 text-amber-800">
            <li>Suas credenciais não são enviadas nem armazenadas pelo Teresa.</li>
            <li>Apenas os cookies de sessão são guardados criptografados — nunca a senha.</li>
            <li>Você confirma o login diretamente no app TikTok pelo celular.</li>
            <li>Você pode desvincular a qualquer momento, apagando a sessão.</li>
          </ul>
        </div>
      </div>

      <label className="flex items-start gap-2 text-sm text-[#181818]">
        <input
          type="checkbox"
          checked={consentChecked}
          onChange={event => onToggle(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-black/30"
        />
        <span>
          Estou ciente de que isso cria uma sessão web do TikTok no Teresa para coleta autorizada
          da minha atividade. Assumo a responsabilidade pelo uso da minha conta.
        </span>
      </label>

      <Button
        type="button"
        fullWidth
        disabled={!consentChecked || isConnecting}
        onClick={onStart}
        className="!bg-[#fe2c55] !text-white"
      >
        {isConnecting ? 'Iniciando sessão…' : 'Continuar'}
      </Button>
    </div>
  )
}
