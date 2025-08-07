import { Metadata } from "next"
import { RegisterForm } from "../../../components/auth/register-form"

export const metadata: Metadata = {
  title: "Crear Cuenta | ÍTERA PressKit Generator",
  description: "Crea tu cuenta en ÍTERA PressKit Generator y comienza a crear presskits profesionales",
}

export default function RegisterPage() {
  return <RegisterForm />
}
