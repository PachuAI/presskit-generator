import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserService } from '../../../src/lib/services/user-service'
import type { UserProfile } from '../../../src/types/auth'

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
  })),
}

// Mock the Supabase clients
vi.mock('../../../src/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}))

vi.mock('../../../src/lib/supabase/server', () => ({
  createClient: () => mockSupabase,
}))

describe('UserService', () => {
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
  }

  const mockProfile: UserProfile = {
    id: 'profile123',
    auth_user_id: 'user123',
    email: 'test@example.com',
    artist_name: 'Test Artist',
    full_name: 'Test User',
    avatar_url: null,
    bio: null,
    subscription_status: 'free',
    presskit_limit: 3,
    social_media: null,
    contact_email: null,
    phone: null,
    location: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock for authenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
  })

  describe('getCurrentUserProfile', () => {
    it('should return user profile when found', async () => {
      const mockChain = {
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          }),
        })),
      }

      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => mockChain),
      })

      const result = await UserService.getCurrentUserProfile()

      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles')
      expect(mockChain.eq).toHaveBeenCalledWith('auth_user_id', 'user123')
      expect(result).toEqual(mockProfile)
    })

    it('should return null when user not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await UserService.getCurrentUserProfile()

      expect(result).toBeNull()
    })

    it('should return null when profile not found', async () => {
      const mockChain = {
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116' }, // No rows returned
          }),
        })),
      }

      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => mockChain),
      })

      const result = await UserService.getCurrentUserProfile()

      expect(result).toBeNull()
    })

    it('should throw error for database errors', async () => {
      const mockChain = {
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database connection failed' },
          }),
        })),
      }

      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => mockChain),
      })

      await expect(UserService.getCurrentUserProfile()).rejects.toThrow(
        'Failed to get user profile: Database connection failed'
      )
    })
  })

  describe('updateUserProfile', () => {
    it('should successfully update user profile', async () => {
      const updates = {
        artist_name: 'Updated Artist',
        bio: 'New bio',
      }

      const updatedProfile = { ...mockProfile, ...updates }

      const mockChain = {
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: updatedProfile,
              error: null,
            }),
          })),
        })),
      }

      mockSupabase.from.mockReturnValue({
        update: vi.fn(() => mockChain),
      })

      const result = await UserService.updateUserProfile(updates)

      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles')
      expect(mockChain.eq).toHaveBeenCalledWith('auth_user_id', 'user123')
      expect(result).toEqual(updatedProfile)
    })

    it('should throw error when user not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      await expect(
        UserService.updateUserProfile({ artist_name: 'Test' })
      ).rejects.toThrow('User not authenticated')
    })

    it('should throw error for update failures', async () => {
      const mockChain = {
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Update failed' },
            }),
          })),
        })),
      }

      mockSupabase.from.mockReturnValue({
        update: vi.fn(() => mockChain),
      })

      await expect(
        UserService.updateUserProfile({ artist_name: 'Test' })
      ).rejects.toThrow('Failed to update user profile: Update failed')
    })
  })

  describe('deleteUserProfile', () => {
    it('should successfully delete user profile', async () => {
      const mockChain = {
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      }

      mockSupabase.from.mockReturnValue({
        delete: vi.fn(() => mockChain),
      })

      await UserService.deleteUserProfile()

      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles')
      expect(mockChain.eq).toHaveBeenCalledWith('auth_user_id', 'user123')
    })

    it('should throw error when user not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      await expect(UserService.deleteUserProfile()).rejects.toThrow(
        'User not authenticated'
      )
    })

    it('should throw error for delete failures', async () => {
      const mockChain = {
        eq: vi.fn().mockResolvedValue({
          error: { message: 'Delete failed' },
        }),
      }

      mockSupabase.from.mockReturnValue({
        delete: vi.fn(() => mockChain),
      })

      await expect(UserService.deleteUserProfile()).rejects.toThrow(
        'Failed to delete user profile: Delete failed'
      )
    })
  })

  describe('createUserProfile', () => {
    it('should successfully create user profile', async () => {
      const profileData = {
        auth_user_id: 'user123',
        email: 'test@example.com',
        artist_name: 'New Artist',
        subscription_status: 'free' as const,
        presskit_limit: 3,
      }

      const mockChain = {
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: { ...profileData, id: 'new-profile-123' },
            error: null,
          }),
        })),
      }

      mockSupabase.from.mockReturnValue({
        insert: vi.fn(() => mockChain),
      })

      const result = await UserService.createUserProfile(profileData)

      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles')
      expect(result).toEqual({ ...profileData, id: 'new-profile-123' })
    })

    it('should throw error for create failures', async () => {
      const profileData = {
        auth_user_id: 'user123',
        email: 'test@example.com',
        artist_name: 'New Artist',
        subscription_status: 'free' as const,
        presskit_limit: 3,
      }

      const mockChain = {
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Insert failed' },
          }),
        })),
      }

      mockSupabase.from.mockReturnValue({
        insert: vi.fn(() => mockChain),
      })

      await expect(UserService.createUserProfile(profileData)).rejects.toThrow(
        'Failed to create user profile: Insert failed'
      )
    })
  })

  describe('getUserProfileByEmail', () => {
    it('should return profile when found by email', async () => {
      const mockChain = {
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          }),
        })),
      }

      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => mockChain),
      })

      const result = await UserService.getUserProfileByEmail('test@example.com')

      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles')
      expect(mockChain.eq).toHaveBeenCalledWith('email', 'test@example.com')
      expect(result).toEqual(mockProfile)
    })

    it('should return null when profile not found', async () => {
      const mockChain = {
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116' },
          }),
        })),
      }

      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => mockChain),
      })

      const result = await UserService.getUserProfileByEmail('test@example.com')

      expect(result).toBeNull()
    })

    it('should throw error for database errors', async () => {
      const mockChain = {
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        })),
      }

      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => mockChain),
      })

      await expect(
        UserService.getUserProfileByEmail('test@example.com')
      ).rejects.toThrow('Failed to get user profile by email: Database error')
    })
  })
})