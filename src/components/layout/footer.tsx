import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-[#2D2D2D] bg-[#1A1A1A] dark:border-[#2D2D2D] dark:bg-[#0F0F0F]">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <div className="flex size-8 items-center justify-center rounded bg-[#E53935] font-bold text-white">Í</div>
              <span className="text-xl font-bold">ÍTERA PressKit Generator</span>
            </div>
            <p className="max-w-md text-sm text-[#A0A0A0] dark:text-[#A0A0A0]">
              La plataforma definitiva para artistas musicales de LATAM. Crea presskits profesionales en minutos con
              nuestro generador impulsado por IA.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white dark:text-white">Producto</h3>
            <ul className="space-y-2 text-sm text-[#A0A0A0] dark:text-[#A0A0A0]">
              <li>
                <Link href="/templates" className="hover:text-[#FF6B35] dark:hover:text-[#FF6B35]">
                  Plantillas
                </Link>
              </li>
              <li>
                <Link href="/precios" className="hover:text-[#FF6B35] dark:hover:text-[#FF6B35]">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/ejemplos" className="hover:text-[#FF6B35] dark:hover:text-[#FF6B35]">
                  Ejemplos
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white dark:text-white">Soporte</h3>
            <ul className="space-y-2 text-sm text-[#A0A0A0] dark:text-[#A0A0A0]">
              <li>
                <Link href="/ayuda" className="hover:text-[#FF6B35] dark:hover:text-[#FF6B35]">
                  Ayuda
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-[#FF6B35] dark:hover:text-[#FF6B35]">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-[#FF6B35] dark:hover:text-[#FF6B35]">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#2D2D2D] pt-8 dark:border-[#2D2D2D]">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-[#A0A0A0] dark:text-[#A0A0A0]">
              © 2025 ÍTERA PressKit Generator. Todos los derechos reservados.
            </p>
            <div className="mt-4 flex items-center space-x-4 md:mt-0">
              <span className="text-xs text-[#8D6E63] dark:text-[#8D6E63]">Hecho con ❤️ para artistas de LATAM</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
