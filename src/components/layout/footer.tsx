import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex size-8 items-center justify-center rounded bg-[#E53935] text-white font-bold">
                Í
              </div>
              <span className="font-bold text-xl">ÍTERA PressKit Generator</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              La plataforma definitiva para artistas musicales de LATAM. 
              Crea presskits profesionales en minutos con nuestro generador impulsado por IA.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-3">
              Producto
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/templates" className="hover:text-gray-900 dark:hover:text-gray-50">
                  Plantillas
                </Link>
              </li>
              <li>
                <Link href="/precios" className="hover:text-gray-900 dark:hover:text-gray-50">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/ejemplos" className="hover:text-gray-900 dark:hover:text-gray-50">
                  Ejemplos
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-3">
              Soporte
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/ayuda" className="hover:text-gray-900 dark:hover:text-gray-50">
                  Ayuda
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-gray-900 dark:hover:text-gray-50">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-gray-900 dark:hover:text-gray-50">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 ÍTERA PressKit Generator. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-xs text-gray-500 dark:text-gray-500">
                Hecho con ❤️ para artistas de LATAM
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}