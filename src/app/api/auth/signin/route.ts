import { NextRequest } from 'next/server'
import { AuthService } from '@/lib/auth/auth-service'
import { createSuccessResponse, handleApiError } from '@/lib/utils/api-response'
import { SignInSchema } from '@/lib/validation/schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = SignInSchema.parse(body)
    
    // Iniciar sesión
    const result = await AuthService.signIn(validatedData)
    
    return createSuccessResponse({
      user: result.user,
      session: result.session
    })
    
  } catch (error) {
    return handleApiError(error)
  }
}