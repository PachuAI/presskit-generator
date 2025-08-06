import { createClient } from '../supabase/client'
import { z } from 'zod'

// Presskit schemas
export const PressskitContentSchema = z.object({
  biography: z.string().min(10, 'Biografía muy corta').max(5000, 'Biografía muy larga'),
  genre: z.array(z.string()).min(1, 'Debe especificar al menos un género'),
  profile_photo: z.string().url('URL de foto de perfil inválida').optional(),
  press_photos: z.array(z.string().url('URL de foto inválida')).optional(),
  social_media: z.record(z.string().url('URL de red social inválida')).optional(),
  contact_info: z.object({
    booking_email: z.string().email('Email de booking inválido'),
    press_email: z.string().email('Email de prensa inválido').optional(),
  }),
})

export const CreatePressskitSchema = z.object({
  title: z.string().min(1, 'Título requerido').max(200, 'Título muy largo'),
  artist_name: z.string().min(1, 'Nombre de artista requerido').max(100, 'Nombre muy largo'),
  template_type: z.enum(['basic', 'electronic', 'band', 'solo']),
  content_data: PressskitContentSchema,
})

export const UpdatePressskitSchema = CreatePressskitSchema.partial()

export type CreatePressskitData = z.infer<typeof CreatePressskitSchema>
export type UpdatePressskitData = z.infer<typeof UpdatePressskitSchema>

interface Presskit {
  id: string
  user_id: string
  title: string
  artist_name: string
  template_type: 'basic' | 'electronic' | 'band' | 'solo'
  status: 'draft' | 'published' | 'archived'
  is_public: boolean
  public_slug: string | null
  content_data: any
  view_count: number
  download_count: number
  created_at: string
  updated_at: string
  published_at: string | null
}

export class PressskitService {
  private static getSupabaseClient() {
    return createClient()
  }

  static async getUserPresskits(): Promise<Presskit[]> {
    const supabase = this.getSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data: presskits, error } = await supabase
      .from('presskits')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to get presskits: ${error.message}`)
    }

    return presskits || []
  }

  static async getPressskitById(id: string): Promise<Presskit | null> {
    const supabase = this.getSupabaseClient()

    const { data: presskit, error } = await supabase
      .from('presskits')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to get presskit: ${error.message}`)
    }

    return presskit
  }

  static async getPublicPresskit(slug: string): Promise<Presskit | null> {
    const supabase = this.getSupabaseClient()

    const { data: presskit, error } = await supabase
      .from('presskits')
      .select('*')
      .eq('public_slug', slug)
      .eq('is_public', true)
      .eq('status', 'published')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to get public presskit: ${error.message}`)
    }

    // Increment view count
    await this.incrementViewCount(presskit.id)

    return presskit
  }

  static async createPresskit(data: CreatePressskitData): Promise<Presskit> {
    const supabase = this.getSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Validar datos
    const validatedData = CreatePressskitSchema.parse(data)

    // Obtener user_profile.id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    if (!profile) {
      throw new Error('User profile not found')
    }

    const { data: presskit, error } = await supabase
      .from('presskits')
      .insert({
        user_id: profile.id,
        ...validatedData,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create presskit: ${error.message}`)
    }

    return presskit
  }

  static async updatePresskit(id: string, updates: UpdatePressskitData): Promise<Presskit> {
    const supabase = this.getSupabaseClient()

    // Validar datos
    const validatedUpdates = UpdatePressskitSchema.parse(updates)

    const { data: presskit, error } = await supabase
      .from('presskits')
      .update(validatedUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update presskit: ${error.message}`)
    }

    return presskit
  }

  static async publishPresskit(id: string): Promise<Presskit> {
    const supabase = this.getSupabaseClient()

    // Generar slug único si no existe
    const { data: current } = await supabase
      .from('presskits')
      .select('public_slug, title')
      .eq('id', id)
      .single()

    let publicSlug = current?.public_slug
    if (!publicSlug) {
      // Generar slug único usando la función de base de datos
      const { data: slugResult } = await supabase
        .rpc('generate_unique_slug', { base_title: current?.title || 'presskit' })

      publicSlug = slugResult
    }

    const { data: presskit, error } = await supabase
      .from('presskits')
      .update({
        status: 'published',
        is_public: true,
        public_slug: publicSlug,
        published_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to publish presskit: ${error.message}`)
    }

    return presskit
  }

  static async deletePresskit(id: string): Promise<void> {
    const supabase = this.getSupabaseClient()

    const { error } = await supabase
      .from('presskits')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete presskit: ${error.message}`)
    }
  }

  private static async incrementViewCount(pressskitId: string): Promise<void> {
    const supabase = this.getSupabaseClient()

    await supabase
      .from('presskits')
      .update({ view_count: supabase.raw('view_count + 1') })
      .eq('id', pressskitId)
  }
}