'use client'

import { Button, Card, CardContent, CardHeader, CardTitle } from '../../components/ui'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'siempre gratis',
    features: [
      '3 presskits por mes',
      'Plantillas básicas',
      'Exportación PDF',
      'Soporte por email',
    ],
    current: true,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'por mes',
    features: [
      'Presskits ilimitados',
      'Plantillas premium',
      'Páginas web responsive',
      'Analytics avanzados',
      'Soporte prioritario',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$29.99',
    period: 'por mes',
    features: [
      'Todo de Pro',
      'Marca personalizada',
      'API access',
      'Soporte dedicado',
      'Integraciones avanzadas',
    ],
  },
]

export default function SubscriptionPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white font-itera-heading mb-4">
          Planes y Suscripción
        </h1>
        <p className="text-[#A0A0A0] font-itera-body text-lg">
          Elige el plan perfecto para impulsar tu carrera musical
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative ${
              plan.popular ? 'border-[#FF6B35] shadow-lg shadow-[#FF6B35]/20' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#FF6B35] text-white px-4 py-1 rounded-full text-sm font-medium">
                  Más Popular
                </span>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-white font-itera-heading text-xl">
                {plan.name}
              </CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold text-[#FF6B35] font-itera-heading">
                  {plan.price}
                </span>
                <span className="text-[#A0A0A0] ml-1 font-itera-body">
                  {plan.period}
                </span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-[#A0A0A0] font-itera-body">
                    <span className="text-[#4CAF50] mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.current ? 'secondary' : plan.popular ? 'default' : 'outline'}
                className="w-full"
                disabled={plan.current}
              >
                {plan.current ? 'Plan Actual' : 'Seleccionar Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <Card>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-xl font-semibold text-white mb-2 font-itera-heading">
              Sistema de Suscripciones
            </h3>
            <p className="text-[#A0A0A0] font-itera-body">
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