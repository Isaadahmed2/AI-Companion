import { useState, useRef, useCallback } from 'react'
import * as voiceService from '../services/voice'

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState<string | null>(null)

  const mediaStreamRef = useRef<MediaStream | null>(null)

  const startListening = useCallback(async () => {
    try {
      setError(null)
      setIsListening(true)
      setTranscript('')

      // Request browser microphone
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaStreamRef.current = stream
      }

      // Simulate real-time speech-to-text preview in browser
      setTimeout(() => {
        setTranscript("I'm feeling a bit tired and stressed from work today...")
      }, 1500)

    } catch (err: any) {
      setError(err.message || 'Microphone access denied')
      setIsListening(false)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
    }
    setIsListening(false)
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
    }, 800)
  }, [])

  return {
    isListening,
    isProcessing,
    transcript,
    setTranscript,
    response,
    error,
    startListening,
    stopListening,
  }
}
