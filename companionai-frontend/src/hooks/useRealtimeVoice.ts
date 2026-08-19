import { useState, useRef, useCallback, useEffect } from 'react'
import * as voiceService from '../services/voice'

export interface MessageItem {
  id: string;
  sender: 'user' | 'companion';
  text: string;
  timestamp: Date;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error'
export type CompanionState = 'idle' | 'listening' | 'thinking' | 'speaking'

export function useRealtimeVoice() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected')
  const [companionState, setCompanionState] = useState<CompanionState>('idle')
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedVoice, setSelectedVoice] = useState<string>('shimmer')
  const [availableVoices, setAvailableVoices] = useState<voiceService.VoicePersona[]>([])
  
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [liveUserTranscript, setLiveUserTranscript] = useState<string>('')
  const [liveCompanionTranscript, setLiveCompanionTranscript] = useState<string>('')
  
  const [userVolume, setUserVolume] = useState<number>(0)
  const [companionVolume, setCompanionVolume] = useState<number>(0)

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const userAnalyserRef = useRef<AnalyserNode | null>(null)
  const companionAnalyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Load available voice personas on mount
  useEffect(() => {
    voiceService.getAvailableVoices()
      .then(data => {
        setAvailableVoices(data.voices)
        if (data.default) setSelectedVoice(data.default)
      })
      .catch(() => {
        // Fallback default list
        setAvailableVoices([
          { id: 'shimmer', name: 'Shimmer', gender: 'Female', vibe: 'Gentle, soothing & empathetic', default: true },
          { id: 'sage', name: 'Sage', gender: 'Neutral', vibe: 'Calm, grounded & mindful', default: false },
          { id: 'alloy', name: 'Alloy', gender: 'Neutral', vibe: 'Warm, friendly & balanced', default: false },
          { id: 'coral', name: 'Coral', gender: 'Female', vibe: 'Caring, bright & encouraging', default: false }
        ])
      })
  }, [])

  // Audio Level Visualizer loop
  const startAudioAnalysis = useCallback(() => {
    const updateVolumes = () => {
      // User Mic Volume
      if (userAnalyserRef.current) {
        const array = new Uint8Array(userAnalyserRef.current.frequencyBinCount)
        userAnalyserRef.current.getByteFrequencyData(array)
        let sum = 0
        for (let i = 0; i < array.length; i++) sum += array[i]
        const avg = sum / array.length
        setUserVolume(Math.min(100, Math.round(avg * 1.8)))
      }

      // Companion Voice Volume
      if (companionAnalyserRef.current) {
        const array = new Uint8Array(companionAnalyserRef.current.frequencyBinCount)
        companionAnalyserRef.current.getByteFrequencyData(array)
        let sum = 0
        for (let i = 0; i < array.length; i++) sum += array[i]
        const avg = sum / array.length
        setCompanionVolume(Math.min(100, Math.round(avg * 2.2)))
      }

      animationFrameRef.current = requestAnimationFrame(updateVolumes)
    }
    updateVolumes()
  }, [])

  const stopAudioAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    setUserVolume(0)
    setCompanionVolume(0)
  }, [])

  // Connect WebRTC Speech-to-Speech
  const connect = useCallback(async (voiceId?: string) => {
    try {
      setError(null)
      setConnectionState('connecting')
      setCompanionState('thinking')
      const targetVoice = voiceId || selectedVoice || 'shimmer'

      // 1. Fetch Session Config & Instructions from backend
      let sessionConfig: voiceService.VoiceSessionConfig
      try {
        sessionConfig = await voiceService.getVoiceSessionConfig()
      } catch (e) {
        sessionConfig = {
          model: 'gpt-4o-realtime-preview-2024-12-17',
          instructions: 'You are CompanionAI, a deeply empathetic and soothing emotional wellness companion. Speak gently, validate feelings, and keep replies conversational (1-3 sentences).',
          voices: availableVoices,
          default_voice: targetVoice
        }
      }

      // 2. Request user microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      })
      mediaStreamRef.current = stream

      // 3. Setup Web Audio Analyser
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const audioCtx = new AudioCtx()
      audioContextRef.current = audioCtx

      const userSource = audioCtx.createMediaStreamSource(stream)
      const userAnalyser = audioCtx.createAnalyser()
      userAnalyser.fftSize = 64
      userSource.connect(userAnalyser)
      userAnalyserRef.current = userAnalyser

      // 4. Create WebRTC Peer Connection
      const pc = new RTCPeerConnection()
      peerConnectionRef.current = pc

      // Setup audio output element
      let audioEl = audioElementRef.current
      if (!audioEl) {
        audioEl = document.createElement('audio')
        audioEl.autoplay = true
        audioElementRef.current = audioEl
      }

      // Handle incoming remote audio from OpenAI
      pc.ontrack = (event) => {
        if (audioEl) {
          audioEl.srcObject = event.streams[0]
          
          // Connect companion audio to analyser for visualizer
          try {
            const compSource = audioCtx.createMediaStreamSource(event.streams[0])
            const compAnalyser = audioCtx.createAnalyser()
            compAnalyser.fftSize = 64
            compSource.connect(compAnalyser)
            companionAnalyserRef.current = compAnalyser
          } catch (err) {
            console.warn('Could not attach companion audio analyser:', err)
          }
        }
      }

      // Add local microphone audio track to peer connection
      stream.getTracks().forEach((track) => pc.addTrack(track, stream))

      // 5. Create Data Channel for Realtime Events
      const dc = pc.createDataChannel('oai-events')
      dataChannelRef.current = dc

      dc.onopen = () => {
        console.log('[Realtime] DataChannel opened, sending session configuration...')
        
        // Configure Session parameters over DataChannel
        const sessionUpdateEvent = {
          type: 'session.update',
          session: {
            modalities: ['audio', 'text'],
            voice: targetVoice,
            instructions: sessionConfig.instructions,
            input_audio_transcription: {
              model: 'whisper-1'
            },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 500
            },
            temperature: 0.7
          }
        }
        dc.send(JSON.stringify(sessionUpdateEvent))

        // Initial friendly greeting trigger (Server VAD handles subsequent turns automatically)
        setTimeout(() => {
          if (dc.readyState === 'open') {
            dc.send(JSON.stringify({
              type: 'response.create',
              response: {
                instructions: 'Warmly greet the user in one gentle, empathetic sentence (15 words max), letting them know you are here to listen.'
              }
            }))
          }
        }, 500)
      }

      // Handle Data Channel Messages
      dc.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          console.log('[Realtime Event]', msg.type, msg)

          switch (msg.type) {
            case 'session.updated':
            case 'session.created':
              console.log('[Realtime Session Ready]', msg.session)
              break

            case 'input_audio_buffer.speech_started':
              setCompanionState('listening')
              break

            case 'input_audio_buffer.speech_stopped':
              setCompanionState('thinking')
              break

            case 'conversation.item.input_audio_transcription.completed':
              if (msg.transcript && msg.transcript.trim()) {
                const userText = msg.transcript.trim()
                setLiveUserTranscript('')
                setMessages(prev => {
                  // Prevent duplicate entries
                  if (prev.length > 0 && prev[prev.length - 1].sender === 'user' && prev[prev.length - 1].text === userText) {
                    return prev
                  }
                  return [...prev, {
                    id: `user-${Date.now()}-${Math.random()}`,
                    sender: 'user',
                    text: userText,
                    timestamp: new Date()
                  }]
                })
              }
              break

            case 'response.audio_transcript.delta':
            case 'response.text.delta':
              setCompanionState('speaking')
              const delta = msg.delta || ''
              setLiveCompanionTranscript(prev => prev + delta)
              break

            case 'response.audio_transcript.done':
            case 'response.text.done':
              const completedText = msg.transcript || msg.text || ''
              if (completedText.trim()) {
                setMessages(prev => {
                  if (prev.length > 0 && prev[prev.length - 1].sender === 'companion' && prev[prev.length - 1].text === completedText.trim()) {
                    return prev
                  }
                  return [...prev, {
                    id: `comp-${Date.now()}-${Math.random()}`,
                    sender: 'companion',
                    text: completedText.trim(),
                    timestamp: new Date()
                  }]
                })
              }
              setLiveCompanionTranscript('')
              setCompanionState('idle')
              break

            case 'response.output_item.done':
              if (msg.item?.role === 'assistant' && Array.isArray(msg.item?.content)) {
                const text = msg.item.content
                  .map((c: any) => c.transcript || c.text)
                  .filter(Boolean)
                  .join(' ')
                  .trim()

                if (text) {
                  setMessages(prev => {
                    if (prev.length > 0 && prev[prev.length - 1].sender === 'companion' && prev[prev.length - 1].text === text) {
                      return prev
                    }
                    return [...prev, {
                      id: `comp-${Date.now()}-${Math.random()}`,
                      sender: 'companion',
                      text,
                      timestamp: new Date()
                    }]
                  })
                }
              }
              break

            case 'response.done':
            case 'response.audio.done':
              setCompanionState('idle')
              setLiveCompanionTranscript('')
              break

            case 'error':
              console.warn('[Realtime Server Notice]', msg.error)
              // Only surface blocking errors, ignore benign warnings
              if (msg.error?.code && !msg.error?.message?.includes('Unknown parameter')) {
                setError(msg.error?.message || 'Realtime voice notice')
              }
              break
          }
        } catch (e) {
          console.warn('[Realtime] Parse error:', e)
        }
      }

      // 6. Create SDP Offer & Exchange with Backend
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      const answer = await voiceService.sendWebRTCOffer(offer.sdp || '', sessionConfig.model, targetVoice)

      if (!answer?.sdp) {
        throw new Error('Invalid SDP response from voice backend')
      }

      await pc.setRemoteDescription({
        type: 'answer',
        sdp: answer.sdp
      })

      setConnectionState('connected')
      setCompanionState('idle')
      startAudioAnalysis()

    } catch (err: any) {
      console.error('[Realtime Connection Failed]', err)
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to start Realtime voice session. Please check your microphone permissions.'
      setError(errorMsg)
      setConnectionState('error')
      disconnect()
    }
  }, [selectedVoice, availableVoices, startAudioAnalysis])

  // Disconnect & Cleanup
  const disconnect = useCallback(() => {
    stopAudioAnalysis()

    if (dataChannelRef.current) {
      try { dataChannelRef.current.close() } catch {}
      dataChannelRef.current = null
    }

    if (peerConnectionRef.current) {
      try { peerConnectionRef.current.close() } catch {}
      peerConnectionRef.current = null
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }

    if (audioContextRef.current) {
      try { audioContextRef.current.close() } catch {}
      audioContextRef.current = null
    }

    setConnectionState('disconnected')
    setCompanionState('idle')
    setIsMuted(false)
    setLiveUserTranscript('')
    setLiveCompanionTranscript('')
  }, [stopAudioAnalysis])

  // Toggle Mic Mute
  const toggleMute = useCallback(() => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }, [])

  // Send dynamic text event or guidance over Data Channel
  const sendTextMessage = useCallback((text: string) => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      const event = {
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: text
            }
          ]
        }
      }
      dataChannelRef.current.send(JSON.stringify(event))
      dataChannelRef.current.send(JSON.stringify({ type: 'response.create' }))
      
      setMessages(prev => [...prev, {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: text,
        timestamp: new Date()
      }])
    }
  }, [])

  // Change Voice Persona live
  const changeVoice = useCallback((voiceId: string) => {
    setSelectedVoice(voiceId)
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      dataChannelRef.current.send(JSON.stringify({
        type: 'session.update',
        session: {
          voice: voiceId
        }
      }))
    }
  }, [])

  // Trigger gentle grounding breathing exercise
  const triggerBreathingExercise = useCallback(() => {
    sendTextMessage("Could you please guide me through a slow, comforting breathing exercise to help me relax and center myself?")
  }, [sendTextMessage])

  // Trigger comforting gratitude reflection
  const triggerGratitudeCheck = useCallback(() => {
    sendTextMessage("I'd like to share something I'm grateful for today. Can you help me reflect on that?")
  }, [sendTextMessage])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    connectionState,
    companionState,
    isMuted,
    error,
    selectedVoice,
    availableVoices,
    messages,
    liveUserTranscript,
    liveCompanionTranscript,
    userVolume,
    companionVolume,
    connect,
    disconnect,
    toggleMute,
    sendTextMessage,
    changeVoice,
    triggerBreathingExercise,
    triggerGratitudeCheck,
    clearMessages: () => setMessages([])
  }
}
