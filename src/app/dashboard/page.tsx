"use client"

import Link from "next/link"
import { EmptyState } from "../../components/dashboard/empty-state"
import { UserProfileCard } from "../../components/dashboard/user-profile-card"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../components/ui"
import { useAuth } from "../../hooks/use-auth"

export default function DashboardPage() {
  const { auth } = useAuth()

  return (
    <div className="mx-auto max-w-7xl">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="font-itera-heading text-3xl font-bold text-white">Dashboard</h1>
        <p className="font-itera-body mt-2 text-[#A0A0A0]">Gestiona tus presskits y haz crecer tu carrera musical</p>
      </div>

      {/* User Profile Card */}
      <div className="mb-8">
        <UserProfileCard user={auth.user} profile={auth.profile} />
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex size-12 items-center justify-center rounded-lg bg-[#FF6B35]/10 text-2xl">🎵</div>
              <div className="ml-4">
                <p className="font-itera-body text-sm font-medium text-[#A0A0A0]">PressKits Creados</p>
                <p className="font-itera-heading text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex size-12 items-center justify-center rounded-lg bg-[#4CAF50]/10 text-2xl">👀</div>
              <div className="ml-4">
                <p className="font-itera-body text-sm font-medium text-[#A0A0A0]">Visualizaciones</p>
                <p className="font-itera-heading text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex size-12 items-center justify-center rounded-lg bg-[#FF9800]/10 text-2xl">⭐</div>
              <div className="ml-4">
                <p className="font-itera-body text-sm font-medium text-[#A0A0A0]">Compartidas</p>
                <p className="font-itera-heading text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions Grid */}
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Empty State: Mis PressKits */}
        <Card>
          <CardHeader>
            <CardTitle className="font-itera-heading text-white">Mis PressKits</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon="🎵"
              title="Tu primer PressKit te espera"
              description="Aún no has creado ningún presskit. ¡Es hora de mostrar tu talento al mundo!"
              action={{
                label: "Crear tu primer PressKit",
                href: "/presskits/create",
              }}
            />
          </CardContent>
        </Card>

        {/* Empty State: Estadísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="font-itera-heading text-white">Estadísticas</CardTitle>
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Create PressKit */}
        <Card className="transition-colors hover:border-[#FF6B35]/70">
          <CardHeader>
            <CardTitle className="font-itera-heading flex items-center text-white">
              <span className="mr-2 text-2xl">🚀</span>
              Crear PressKit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-itera-body mb-4 text-[#A0A0A0]">
              Usa nuestra IA para crear un presskit profesional en minutos.
            </p>
            <Link href="/presskits/create">
              <Button className="w-full">Comenzar</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Profile Setup */}
        <Card className="transition-colors hover:border-[#FF6B35]/70">
          <CardHeader>
            <CardTitle className="font-itera-heading flex items-center text-white">
              <span className="mr-2 text-2xl">👤</span>
              Perfil de Artista
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-itera-body mb-4 text-[#A0A0A0]">
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
        <Card className="transition-colors hover:border-[#FF6B35]/70">
          <CardHeader>
            <CardTitle className="font-itera-heading flex items-center text-white">
              <span className="mr-2 text-2xl">💳</span>
              Suscripción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-itera-body mb-4 text-[#A0A0A0]">Accede a plantillas premium y funciones avanzadas.</p>
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
