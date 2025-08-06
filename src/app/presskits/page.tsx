'use client'

import { Card, CardContent, Button } from '../../components/ui'
import Link from 'next/link'

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="text-8xl mb-6 animate-pulse">🎵</div>
      <h3 className="text-2xl font-semibold text-white mb-4 font-itera-heading">
        ¡Es hora de crear tu primer PressKit!
      </h3>
      <p className="text-[#A0A0A0] font-itera-body text-lg mb-8 max-w-md mx-auto">
        Aún no tienes presskits creados. Comienza ahora y muestra tu talento al mundo con un presskit profesional.
      </p>
      <Link href="/presskits/create">
        <Button size="lg" className="text-lg px-8 py-4">
          Crear tu primer PressKit
        </Button>
      </Link>
    </div>
  )
}

export default function PresskitsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white font-itera-heading">
          Mis PressKits
        </h1>
        <p className="text-[#A0A0A0] font-itera-body mt-2">
          Gestiona y comparte tus presskits profesionales
        </p>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent>
          <EmptyState />
        </CardContent>
      </Card>

      {/* Future: PressKits Grid would go here */}
    </div>
  )
}