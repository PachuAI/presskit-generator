"use client"

import Link from "next/link"
import { Button, Card, CardContent } from "../../components/ui"

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <div className="mb-6 animate-pulse text-8xl">🎵</div>
      <h3 className="font-itera-heading mb-4 text-2xl font-semibold text-white">
        ¡Es hora de crear tu primer PressKit!
      </h3>
      <p className="font-itera-body mx-auto mb-8 max-w-md text-lg text-[#A0A0A0]">
        Aún no tienes presskits creados. Comienza ahora y muestra tu talento al mundo con un presskit profesional.
      </p>
      <Link href="/presskits/create">
        <Button size="lg" className="px-8 py-4 text-lg">
          Crear tu primer PressKit
        </Button>
      </Link>
    </div>
  )
}

export default function PresskitsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-itera-heading text-3xl font-bold text-white">Mis PressKits</h1>
        <p className="font-itera-body mt-2 text-[#A0A0A0]">Gestiona y comparte tus presskits profesionales</p>
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
