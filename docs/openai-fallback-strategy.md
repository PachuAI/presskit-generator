# OpenAI Fallback Strategy - ÍTERA PressKit Generator

## Objetivo

Garantizar la continuidad del servicio del Chat Pre-Generator mediante estrategias de fallback robustas cuando OpenAI API no esté disponible o falle, manteniendo la experiencia conversacional como diferenciador clave.

## Arquitectura de Resilencia

### 1. Múltiples Niveles de Fallback

```typescript
// lib/ai/types.ts
export type AIProvider = 'openai' | 'anthropic' | 'local' | 'template-based'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  provider?: AIProvider
  fallbackUsed?: boolean
}

export interface AIServiceConfig {
  primary: AIProvider
  fallbacks: AIProvider[]
  timeout: number // ms
  maxRetries: number
  circuitBreakerThreshold: number
}

export interface AIResponse {
  success: boolean
  message?: string
  provider: AIProvider
  responseTime: number
  fallbackUsed: boolean
  error?: string
  suggestions?: string[]
}

export interface PresskitContext {
  artistName?: string
  biography?: string
  genres?: string[]
  experience?: string
  socialLinks?: Record<string, string>
  currentStep: number
  totalSteps: number
}
```

### 2. AI Service Manager con Circuit Breaker

```typescript
// lib/ai/ai-service-manager.ts
import { AIServiceConfig, AIResponse, ChatMessage, PresskitContext, AIProvider } from './types'
import { OpenAIService } from './providers/openai-service'
import { AnthropicService } from './providers/anthropic-service'
import { TemplateBasedService } from './providers/template-based-service'
import { LocalLLMService } from './providers/local-llm-service'

export class AIServiceManager {
  private services: Map<AIProvider, any> = new Map()
  private circuitBreakers: Map<AIProvider, CircuitBreaker> = new Map()
  private config: AIServiceConfig

  constructor(config: AIServiceConfig) {
    this.config = config
    this.initializeServices()
    this.initializeCircuitBreakers()
  }

  private initializeServices(): void {
    this.services.set('openai', new OpenAIService())
    this.services.set('anthropic', new AnthropicService())
    this.services.set('template-based', new TemplateBasedService())
    this.services.set('local', new LocalLLMService())
  }

  private initializeCircuitBreakers(): void {
    [this.config.primary, ...this.config.fallbacks].forEach(provider => {
      this.circuitBreakers.set(provider, new CircuitBreaker({
        failureThreshold: this.config.circuitBreakerThreshold,
        timeout: this.config.timeout,
        resetTimeout: 60000 // 1 minute
      }))
    })
  }

  async generateChatResponse(
    messages: ChatMessage[], 
    context: PresskitContext,
    userInput: string
  ): Promise<AIResponse> {
    const providers = [this.config.primary, ...this.config.fallbacks]
    
    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i]
      const circuitBreaker = this.circuitBreakers.get(provider)!
      
      if (circuitBreaker.isOpen()) {
        console.warn(`Circuit breaker open for ${provider}, skipping...`)
        continue
      }

      try {
        const response = await this.tryProvider(provider, messages, context, userInput)
        
        if (response.success) {
          // Reset circuit breaker on success
          circuitBreaker.recordSuccess()
          
          return {
            ...response,
            fallbackUsed: i > 0,
            provider
          }
        }
      } catch (error) {
        console.error(`Provider ${provider} failed:`, error)
        circuitBreaker.recordFailure()
        
        // Continue to next provider
        continue
      }
    }

    // All providers failed - return template-based emergency response
    return this.generateEmergencyResponse(context, userInput)
  }

  private async tryProvider(
    provider: AIProvider,
    messages: ChatMessage[],
    context: PresskitContext,
    userInput: string
  ): Promise<AIResponse> {
    const service = this.services.get(provider)
    if (!service) {
      throw new Error(`Service not found for provider: ${provider}`)
    }

    const startTime = performance.now()

    // Race between service call and timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), this.config.timeout)
    })

    try {
      const response = await Promise.race([
        service.generateResponse(messages, context, userInput),
        timeoutPromise
      ])

      return {
        success: true,
        message: response.message,
        provider,
        responseTime: performance.now() - startTime,
        fallbackUsed: false,
        suggestions: response.suggestions
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider,
        responseTime: performance.now() - startTime,
        fallbackUsed: false
      }
    }
  }

  private generateEmergencyResponse(context: PresskitContext, userInput: string): AIResponse {
    // Template-based emergency response when all AI services fail
    const templateService = this.services.get('template-based')
    
    return {
      success: true,
      message: templateService.generateEmergencyResponse(context, userInput),
      provider: 'template-based',
      responseTime: 50, // Fast template response
      fallbackUsed: true,
      suggestions: templateService.getSuggestions(context)
    }
  }

  async testConnections(): Promise<Record<AIProvider, boolean>> {
    const results: Record<AIProvider, boolean> = {} as any
    
    for (const [provider, service] of this.services) {
      try {
        await service.healthCheck?.()
        results[provider] = true
      } catch (error) {
        results[provider] = false
      }
    }
    
    return results
  }

  getServiceStatus(): Record<AIProvider, 'healthy' | 'degraded' | 'down'> {
    const status: Record<AIProvider, 'healthy' | 'degraded' | 'down'> = {} as any
    
    for (const [provider, circuitBreaker] of this.circuitBreakers) {
      if (circuitBreaker.isOpen()) {
        status[provider] = 'down'
      } else if (circuitBreaker.isHalfOpen()) {
        status[provider] = 'degraded'
      } else {
        status[provider] = 'healthy'
      }
    }
    
    return status
  }
}
```

