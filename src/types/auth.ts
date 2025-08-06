import { Database } from './database'

export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

export interface AuthUser {
  id: string
  email?: string
  user_metadata?: {
    artist_name?: string
    full_name?: string
    avatar_url?: string
  }
}

// Import validated types from schemas
export type { SignUpData, SignInData, UserProfileUpdateData } from '@/lib/validation/schemas'

export interface AuthState {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
}