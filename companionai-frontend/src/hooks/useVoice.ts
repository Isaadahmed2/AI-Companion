import { useState, useRef, useCallback } from 'react'
import { transcribeAudioBlob } from '../services/voice'

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const speechRecognitionRef = useRef<any>(null)

  const startListening = useCallback(async () => {
    try {
      setError(null)
      setIsListening(true)
      setTranscript('')
      audioChunksRef.current = []

      // 1. Request microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      mediaStreamRef.current = stream

      // 2. Initialize MediaRecorder to capture audio chunks
      let mimeType = 'audio/webm'
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus'
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4'
      }

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      recorder.start(250) // Collect 250ms chunks

      // 3. Optional live interim preview via browser Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition()
          recognition.continuous = true
          recognition.interimResults = true
          recognition.lang = 'en-US'

          recognition.onresult = (event: any) => {
            let interim = ''
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              interim += event.results[i][0].transcript
            }
            if (interim.trim()) {
              setTranscript(interim)
            }
          }

          recognition.onerror = (e: any) => {
            console.warn('[WebSpeech API] notice:', e)
          }

          recognition.start()
          speechRecognitionRef.current = recognition
        } catch (recErr) {
          console.warn('[WebSpeech] Not available, using Whisper fallback:', recErr)
        }
      }

    } catch (err: any) {
      console.error('Microphone error:', err)
      setError(err.message || 'Microphone access denied. Please allow microphone permissions.')
      setIsListening(false)
    }
  }, [])

  const stopListening = useCallback(async (): Promise<string> => {
    setIsListening(false)
    setIsProcessing(true)

    // Stop Web Speech Recognition if active
    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop() } catch {}
      speechRecognitionRef.current = null
    }

    return new Promise<string>((resolve) => {
      const recorder = mediaRecorderRef.current

      if (!recorder || recorder.state === 'inactive') {
        cleanupTracks()
        setIsProcessing(false)
        resolve(transcript)
        return
      }

      recorder.onstop = async () => {
        try {
          cleanupTracks()

          const mimeType = recorder.mimeType || 'audio/webm'
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })

          if (audioBlob.size > 500) {
            // Send audio to Whisper STT model
            const res = await transcribeAudioBlob(audioBlob)
            if (res && res.transcript) {
              setTranscript(res.transcript)
              resolve(res.transcript)
              return
            }
          }

          // Fallback to interim transcript or resolved value
          resolve(transcript)
        } catch (err: any) {
          console.error('Whisper STT error:', err)
          setError('Speech-to-Text transcription error. Please try again.')
          resolve(transcript)
        } finally {
          setIsProcessing(false)
        }
      }

      recorder.stop()
    })
  }, [transcript])

  const cleanupTracks = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }
  }

  return {
    isListening,
    isProcessing,
    transcript,
    setTranscript,
    error,
    startListening,
    stopListening,
  }
}
