import { Metadata } from 'next'
import { LoginForm } from '../../../components/auth/login-form'

export const metadata: Metadata = {
  title: 'Iniciar Sesión | ÍTERA PressKit Generator',
  description: 'Inicia sesión en tu cuenta de ÍTERA PressKit Generator',
}

export default function LoginPage() {
  return <LoginForm />
}