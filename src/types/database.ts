export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          auth_user_id: string
          email: string
          artist_name: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          subscription_status: 'free' | 'pro' | 'enterprise'
          presskit_limit: number
          social_media: {
            instagram?: string
            twitter?: string
            tiktok?: string
            soundcloud?: string
            spotify?: string
            youtube?: string
          } | null
          contact_email: string | null
          phone: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id: string
          email: string
          artist_name: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          subscription_status?: 'free' | 'pro' | 'enterprise'
          presskit_limit?: number
          social_media?: {
            instagram?: string
            twitter?: string
            tiktok?: string
            soundcloud?: string
            spotify?: string
            youtube?: string
          } | null
          contact_email?: string | null
          phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string
          email?: string
          artist_name?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          subscription_status?: 'free' | 'pro' | 'enterprise'
          presskit_limit?: number
          social_media?: {
            instagram?: string
            twitter?: string
            tiktok?: string
            soundcloud?: string
            spotify?: string
            youtube?: string
          } | null
          contact_email?: string | null
          phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      presskits: {
        Row: {
          id: string
          user_id: string
          title: string
          artist_name: string
          template_type: 'basic' | 'electronic' | 'band' | 'solo'
          status: 'draft' | 'published' | 'archived'
          is_public: boolean
          public_slug: string | null
          content_data: {
            biography: string
            genre: string[]
            profile_photo?: string
            press_photos?: string[]
            social_media?: Record<string, string>
            contact_info: {
              booking_email: string
              press_email?: string
            }
          }
          view_count: number
          download_count: number
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          artist_name: string
          template_type?: 'basic' | 'electronic' | 'band' | 'solo'
          status?: 'draft' | 'published' | 'archived'
          is_public?: boolean
          public_slug?: string | null
          content_data?: any
          view_count?: number
          download_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          artist_name?: string
          template_type?: 'basic' | 'electronic' | 'band' | 'solo'
          status?: 'draft' | 'published' | 'archived'
          is_public?: boolean
          public_slug?: string | null
          content_data?: any
          view_count?: number
          download_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          type: 'basic' | 'electronic' | 'band' | 'solo'
          description: string | null
          config_data: {
            sections: string[]
            color_scheme: string
            layout: string
          }
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'basic' | 'electronic' | 'band' | 'solo'
          description?: string | null
          config_data?: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'basic' | 'electronic' | 'band' | 'solo'
          description?: string | null
          config_data?: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          presskit_id: string | null
          event_type: 'view' | 'download' | 'share'
          user_agent: string | null
          ip_address: string | null
          referrer: string | null
          metadata: Record<string, any> | null
          created_at: string
        }
        Insert: {
          id?: string
          presskit_id?: string | null
          event_type: 'view' | 'download' | 'share'
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          metadata?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: string
          presskit_id?: string | null
          event_type?: 'view' | 'download' | 'share'
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          metadata?: Record<string, any> | null
          created_at?: string
        }
      }
      export_history: {
        Row: {
          id: string
          user_id: string
          presskit_id: string
          export_format: 'pdf' | 'zip' | 'json'
          file_size: number | null
          export_status: 'pending' | 'completed' | 'failed'
          download_url: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          presskit_id: string
          export_format: 'pdf' | 'zip' | 'json'
          file_size?: number | null
          export_status?: 'pending' | 'completed' | 'failed'
          download_url?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          presskit_id?: string
          export_format?: 'pdf' | 'zip' | 'json'
          file_size?: number | null
          export_status?: 'pending' | 'completed' | 'failed'
          download_url?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_slug: {
        Args: {
          base_title: string
        }
        Returns: string
      }
    }
    Enums: {
      subscription_status: 'free' | 'pro' | 'enterprise'
      template_type: 'basic' | 'electronic' | 'band' | 'solo'
      presskit_status: 'draft' | 'published' | 'archived'
      event_type: 'view' | 'download' | 'share'
      export_format: 'pdf' | 'zip' | 'json'
      export_status: 'pending' | 'completed' | 'failed'
    }
  }
}