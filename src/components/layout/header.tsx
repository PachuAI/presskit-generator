"use client"

import Link from "next/link"
import { useAuth } from "../../hooks/use-auth"
import { logger } from "../../lib/logging/logger"
import { Button } from "../ui"

export function Header() {
  const { auth, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      logger.error("Authentication sign out failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        userId: auth.user?.id,
        timestamp: new Date().toISOString(),
      })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2D2D2D] bg-[#0F0F0F]">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded bg-[#FF6B35] font-bold text-white">Í</div>
            <span className="text-xl font-bold text-white">ÍTERA</span>
          </Link>
        </div>

        <nav className="flex items-center space-x-6">
          {auth.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-[#A0A0A0] transition-colors hover:text-[#FF6B35]"
              >
                Dashboard
              </Link>
              <Link
                href="/presskits"
                className="text-sm font-medium text-[#A0A0A0] transition-colors hover:text-[#FF6B35]"
              >
                Mis PressKits
              </Link>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-[#A0A0A0]">{auth.profile?.artist_name || auth.user.email}</span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Cerrar Sesión
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Registrarse</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
