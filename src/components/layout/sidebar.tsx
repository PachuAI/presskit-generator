"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "../../hooks/use-auth"
import { logger } from "../../lib/logging/logger"
import { Button } from "../ui"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { auth, signOut } = useAuth()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Mis PressKits", href: "/presskits", icon: "🎵" },
    { name: "Perfil", href: "/profile", icon: "👤" },
    { name: "Suscripción", href: "/subscription", icon: "💳" },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      logger.error("Dashboard sign out failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        userId: auth.user?.id,
        location: "dashboard-sidebar",
      })
    }
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-20 bg-black lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-[#2D2D2D] bg-[#1A1A1A] transition-transform duration-200 ease-in-out lg:static ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } `}
        aria-label="Sidebar navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2D2D2D] p-6">
          <div className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded bg-[#FF6B35] font-bold text-white">Í</div>
            <span className="font-bold text-white">ÍTERA Dashboard</span>
          </div>
          {/* Mobile close button */}
          <button onClick={onClose} className="p-2 text-[#A0A0A0] hover:text-white lg:hidden" aria-label="Cerrar menú">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6" aria-label="Main navigation">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border-l-4 border-[#FF6B35] bg-[#FF6B35]/10 pl-2 text-[#FF6B35]"
                      : "text-[#A0A0A0] hover:bg-[#2D2D2D] hover:text-white"
                  } `}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="mr-3 text-lg" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* User info and logout */}
          <div className="mt-8 border-t border-[#2D2D2D] pt-6">
            <div className="mb-4">
              <div className="text-sm text-[#A0A0A0]">Conectado como:</div>
              <div className="truncate font-medium text-white">
                {auth.profile?.artist_name || auth.user?.email || "Usuario"}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start">
              <span className="mr-3" aria-hidden="true">
                🚪
              </span>
              Cerrar Sesión
            </Button>
          </div>
        </nav>
      </aside>
    </>
  )
}
