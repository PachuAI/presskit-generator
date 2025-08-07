import { UserProfile, UserProfileUpdate } from "../../types/auth"
import { createClient } from "../supabase/client"
import { UserProfileUpdateSchema } from "../validation/schemas"

export class UserService {
  private static getSupabaseClient() {
    return createClient()
  }

  static async getCurrentUserProfile(): Promise<UserProfile | null> {
    const supabase = this.getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No profile found - this should be created by trigger
        return null
      }
      throw new Error(`Failed to get user profile: ${error.message}`)
    }

    return profile
  }

  static async updateUserProfile(updates: UserProfileUpdate): Promise<UserProfile> {
    const supabase = this.getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    // Validar datos con Zod
    const validatedUpdates = UserProfileUpdateSchema.parse(updates)

    const { data: profile, error } = await supabase
      .from("user_profiles")
      .update({
        ...validatedUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq("auth_user_id", user.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update user profile: ${error.message}`)
    }

    return profile
  }

  static async deleteUserProfile(): Promise<void> {
    const supabase = this.getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    const { error } = await supabase.from("user_profiles").delete().eq("auth_user_id", user.id)

    if (error) {
      throw new Error(`Failed to delete user profile: ${error.message}`)
    }
  }

  static async createUserProfile(
    profileData: Omit<UserProfile, "id" | "created_at" | "updated_at">
  ): Promise<UserProfile> {
    const supabase = this.getSupabaseClient()

    const { data: profile, error } = await supabase
      .from("user_profiles")
      .insert({
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create user profile: ${error.message}`)
    }

    return profile
  }

  static async getUserProfileByEmail(email: string): Promise<UserProfile | null> {
    const supabase = this.getSupabaseClient()

    const { data: profile, error } = await supabase.from("user_profiles").select("*").eq("email", email).single()

    if (error) {
      if (error.code === "PGRST116") {
        // No profile found
        return null
      }
      throw new Error(`Failed to get user profile by email: ${error.message}`)
    }

    return profile
  }
}