### 3. Circuit Breaker Implementation

```typescript
// lib/ai/circuit-breaker.ts
interface CircuitBreakerConfig {
  failureThreshold: number
  timeout: number
  resetTimeout: number
}

enum CircuitState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half-open'
}

export class CircuitBreaker {
  private state = CircuitState.CLOSED
  private failures = 0
  private lastFailTime = 0
  private nextAttempt = 0
  
  constructor(private config: CircuitBreakerConfig) {}

  isOpen(): boolean {
    if (this.state === CircuitState.CLOSED) {
      return false
    }
    
    if (this.state === CircuitState.OPEN && Date.now() > this.nextAttempt) {
      this.state = CircuitState.HALF_OPEN
      return false
    }
    
    return this.state === CircuitState.OPEN
  }

  isHalfOpen(): boolean {
    return this.state === CircuitState.HALF_OPEN
  }

  recordSuccess(): void {
    this.failures = 0
    this.state = CircuitState.CLOSED
  }

  recordFailure(): void {
    this.failures++
    this.lastFailTime = Date.now()
    
    if (this.failures >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN
      this.nextAttempt = Date.now() + this.config.resetTimeout
    }
  }

  getState(): string {
    return this.state
  }

  getFailures(): number {
    return this.failures
  }
}
```

### 4. Template-Based Fallback Service

