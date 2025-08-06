import "../styles/tailwind.css"
import { Header } from '../components/layout/header'
import { Footer } from '../components/layout/footer'
import { AuthProvider } from '../hooks/use-auth'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white dark:bg-gray-950">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
