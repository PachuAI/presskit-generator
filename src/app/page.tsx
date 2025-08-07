import { Metadata } from "next"
import Link from "next/link"
import { Button } from "../components/ui"

export const metadata: Metadata = {
  title: "ÍTERA PressKit Generator - Crea tu presskit profesional en minutos",
  description:
    "La plataforma más avanzada para DJs y artistas. Crea tu presskit profesional sin complicaciones. Gratis para empezar.",
  keywords: "presskit, DJ, artista, música electrónica, argentina, LATAM",
  openGraph: {
    title: "ÍTERA PressKit Generator",
    description: "Crea tu presskit profesional en minutos",
    images: ["/og-image.jpg"],
    locale: "es_AR",
    type: "website",
  },
}

export default function HomePage() {
  const howItWorksSteps = [
    {
      step: "1️⃣",
      title: "Chatea",
      description: "Cuéntanos sobre tu carrera musical, estilo y logros a través de nuestra IA conversacional",
      icon: "💬",
    },
    {
      step: "2️⃣",
      title: "Personaliza",
      description: "Elige plantillas profesionales y ajusta el diseño según tu identidad artística",
      icon: "🎨",
    },
    {
      step: "3️⃣",
      title: "Comparte",
      description: "Descarga tu presskit en PDF de alta calidad o compártelo como página web responsive",
      icon: "🚀",
    },
  ]

  const presskitPreviews = [
    {
      id: 1,
      artistName: "DJ Luna",
      genre: "Progressive House",
      preview: "/preview-1.jpg",
    },
    {
      id: 2,
      artistName: "Artista Techno",
      genre: "Techno Underground",
      preview: "/preview-2.jpg",
    },
    {
      id: 3,
      artistName: "Producer LATAM",
      genre: "Electronic Fusion",
      preview: "/preview-3.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F]">
        <div className="container mx-auto px-4 py-24">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="mb-12 text-center">
              <div className="mb-8 flex justify-center">
                <div className="flex size-20 animate-pulse items-center justify-center rounded-2xl bg-[#FF6B35] text-3xl font-bold text-white shadow-xl">
                  Í
                </div>
              </div>

              <h1 className="font-itera-heading mb-6 text-4xl font-bold tracking-tight">
                Crea tu presskit profesional en{" "}
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#FF5722] bg-clip-text text-transparent">
                  minutos
                </span>
              </h1>

              <p className="font-itera-body mb-8 text-lg text-[#A0A0A0]">
                La plataforma más avanzada para DJs y artistas. Sin complicaciones, solo resultados profesionales.
              </p>

              <Link href="/register">
                <Button size="lg" className="mb-4 w-full px-8 py-4 text-lg">
                  Comenzar Gratis
                </Button>
              </Link>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
            {/* Hero Visual */}
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#FF6B35] via-[#FF5722] to-[#E55A2B] p-8 shadow-2xl">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 text-6xl font-bold">🎵</div>
                  <div className="mb-2 text-2xl font-bold">ÍTERA</div>
                  <div className="text-sm opacity-90">PressKit Generator</div>
                </div>
              </div>
            </div>

            {/* Hero Content */}
            <div>
              <h1 className="font-itera-heading mb-6 text-5xl font-bold tracking-tight">
                Crea tu presskit profesional en minutos,{" "}
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#FF5722] bg-clip-text text-transparent">
                  no en días
                </span>
              </h1>

              <p className="font-itera-body mb-8 text-xl leading-relaxed text-[#A0A0A0]">
                Plataforma impulsada por IA específicamente diseñada para DJs y artistas de América Latina. Resultados
                profesionales garantizados.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/register">
                  <Button size="lg" className="px-8 py-4 text-lg">
                    Comenzar Gratis
                  </Button>
                </Link>
                <Link href="#como-funciona">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                    Ver Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Cómo funciona? Section */}
      <section id="como-funciona" className="bg-[#1A1A1A] py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="font-itera-heading mb-4 text-3xl font-bold md:text-4xl">¿Cómo funciona?</h2>
            <p className="font-itera-body text-lg text-[#A0A0A0]">Tres pasos simples para tu presskit profesional</p>
          </div>

          {/* Mobile: Vertical Layout */}
          <div className="block space-y-8 lg:hidden">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className="rounded-lg border border-[#2D2D2D] bg-[#1A1A1A] p-6 transition-colors hover:border-[#FF6B35]/50"
              >
                <div className="text-center">
                  <div className="mb-4 text-4xl">{step.icon}</div>
                  <div className="mb-2 text-2xl font-bold text-[#FF6B35]">{step.step}</div>
                  <h3 className="font-itera-heading mb-3 text-xl font-semibold">{step.title}</h3>
                  <p className="font-itera-body text-[#A0A0A0]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Horizontal Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className="rounded-lg border border-[#2D2D2D] bg-[#1A1A1A] p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:border-[#FF6B35]/50"
              >
                <div className="mb-6 text-4xl">{step.icon}</div>
                <div className="mb-4 text-2xl font-bold text-[#FF6B35]">{step.step}</div>
                <h3 className="font-itera-heading mb-4 text-xl font-semibold">{step.title}</h3>
                <p className="font-itera-body leading-relaxed text-[#A0A0A0]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section id="ejemplos" className="bg-[#0F0F0F] py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="font-itera-heading mb-4 text-3xl font-bold md:text-4xl">Ejemplos de PressKits</h2>
            <p className="font-itera-body text-lg text-[#A0A0A0]">Ve la calidad profesional que puedes alcanzar</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {presskitPreviews.map((preview) => (
              <div
                key={preview.id}
                className="overflow-hidden rounded-lg border border-[#2D2D2D] bg-[#1A1A1A] transition-colors hover:border-[#FF6B35]/50"
              >
                <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] text-6xl">
                  🎵
                </div>
                <div className="p-6">
                  <h3 className="font-itera-heading mb-1 font-semibold">{preview.artistName}</h3>
                  <p className="font-itera-body mb-4 text-sm text-[#A0A0A0]">{preview.genre}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/register">
              <Button size="lg" className="px-8 py-4 text-lg">
                Crear Mi PressKit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-[#FF6B35] to-[#FF5722] py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-itera-heading mb-6 text-3xl font-bold text-white md:text-4xl">
              ¿Listo para impulsar tu carrera musical?
            </h2>
            <p className="font-itera-body mb-8 text-xl text-white/90">
              Únete a cientos de artistas de LATAM que ya confían en ÍTERA
            </p>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="border-0 bg-white px-8 py-4 text-lg font-medium text-[#FF6B35] hover:bg-gray-100"
              >
                Empezar Gratis Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
