import { useCallback, useEffect, useRef, useState } from 'react'

import { API_URL } from '../shared/lib/api-client'
import { readAuthToken } from '../shared/lib/auth-token-storage'

export type TikTokQRCode = {
  image: string
  width: number
  height: number
}

export type TikTokLoginState =
  | 'idle'
  | 'connecting'
  | 'qr'
  | 'success'
  | 'error'

type ServerMessage =
  | { type: 'qrcode'; sessionId: string; qrCode: TikTokQRCode }
  | { type: 'success'; handle: string | null }
  | { type: 'error'; code: string; message: string }

type UseTikTokLoginReturn = {
  state: TikTokLoginState
  qrCode: TikTokQRCode | null
  errorMessage: string | null
  errorCode: string | null
  handle: string | null
  open: () => Promise<void>
  abort: () => void
  reset: () => void
}

function buildWsUrl(token: string): string {
  const httpUrl = new URL(API_URL)
  httpUrl.protocol = httpUrl.protocol === 'https:' ? 'wss:' : 'ws:'
  httpUrl.pathname = '/social/tiktok/login'
  httpUrl.searchParams.set('token', token)
  return httpUrl.toString()
}

export function useTikTokLogin(): UseTikTokLoginReturn {
  const socketRef = useRef<WebSocket | null>(null)
  const expectedCloseRef = useRef(false)
  const [state, setState] = useState<TikTokLoginState>('idle')
  const [qrCode, setQrCode] = useState<TikTokQRCode | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [handle, setHandle] = useState<string | null>(null)

  const cleanup = useCallback(() => {
    const ws = socketRef.current
    if (ws && (ws.readyState === ws.OPEN || ws.readyState === ws.CONNECTING)) {
      try {
        expectedCloseRef.current = true
        ws.onclose = null
        ws.close()
      } catch {
        // noop
      }
    }
    socketRef.current = null
  }, [])

  useEffect(() => () => cleanup(), [cleanup])

  const reset = useCallback(() => {
    cleanup()
    setState('idle')
    setQrCode(null)
    setErrorMessage(null)
    setErrorCode(null)
    setHandle(null)
  }, [cleanup])

  const open = useCallback(async () => {
    cleanup()
    setState('connecting')
    setErrorMessage(null)
    setErrorCode(null)
    setQrCode(null)
    setHandle(null)

    const token = readAuthToken()
    if (!token) {
      setState('error')
      setErrorCode('no_token')
      setErrorMessage('Você precisa estar autenticado no Teresa.')
      return
    }

    const ws = new WebSocket(buildWsUrl(token))
    socketRef.current = ws
    expectedCloseRef.current = false

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'start' }))
    }

    ws.onmessage = (event: MessageEvent<string>) => {
      let parsed: ServerMessage
      try {
        parsed = JSON.parse(event.data) as ServerMessage
      } catch {
        return
      }

      if (parsed.type === 'qrcode') {
        setQrCode(parsed.qrCode)
        setState('qr')
        return
      }

      if (parsed.type === 'success') {
        setHandle(parsed.handle ?? null)
        setState('success')
        cleanup()
        return
      }

      if (parsed.type === 'error') {
        setErrorCode(parsed.code)
        setErrorMessage(parsed.message)
        setState('error')
        cleanup()
      }
    }

    ws.onerror = () => {
      setState('error')
      setErrorCode('socket_error')
      setErrorMessage('Falha de conexão com o servidor.')
    }

    ws.onclose = () => {
      if (expectedCloseRef.current) {
        expectedCloseRef.current = false
        return
      }

      setState(currentState => {
        if (currentState === 'success' || currentState === 'error') {
          return currentState
        }
        setErrorCode('socket_closed')
        setErrorMessage('Conexão encerrada antes da conclusão.')
        return 'error'
      })
    }
  }, [cleanup])

  const abort = useCallback(() => {
    const ws = socketRef.current
    if (ws && ws.readyState === ws.OPEN) {
      try {
        ws.send(JSON.stringify({ type: 'abort' }))
      } catch {
        // noop
      }
    }
    reset()
  }, [reset])

  return {
    state,
    qrCode,
    errorMessage,
    errorCode,
    handle,
    open,
    abort,
    reset,
  }
}
