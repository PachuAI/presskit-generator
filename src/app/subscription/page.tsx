"use client"

import { Button, Card, CardContent, CardHeader, CardTitle } from "../../components/ui"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "siempre gratis",
    features: ["3 presskits por mes", "Plantillas básicas", "Exportación PDF", "Soporte por email"],
    current: true,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "por mes",
    features: [
      "Presskits ilimitados",
      "Plantillas premium",
      "Páginas web responsive",
      "Analytics avanzados",
      "Soporte prioritario",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$29.99",
    period: "por mes",
    features: ["Todo de Pro", "Marca personalizada", "API access", "Soporte dedicado", "Integraciones avanzadas"],
  },
]

export default function SubscriptionPage() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-itera-heading mb-4 text-3xl font-bold text-white">Planes y Suscripción</h1>
        <p className="font-itera-body text-lg text-[#A0A0A0]">
          Elige el plan perfecto para impulsar tu carrera musical
        </p>
      </div>

      {/* Plans Grid */}
      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? "border-[#FF6B35] shadow-lg shadow-[#FF6B35]/20" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                <span className="rounded-full bg-[#FF6B35] px-4 py-1 text-sm font-medium text-white">Más Popular</span>
              </div>
            )}

            <CardHeader className="text-center">
              <CardTitle className="font-itera-heading text-xl text-white">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="font-itera-heading text-3xl font-bold text-[#FF6B35]">{plan.price}</span>
                <span className="font-itera-body ml-1 text-[#A0A0A0]">{plan.period}</span>
              </div>
            </CardHeader>

            <CardContent>
              <ul className="mb-6 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="font-itera-body flex items-center text-[#A0A0A0]">
                    <span className="mr-3 text-[#4CAF50]">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.current ? "secondary" : plan.popular ? "default" : "outline"}
                className="w-full"
                disabled={plan.current}
              >
                {plan.current ? "Plan Actual" : "Seleccionar Plan"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <Card>
        <CardContent>
          <div className="py-8 text-center">
            <div className="mb-4 text-6xl">💳</div>
            <h3 className="font-itera-heading mb-2 text-xl font-semibold text-white">Sistema de Suscripciones</h3>
            <p className="font-itera-body text-[#A0A0A0]">
              Los pagos y suscripciones premium estarán disponibles próximamente.
              <br />
              Por ahora, disfruta de todas las funcionalidades de forma gratuita.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
