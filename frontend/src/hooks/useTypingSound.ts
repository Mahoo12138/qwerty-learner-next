import { useCallback, useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/authStore'

interface UseTypingSoundOptions {
  enabled: boolean
  mediaId: string | null
  volume?: number
}

export function useTypingSound({ enabled, mediaId, volume = 0.35 }: UseTypingSoundOptions) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef('')

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = ''
      }
    }
  }, [])

  useEffect(() => {
    audioRef.current = null

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = ''
    }

    if (!enabled || !mediaId) {
      return
    }

    const abortController = new AbortController()

    const loadAudio = async () => {
      try {
        const res = await fetch(`/api/v1/media/${mediaId}`, {
          method: 'GET',
          credentials: 'include',
          signal: abortController.signal,
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        })

        if (!res.ok) {
          throw new Error('load sound failed')
        }

        const blob = await res.blob()
        const objectUrl = URL.createObjectURL(blob)
        objectUrlRef.current = objectUrl

        const audio = new Audio(objectUrl)
        audio.preload = 'auto'
        audio.volume = volume
        audioRef.current = audio
      } catch {
        audioRef.current = null
      }
    }

    void loadAudio()

    return () => {
      abortController.abort()
    }
  }, [accessToken, enabled, mediaId, volume])

  const play = useCallback(() => {
    if (!enabled) {
      return
    }

    const audio = audioRef.current
    if (!audio) {
      return
    }

    audio.currentTime = 0
    void audio.play().catch(() => {
      // Browsers may block autoplay before user interaction; ignore runtime rejection.
    })
  }, [enabled])

  return { play }
}
