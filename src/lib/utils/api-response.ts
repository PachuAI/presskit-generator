import { NextResponse } from "next/server"
import { ZodError } from "zod"

export interface ApiErrorResponse {
  success: false
  error_code: string
  message: string
  details?: Record<string, string[]>
}

export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

export function createErrorResponse(
  error_code: string,
  message: string,
  details?: Record<string, string[]>,
  status: number = 400
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error_code,
      message,
      ...(details && { details }),
    },
    { status }
  )
}

export function createSuccessResponse<T>(data: T, status: number = 200): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  )
}

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  console.error("API Error:", error)

  if (error instanceof ZodError) {
    const details: Record<string, string[]> = {}
    error.errors.forEach((err) => {
      const path = err.path.join(".")
      if (!details[path]) {
        details[path] = []
      }
      details[path].push(err.message)
    })

    return createErrorResponse("VALIDATION_ERROR", "Datos de entrada inválidos", details, 400)
  }

  if (error instanceof Error) {
    if (error.message.includes("Invalid login credentials")) {
      return createErrorResponse("AUTHENTICATION_ERROR", "Credenciales de acceso inválidas", undefined, 401)
    }

    if (error.message.includes("User already registered")) {
      return createErrorResponse("USER_EXISTS", "El usuario ya está registrado", undefined, 409)
    }

    return createErrorResponse("INTERNAL_ERROR", "Error interno del servidor", undefined, 500)
  }

  return createErrorResponse("UNKNOWN_ERROR", "Error desconocido", undefined, 500)
}
