"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { AuthService } from "../../lib/auth/auth-service"
import { UserService } from "../../lib/services/user-service"
import { createClient } from "../../lib/supabase/client"
import { AuthState, AuthUser, SignInData, SignUpData } from "../../types/auth"

const AuthContext = createContext<{
  auth: AuthState
  signUp: (data: SignUpData) => Promise<void>
  signIn: (data: SignInData) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
} | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  })

  const supabase = createClient()

  const refreshProfile = async () => {
    try {
      const profile = await UserService.getCurrentUserProfile()
      setAuth((prev) => ({ ...prev, profile, error: null }))
    } catch (error) {
      setAuth((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to load profile",
      }))
    }
  }

  const signUp = async (data: SignUpData) => {
    try {
      setAuth((prev) => ({ ...prev, loading: true, error: null }))
      await AuthService.signUp(data)
      // Profile will be created by database trigger
    } catch (error) {
      setAuth((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Signup failed",
        loading: false,
      }))
      throw error
    }
  }

  const signIn = async (data: SignInData) => {
    try {
      setAuth((prev) => ({ ...prev, loading: true, error: null }))
      await AuthService.signIn(data)
      // Auth state will be updated by useEffect listener
    } catch (error) {
      setAuth((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Signin failed",
        loading: false,
      }))
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      setAuth((prev) => ({ ...prev, loading: true, error: null }))
      await AuthService.signInWithGoogle()
    } catch (error) {
      setAuth((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Google signin failed",
        loading: false,
      }))
      throw error
    }
  }

  const signOut = async () => {
    try {
      setAuth((prev) => ({ ...prev, loading: true, error: null }))
      await AuthService.signOut()
      setAuth({
        user: null,
        profile: null,
        loading: false,
        error: null,
      })
      // Redirigir al homepage después del logout
      window.location.href = "/"
    } catch (error) {
      setAuth((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Signout failed",
        loading: false,
      }))
      throw error
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata,
          }

          const profile = await UserService.getCurrentUserProfile()

          setAuth({
            user: authUser,
            profile,
            loading: false,
            error: null,
          })
        } else {
          setAuth({
            user: null,
            profile: null,
            loading: false,
            error: null,
          })
        }
      } catch (error) {
        setAuth({
          user: null,
          profile: null,
          loading: false,
          error: error instanceof Error ? error.message : "Auth initialization failed",
        })
      }
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata,
        }

        try {
          const profile = await UserService.getCurrentUserProfile()
          setAuth({
            user: authUser,
            profile,
            loading: false,
            error: null,
          })
        } catch (error) {
          setAuth((prev) => ({
            ...prev,
            user: authUser,
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load profile",
          }))
        }
      } else if (event === "SIGNED_OUT") {
        setAuth({
          user: null,
          profile: null,
          loading: false,
          error: null,
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  return (
    <AuthContext.Provider
      value={{
        auth,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