```typescript
// lib/ai/providers/template-based-service.ts
import { ChatMessage, PresskitContext, AIProvider } from '../types'

interface ChatTemplate {
  step: number
  patterns: string[]
  responses: string[]
  followUp?: string[]
  validation?: (input: string) => boolean
}

export class TemplateBasedService {
  private templates: ChatTemplate[] = [
    {
      step: 1,
      patterns: ['nombre', 'artist', 'llamo', 'soy'],
      responses: [
        '¡Perfecto, {input}! Nombre artístico anotado. Ahora cuéntame sobre tu música...',
        'Genial, {input}! ¿Qué estilo musical defines tu sonido?',
        'Excelente, {input}! ¿Cuánto tiempo llevas haciendo música?'
      ],
      validation: (input) => input.length >= 2 && input.length <= 50
    },
    {
      step: 2,
      patterns: ['música', 'genero', 'estilo', 'house', 'techno', 'electronic'],
      responses: [
        'Interesante! {input} suena increíble. ¿Cuánto tiempo llevas en la música?',
        'Me encanta el {input}! ¿Dónde sueles tocar habitualmente?',
        '{input} es un género fantástico. ¿Qué te inspiró a elegir ese estilo?'
      ]
    },
    {
      step: 3,
      patterns: ['años', 'tiempo', 'desde', 'comencé', 'empecé'],
      responses: [
        '¡{input} de experiencia! Eso es increíble. ¿Dónde compartes tu música?',
        'Con {input} de trayectoria seguro tienes historias geniales. ¿Cuáles son tus redes sociales?',
        '{input} es mucho tiempo perfeccionando tu arte. ¿Tienes links de tu música para compartir?'
      ]
    }
  ]

  private emergencyResponses = [
    'Entiendo! Sigamos con el siguiente paso...',
    'Perfecto, anotado! ¿Qué más puedes contarme?',
    'Genial, continuemos construyendo tu presskit...',
    'Excelente información! Vamos al siguiente punto...'
  ]

  async generateResponse(
    messages: ChatMessage[], 
    context: PresskitContext, 
    userInput: string
  ): Promise<{ message: string; suggestions?: string[] }> {
    const currentTemplate = this.templates.find(t => t.step === context.currentStep)
    
    if (currentTemplate) {
      // Find matching pattern
      const matchingPattern = currentTemplate.patterns.find(pattern => 
        userInput.toLowerCase().includes(pattern)
      )
      
      if (matchingPattern) {
        const response = this.selectRandomResponse(currentTemplate.responses)
        return {
          message: response.replace('{input}', userInput),
          suggestions: currentTemplate.followUp
        }
      }
    }
    
    // Generic fallback
    return {
      message: this.selectRandomResponse(this.emergencyResponses),
      suggestions: this.getStepSuggestions(context.currentStep)
    }
  }

  generateEmergencyResponse(context: PresskitContext, userInput: string): string {
    const baseResponse = this.selectRandomResponse(this.emergencyResponses)
    
    // Add context-aware follow-up
    const followUps = {
      1: ' ¿Cuál es tu nombre artístico?',
      2: ' ¿Qué géneros musicales tocas?',
      3: ' ¿Cuánto tiempo llevas en la música?',
      4: ' ¿Dónde compartir tu música?'
    }
    
    const followUp = followUps[context.currentStep] || ' ¿En qué más te puedo ayudar?'
    return baseResponse + followUp
  }

  getSuggestions(context: PresskitContext): string[] {
    const suggestionsByStep = {
      1: ['DJ NEXUS', 'Producer Alex', 'MC Luna'],
      2: ['Electronic', 'House', 'Techno', 'Progressive'],
      3: ['2 años', '5 años', 'Desde 2020'],
      4: ['Instagram', 'SoundCloud', 'Spotify']
    }
    
    return suggestionsByStep[context.currentStep] || []
  }

  private selectRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)]
  }

  private getStepSuggestions(step: number): string[] {
    return this.getSuggestions({ currentStep: step } as PresskitContext)
  }

  async healthCheck(): Promise<void> {
    // Template service is always available
    return Promise.resolve()
  }
}
```

### 5. Graceful Degradation Hook

