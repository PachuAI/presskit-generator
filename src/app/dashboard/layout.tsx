'use client'

import Link from 'next/link'
import { Button } from '../../components/ui'
import { Sidebar } from '../../components/layout/sidebar'
import { useAuth } from '../../hooks/use-auth'
import { useSidebar } from '../../hooks/use-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOpen: sidebarOpen, close: closeSidebar, open: openSidebar } = useSidebar()
  const { auth } = useAuth()

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-[#FF6B35] text-white font-bold text-2xl">
            Í
          </div>
        </div>
      </div>
    )
  }

  if (!auth.user) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-[#FF6B35] text-white font-bold text-2xl mb-6 mx-auto">
            Í
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Acceso Denegado
          </h1>
          <p className="text-[#A0A0A0] mb-6">
            Necesitas iniciar sesión para acceder al dashboard
          </p>
          <Link href="/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] lg:flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar} 
      />
      
      {/* Main content area */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-10 bg-[#1A1A1A] border-b border-[#2D2D2D] px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={openSidebar}
              className="text-[#A0A0A0] hover:text-white"
              aria-label="Abrir menú"
            >
              <span className="text-xl">☰</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="flex size-6 items-center justify-center rounded bg-[#FF6B35] text-white font-bold text-sm">
                Í
              </div>
              <span className="font-medium text-white">ÍTERA</span>
            </div>
            <div className="text-sm text-[#A0A0A0]">
              {auth.profile?.artist_name || 'Usuario'}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}