"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui"
import { useAuth } from "../../hooks/use-auth"

export default function ProfilePage() {
  const { auth } = useAuth()

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-itera-heading text-3xl font-bold text-white">Perfil de Artista</h1>
        <p className="font-itera-body mt-2 text-[#A0A0A0]">
          Completa tu información para obtener mejores resultados con la IA
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-itera-heading text-white">Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-[#FF6B35] text-4xl font-bold text-white">
              {auth.profile?.artist_name?.charAt(0) || auth.user?.email?.charAt(0) || "?"}
            </div>
            <h3 className="font-itera-heading mb-2 text-2xl font-semibold text-white">
              {auth.profile?.artist_name || "Nombre de Artista"}
            </h3>
            <p className="font-itera-body mb-8 text-[#A0A0A0]">{auth.user?.email}</p>
            <div className="py-8 text-center">
              <div className="mb-4 text-6xl">🚧</div>
              <p className="font-itera-body text-[#A0A0A0]">
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
