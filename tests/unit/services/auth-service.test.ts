import { describe, it, expect, vi, beforeEach } from "vitest"
import { AuthService } from "../../../src/lib/auth/auth-service"

// Mock Supabase
const mockSupabase = {
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    getSession: vi.fn(),
  },
}

// Mock the Supabase clients
vi.mock("../../../src/lib/supabase/client", () => ({
  createClient: () => mockSupabase,
}))

vi.mock("../../../src/lib/supabase/server", () => ({
  createClient: () => mockSupabase,
}))

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("signUp", () => {
    it("should successfully sign up a new user", async () => {
      const mockAuthData = {
        user: {
          id: "123",
          email: "test@example.com",
        },
      }

      mockSupabase.auth.signUp.mockResolvedValue({
        data: mockAuthData,
        error: null,
      })

      const signUpData = {
        email: "test@example.com",
        password: "password123",
        artist_name: "Test Artist",
        full_name: "Test User",
      }

      const result = await AuthService.signUp(signUpData)

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            artist_name: signUpData.artist_name,
            full_name: signUpData.full_name,
          },
        },
      })

      expect(result).toEqual(mockAuthData)
    })

    it("should throw error when signup fails", async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: "Email already exists" },
      })

      const signUpData = {
        email: "test@example.com",
        password: "password123",
        artist_name: "Test Artist",
      }

      await expect(AuthService.signUp(signUpData)).rejects.toThrow("Signup failed: Email already exists")
    })
  })

  describe("signIn", () => {
    it("should successfully sign in user", async () => {
      const mockAuthData = {
        user: {
          id: "123",
          email: "test@example.com",
        },
      }

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: mockAuthData,
        error: null,
      })

      const signInData = {
        email: "test@example.com",
        password: "password123",
      }

      const result = await AuthService.signIn(signInData)

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: signInData.email,
        password: signInData.password,
      })

      expect(result).toEqual(mockAuthData)
    })

    it("should throw error when signin fails", async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: "Invalid credentials" },
      })

      const signInData = {
        email: "test@example.com",
        password: "wrongpassword",
      }

      await expect(AuthService.signIn(signInData)).rejects.toThrow("Signin failed: Invalid credentials")
    })
  })

  describe("signInWithGoogle", () => {
    it("should successfully initiate Google OAuth", async () => {
      const mockOAuthData = {
        provider: "google",
        url: "https://oauth.google.com/...",
      }

      // Mock window.location.origin
      Object.defineProperty(window, "location", {
        value: { origin: "http://localhost:3000" },
        writable: true,
      })

      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: mockOAuthData,
        error: null,
      })

      const result = await AuthService.signInWithGoogle()

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: {
          redirectTo: "http://localhost:3000/auth/callback",
        },
      })

      expect(result).toEqual(mockOAuthData)
    })

    it("should throw error when Google OAuth fails", async () => {
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: null,
        error: { message: "OAuth failed" },
      })

      await expect(AuthService.signInWithGoogle()).rejects.toThrow("Google signin failed: OAuth failed")
    })
  })

  describe("signOut", () => {
    it("should successfully sign out user", async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: null,
      })

      await AuthService.signOut()

      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    })

    it("should throw error when signout fails", async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: { message: "Signout failed" },
      })

      await expect(AuthService.signOut()).rejects.toThrow("Signout failed: Signout failed")
    })
  })

  describe("getCurrentUser", () => {
    it("should return current user when authenticated", async () => {
      const mockUser = {
        id: "123",
        email: "test@example.com",
      }

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const result = await AuthService.getCurrentUser()

      expect(mockSupabase.auth.getUser).toHaveBeenCalled()
      expect(result).toEqual(mockUser)
    })

    it("should return null when not authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: "Auth session missing!" },
      })

      const result = await AuthService.getCurrentUser()

      expect(result).toBeNull()
    })

    it("should throw error for other auth errors", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: "Database connection failed" },
      })

      await expect(AuthService.getCurrentUser()).rejects.toThrow("Get user failed: Database connection failed")
    })
  })

  describe("getSession", () => {
    it("should return current session", async () => {
      const mockSession = {
        access_token: "token123",
        user: { id: "123" },
      }

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      })

      const result = await AuthService.getSession()

      expect(mockSupabase.auth.getSession).toHaveBeenCalled()
      expect(result).toEqual(mockSession)
    })

    it("should throw error when get session fails", async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: { message: "Session error" },
      })

      await expect(AuthService.getSession()).rejects.toThrow("Get session failed: Session error")
    })
  })
})
