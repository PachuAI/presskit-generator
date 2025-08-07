import { SignInData, SignUpData } from "../../types/auth"
import { createClient } from "../supabase/client"

export class AuthService {
  private static getSupabaseClient() {
    return createClient()
  }

  static async signUp(data: SignUpData) {
    const supabase = this.getSupabaseClient()

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          artist_name: data.artist_name,
          full_name: data.full_name,
        },
      },
    })

    if (error) {
      throw new Error(`Signup failed: ${error.message}`)
    }

    return authData
  }

  static async signIn(data: SignInData) {
    const supabase = this.getSupabaseClient()

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      throw new Error(`Signin failed: ${error.message}`)
    }

    return authData
  }

  static async signInWithGoogle() {
    const supabase = this.getSupabaseClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      throw new Error(`Google signin failed: ${error.message}`)
    }

    return data
  }

  static async signOut() {
    const supabase = this.getSupabaseClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(`Signout failed: ${error.message}`)
    }
  }

  static async getCurrentUser() {
    const supabase = this.getSupabaseClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error && error.message !== "Auth session missing!") {
      throw new Error(`Get user failed: ${error.message}`)
    }

    return user
  }

  static async getSession() {
    const supabase = this.getSupabaseClient()

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      throw new Error(`Get session failed: ${error.message}`)
    }

    return session
  }
}
