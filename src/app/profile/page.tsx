'use client'

import { useAuth } from '../../hooks/use-auth'
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui'

export default function ProfilePage() {
  const { auth } = useAuth()

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white font-itera-heading">
          Perfil de Artista
        </h1>
        <p className="text-[#A0A0A0] font-itera-body mt-2">
          Completa tu información para obtener mejores resultados con la IA
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white font-itera-heading">Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="flex size-24 items-center justify-center rounded-full bg-[#FF6B35] text-white font-bold text-4xl mx-auto mb-6">
              {auth.profile?.artist_name?.charAt(0) || auth.user?.email?.charAt(0) || '?'}
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2 font-itera-heading">
              {auth.profile?.artist_name || 'Nombre de Artista'}
            </h3>
            <p className="text-[#A0A0A0] font-itera-body mb-8">
              {auth.user?.email}
            </p>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🚧</div>
              <p className="text-[#A0A0A0] font-itera-body">
                La edición de perfiles estará disponible próximamente.
                <br />
                Esta funcionalidad será implementada en historias futuras.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}