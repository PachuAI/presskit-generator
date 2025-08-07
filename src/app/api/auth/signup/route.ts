import { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth/auth-service"
import { createSuccessResponse, handleApiError } from "@/lib/utils/api-response"
import { SignUpSchema } from "@/lib/validation/schemas"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos de entrada
    const validatedData = SignUpSchema.parse(body)

    // Registrar usuario
    const result = await AuthService.signUp(validatedData)

    return createSuccessResponse(
      {
        user: result.user,
        session: result.session,
      },
      201
    )
  } catch (error) {
    return handleApiError(error)
  }
}
