import { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth/auth-service"
import { createSuccessResponse, handleApiError } from "@/lib/utils/api-response"

export async function POST(_request: NextRequest) {
  try {
    await AuthService.signOut()

    return createSuccessResponse({
      message: "Sesión cerrada exitosamente",
    })
  } catch (error) {
    return handleApiError(error)
  }
}
