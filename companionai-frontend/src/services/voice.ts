import { apiClient } from './api'

export interface VoicePersona {
  id: string;
  name: string;
  gender: string;
  vibe: string;
  default: boolean;
}

export interface VoiceSessionConfig {
  model: string;
  instructions: string;
  voices: VoicePersona[];
  default_voice: string;
}

export interface TranscriptionResponse {
  transcript: string;
  language?: string;
  duration?: number;
  model?: string;
  error?: string;
}

export const getVoiceSessionConfig = async (): Promise<VoiceSessionConfig> => {
  return apiClient.get('/voice/session-config')
}

export const getAvailableVoices = async (): Promise<{ voices: VoicePersona[]; default: string }> => {
  return apiClient.get('/voice/voices')
}

export const sendWebRTCOffer = async (sdp: string, model?: string, voice?: string): Promise<{ sdp: string; model: string; status: string }> => {
  return apiClient.post('/voice/calls', { sdp, model, voice })
}

export const transcribeAudioBlob = async (blob: Blob): Promise<TranscriptionResponse> => {
  const formData = new FormData()
  formData.append('file', blob, 'recording.webm')
  return apiClient.post('/voice/transcribe', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const uploadVoiceBase64 = async (audioBase64: string): Promise<TranscriptionResponse> => {
  return apiClient.post('/voice/upload', { audio_base64: audioBase64 })
}

export const getRealtimeToken = async () => {
  return apiClient.get('/voice/stream-token')
}

export const initVoiceSession = async () => {
  return apiClient.post('/voice/init-session')
}

export const uploadVoiceFallback = async (audioBase64: string) => {
  return apiClient.post('/voice/upload', { audio_base64: audioBase64 })
}
