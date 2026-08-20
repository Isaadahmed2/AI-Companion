/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_TIMEOUT?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_GOOGLE_CLIENT_ID?: string
  readonly VITE_OPENAI_API_KEY?: string
  readonly VITE_ENABLE_VOICE?: string
  readonly VITE_ENABLE_SOCIAL?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  readonly VITE_ENV?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
