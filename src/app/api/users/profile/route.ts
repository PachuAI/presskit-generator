import { NextRequest } from 'next/server'
import { UserService } from '@/lib/services/user-service'
import { UserProfileUpdateSchema } from '@/lib/validation/schemas'
import { createSuccessResponse, handleApiError, createErrorResponse } from '@/lib/utils/api-response'

export async function GET(_request: NextRequest) {
  try {
    const profile = await UserService.getCurrentUserProfile()
    
    if (!profile) {
      return createErrorResponse(
        'PROFILE_NOT_FOUND',
        'Perfil de usuario no encontrado',
        undefined,
        404
      )
    }
    
    return createSuccessResponse(profile)
    
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = UserProfileUpdateSchema.parse(body)
    
    // Actualizar perfil
    const updatedProfile = await UserService.updateUserProfile(validatedData)
    
    return createSuccessResponse(updatedProfile)
    
  } catch (error) {
    return handleApiError(error)
  }
}