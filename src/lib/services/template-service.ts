import { createClient } from '../supabase/client'

interface Template {
  id: string
  name: string
  type: 'basic' | 'electronic' | 'band' | 'solo'
  description: string | null
  config_data: unknown
  is_active: boolean
  created_at: string
  updated_at: string
}

export class TemplateService {
  private static getSupabaseClient() {
    return createClient()
  }

  static async getAllTemplates(): Promise<Template[]> {
    const supabase = this.getSupabaseClient()

    const { data: templates, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) {
      throw new Error(`Failed to get templates: ${error.message}`)
    }

    return templates || []
  }

  static async getTemplatesByType(type: 'basic' | 'electronic' | 'band' | 'solo'): Promise<Template[]> {
    const supabase = this.getSupabaseClient()

    const { data: templates, error } = await supabase
      .from('templates')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .order('name')

    if (error) {
      throw new Error(`Failed to get templates by type: ${error.message}`)
    }

    return templates || []
  }

  static async getTemplateById(id: string): Promise<Template | null> {
    const supabase = this.getSupabaseClient()

    const { data: template, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to get template: ${error.message}`)
    }

    return template
  }
}