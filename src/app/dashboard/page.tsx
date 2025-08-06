'use client'

import { useAuth } from '../../hooks/use-auth'
import { Card, CardHeader, CardContent, CardTitle, Button } from '../../components/ui'
import { UserProfileCard } from '../../components/dashboard/user-profile-card'
import { EmptyState } from '../../components/dashboard/empty-state'
import Link from 'next/link'

export default function DashboardPage() {
  const { auth } = useAuth()

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white font-itera-heading">
          Dashboard
        </h1>
        <p className="text-[#A0A0A0] font-itera-body mt-2">
          Gestiona tus presskits y haz crecer tu carrera musical
        </p>
      </div>

      {/* User Profile Card */}
      <div className="mb-8">
        <UserProfileCard user={auth.user} profile={auth.profile} />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex size-12 items-center justify-center rounded-lg bg-[#FF6B35]/10 text-2xl">
                🎵
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#A0A0A0] font-itera-body">
                  PressKits Creados
                </p>
                <p className="text-2xl font-bold text-white font-itera-heading">
                  0
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex size-12 items-center justify-center rounded-lg bg-[#4CAF50]/10 text-2xl">
                👀
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#A0A0A0] font-itera-body">
                  Visualizaciones
                </p>
                <p className="text-2xl font-bold text-white font-itera-heading">
                  0
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex size-12 items-center justify-center rounded-lg bg-[#FF9800]/10 text-2xl">
                ⭐
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#A0A0A0] font-itera-body">
                  Compartidas
                </p>
                <p className="text-2xl font-bold text-white font-itera-heading">
                  0
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Empty State: Mis PressKits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white font-itera-heading">Mis PressKits</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon="🎵"
              title="Tu primer PressKit te espera"
              description="Aún no has creado ningún presskit. ¡Es hora de mostrar tu talento al mundo!"
              action={{
                label: "Crear tu primer PressKit",
                href: "/presskits/create"
              }}
            />
          </CardContent>
        </Card>

        {/* Empty State: Estadísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white font-itera-heading">Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon="📊"
              title="Sin datos aún"
              description="Una vez que crees y compartas tus presskits, aquí verás estadísticas detalladas."
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create PressKit */}
        <Card className="hover:border-[#FF6B35]/70 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center text-white font-itera-heading">
              <span className="mr-2 text-2xl">🚀</span>
              Crear PressKit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#A0A0A0] font-itera-body mb-4">
              Usa nuestra IA para crear un presskit profesional en minutos.
            </p>
            <Link href="/presskits/create">
              <Button className="w-full">
                Comenzar
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Profile Setup */}
        <Card className="hover:border-[#FF6B35]/70 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center text-white font-itera-heading">
              <span className="mr-2 text-2xl">👤</span>
              Perfil de Artista
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#A0A0A0] font-itera-body mb-4">
              Completa tu perfil para obtener mejores resultados con la IA.
            </p>
            <Link href="/profile">
              <Button variant="outline" className="w-full">
                Editar Perfil
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="hover:border-[#FF6B35]/70 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center text-white font-itera-heading">
              <span className="mr-2 text-2xl">💳</span>
              Suscripción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#A0A0A0] font-itera-body mb-4">
              Accede a plantillas premium y funciones avanzadas.
            </p>
            <Link href="/subscription">
              <Button variant="outline" className="w-full">
                Ver Planes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}