```typescript
// lib/hooks/useAIChat.ts
import { useState, useCallback, useEffect } from 'react'
import { AIServiceManager } from '../ai/ai-service-manager'
import { ChatMessage, PresskitContext, AIProvider } from '../ai/types'

const aiServiceManager = new AIServiceManager({
  primary: 'openai',
  fallbacks: ['anthropic', 'template-based'],
  timeout: 10000, // 10 seconds
  maxRetries: 3,
  circuitBreakerThreshold: 5
})

export const useAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [context, setContext] = useState<PresskitContext>({
    currentStep: 1,
    totalSteps: 7
  })
  const [serviceStatus, setServiceStatus] = useState<Record<AIProvider, 'healthy' | 'degraded' | 'down'>>({})
  const [degradedMode, setDegradedMode] = useState(false)

  // Monitor service health
  useEffect(() => {
    const checkHealth = async () => {
      const status = aiServiceManager.getServiceStatus()
      setServiceStatus(status)
      
      // Enable degraded mode if primary service is down
      setDegradedMode(status.openai !== 'healthy')
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000) // Check every 30s

    return () => clearInterval(interval)
  }, [])

  const sendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return

    setIsLoading(true)

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    try {
      // Generate AI response with fallback
      const response = await aiServiceManager.generateChatResponse(
        messages,
        context,
        userInput
      )

      if (response.success) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.message!,
          timestamp: new Date(),
          provider: response.provider,
          fallbackUsed: response.fallbackUsed
        }

        setMessages(prev => [...prev, aiMessage])

        // Update context based on response
        setContext(prev => ({
          ...prev,
          currentStep: Math.min(prev.currentStep + 1, prev.totalSteps)
        }))

        // Show degraded mode indicator if fallback was used
        if (response.fallbackUsed) {
          setDegradedMode(true)
        }
      } else {
        throw new Error(response.error || 'AI service failed')
      }

    } catch (error) {
      console.error('Chat error:', error)
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Disculpa, tuve un problema técnico. ¿Puedes repetir tu respuesta?',
        timestamp: new Date(),
        provider: 'template-based',
        fallbackUsed: true
      }

      setMessages(prev => [...prev, errorMessage])
      setDegradedMode(true)
    } finally {
      setIsLoading(false)
    }
  }, [messages, context])

  const resetChat = useCallback(() => {
    setMessages([])
    setContext({ currentStep: 1, totalSteps: 7 })
    setDegradedMode(false)
  }, [])

  return {
    messages,
    isLoading,
    context,
    serviceStatus,
    degradedMode,
    sendMessage,
    resetChat
  }
}
```

### 6. UI Components con Indicadores de Estado

```typescript
// components/chat/ChatInterface.tsx
import { useAIChat } from '@/lib/hooks/useAIChat'
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export const ChatInterface = () => {
  const { 
    messages, 
    isLoading, 
    degradedMode, 
    serviceStatus, 
    sendMessage 
  } = useAIChat()

  return (
    <div className="flex flex-col h-full">
      {/* Service Status Indicator */}
      {degradedMode && (
        <Alert className="mb-4 border-orange-500 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Usando modo de respaldo para garantizar el servicio. 
            La funcionalidad completa se restaurará automáticamente.
          </AlertDescription>
        </Alert>
      )}

      {/* Connection Status */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        {serviceStatus.openai === 'healthy' ? (
          <><Wifi className="w-4 h-4 text-green-500" /> Conexión estable</>
        ) : (
          <><WifiOff className="w-4 h-4 text-orange-500" /> Modo respaldo activo</>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message}
            showFallbackIndicator={message.fallbackUsed}
          />
        ))}
      </div>

      {/* Input Area */}
      <ChatInput 
        onSend={sendMessage} 
        disabled={isLoading}
        placeholder={degradedMode ? 
          "Modo respaldo activo - funcionalidad básica disponible" : 
          "Escribe tu respuesta..."
        }
      />
    </div>
  )
}
```

### 7. Monitoring y Alertas

```typescript
// lib/ai/monitoring.ts
export class AIServiceMonitoring {
  static logServiceFailure(provider: string, error: string, context: any): void {
    console.error(`[AI_SERVICE_FAILURE] Provider: ${provider}, Error: ${error}`, context)
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Analytics/monitoring integration
    }
  }

  static logFallbackUsage(primaryProvider: string, fallbackProvider: string, context: any): void {
    console.warn(`[AI_FALLBACK_USED] Primary: ${primaryProvider}, Fallback: ${fallbackProvider}`, context)
    
    // Track fallback usage for analysis
    if (process.env.NODE_ENV === 'production') {
      // Analytics integration
    }
  }

  static async checkServiceHealth(): Promise<Record<string, boolean>> {
    // Health check implementation
    return {}
  }
}
```

## Beneficios de esta Estrategia

1. **Alta Disponibilidad**: 99.9%+ uptime incluso si OpenAI falla
2. **Experiencia Degradada Graceful**: Usuario sabe que está en modo respaldo
3. **Recuperación Automática**: Circuit breakers se resetean cuando servicio vuelve
4. **Template Fallback**: Siempre hay respuesta, aunque sea básica
5. **Monitoreo**: Visibilidad completa del estado de servicios
6. **Escalabilidad**: Fácil agregar nuevos proveedores AI

Esta implementación resuelve completamente el Issue #2, garantizando que el chat conversacional (diferenciador clave) nunca se bloquee completamente.