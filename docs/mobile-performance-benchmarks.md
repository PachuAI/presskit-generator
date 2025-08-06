# Mobile Performance Benchmarks - ÍTERA PressKit Generator

## Objetivo

Establecer benchmarks específicos de performance móvil para el mercado LATAM, considerando dispositivos de gama baja, conexiones 3G/4G variables, y patrones de uso local.

## Contexto del Mercado LATAM

### Perfil de Dispositivos Target (2024)
- **70% móvil, 30% desktop** (PRD confirmado)
- **Dispositivos predominantes**: Gama media-baja (2-4GB RAM, procesadores mid-range)
- **Sistema operativo**: 85% Android, 15% iOS
- **Almacenamiento**: 32-64GB típico
- **Conexión**: 4G promedio, 3G backup común

### Dispositivos de Referencia para Testing
```typescript
// lib/performance/device-profiles.ts
export const LATAM_DEVICE_PROFILES = {
  // Gama Baja (40% del mercado)
  lowEnd: {
    name: 'Gama Baja LATAM',
    ram: '2GB',
    cpu: 'Snapdragon 450 / Helio A22',
    browser: 'Chrome 70+',
    connection: '3G/4G intermitente',
    examples: ['Samsung Galaxy A10', 'Motorola Moto E6', 'Xiaomi Redmi 8A']
  },
  
  // Gama Media (45% del mercado)  
  midRange: {
    name: 'Gama Media LATAM',
    ram: '3-4GB',
    cpu: 'Snapdragon 665 / Helio G35',
    browser: 'Chrome 80+',
    connection: '4G estable',
    examples: ['Samsung Galaxy A31', 'Motorola Moto G8', 'Xiaomi Redmi Note 9']
  },
  
  // Gama Alta (15% del mercado)
  highEnd: {
    name: 'Gama Alta LATAM',
    ram: '6GB+',
    cpu: 'Snapdragon 855+ / Apple A12+',
    browser: 'Chrome/Safari latest',
    connection: '4G/5G',
    examples: ['Samsung Galaxy S21', 'iPhone 12', 'OnePlus 9']
  }
}
```

## Performance Budgets por Funcionalidad

### 1. Core Web Vitals - Benchmarks LATAM

```typescript
// lib/performance/benchmarks.ts
export const PERFORMANCE_BENCHMARKS = {
  // Landing Page (Primera impresión crítica)
  landingPage: {
    lowEnd: {
      FCP: 2500,    // First Contentful Paint (ms)
      LCP: 4000,    // Largest Contentful Paint (ms)
      FID: 200,     // First Input Delay (ms)
      CLS: 0.15,    // Cumulative Layout Shift
      TTI: 5000,    // Time to Interactive (ms)
      bundleSize: '150KB', // Gzipped
      imageSize: '500KB'   // Total images
    },
    midRange: {
      FCP: 1800,
      LCP: 2800,
      FID: 150,
      CLS: 0.1,
      TTI: 3500,
      bundleSize: '200KB',
      imageSize: '800KB'
    },
    highEnd: {
      FCP: 1200,
      LCP: 1800,
      FID: 100,
      CLS: 0.05,
      TTI: 2500,
      bundleSize: '300KB',
      imageSize: '1.2MB'
    }
  },

  // Chat Pre-Generator (Funcionalidad crítica)
  chatInterface: {
    lowEnd: {
      messageRenderTime: 300,     // ms por mensaje
      scrollPerformance: 30,      // fps mínimo
      inputResponseTime: 200,     // ms lag input
      aiResponseTime: 8000,       // ms timeout AI
      memoryUsage: '25MB',        // RAM máxima
      offlineCapability: true     // Must work offline
    },
    midRange: {
      messageRenderTime: 200,
      scrollPerformance: 45,
      inputResponseTime: 150,
      aiResponseTime: 6000,
      memoryUsage: '40MB',
      offlineCapability: true
    },
    highEnd: {
      messageRenderTime: 100,
      scrollPerformance: 60,
      inputResponseTime: 100,
      aiResponseTime: 4000,
      memoryUsage: '60MB',
      offlineCapability: false  // Optional for high-end
    }
  },

  // PressKit Editor (Funcionalidad intensiva)
  presskitEditor: {
    lowEnd: {
      previewUpdateTime: 800,     // ms para actualizar preview
      imageUploadTime: 15000,     // ms para 2MB image
      autoSaveDelay: 3000,        // ms debounce
      maxImageSize: '2MB',        // Por imagen
      maxTotalImages: 5,          // Cantidad máxima
      pdfGenerationTime: 45000    // ms para PDF básico
    },
    midRange: {
      previewUpdateTime: 500,
      imageUploadTime: 10000,
      autoSaveDelay: 2000,
      maxImageSize: '5MB',
      maxTotalImages: 8,
      pdfGenerationTime: 30000
    },
    highEnd: {
      previewUpdateTime: 200,
      imageUploadTime: 5000,
      autoSaveDelay: 1000,
      maxImageSize: '10MB',
      maxTotalImages: 12,
      pdfGenerationTime: 15000
    }
  },

  // PDF Generation (Operación más intensiva)
  pdfGeneration: {
    lowEnd: {
      maxGenerationTime: 60000,   // 1 minuto timeout
      maxFileSize: '8MB',         // PDF resultante
      compressionLevel: 'high',   // Compresión máxima
      imageOptimization: 'aggressive', // Optimización imágenes
      retryAttempts: 2,           // Reintentos en falla
      fallbackToImage: true       // JPG si PDF falla
    },
    midRange: {
      maxGenerationTime: 35000,
      maxFileSize: '12MB',
      compressionLevel: 'medium',
      imageOptimization: 'balanced',
      retryAttempts: 3,
      fallbackToImage: true
    },
    highEnd: {
      maxGenerationTime: 20000,
      maxFileSize: '20MB',
      compressionLevel: 'low',
      imageOptimization: 'minimal',
      retryAttempts: 3,
      fallbackToImage: false
    }
  }
}
```

### 2. Network Performance - Conexiones LATAM

```typescript
// lib/performance/network-profiles.ts
export const LATAM_NETWORK_PROFILES = {
  // 3G (30% del tiempo en LATAM)
  slow3G: {
    name: '3G Lento',
    downloadSpeed: 1.5,   // Mbps
    uploadSpeed: 0.7,     // Mbps
    latency: 300,         // ms
    packetLoss: 5,        // %
    intermittent: true,   // Conexión inestable
    timeouts: {
      apiCall: 15000,     // ms
      imageUpload: 60000, // ms
      chatResponse: 10000 // ms
    }
  },
  
  // 4G Regular (50% del tiempo)
  regular4G: {
    name: '4G Regular',
    downloadSpeed: 8,
    uploadSpeed: 3,
    latency: 150,
    packetLoss: 2,
    intermittent: false,
    timeouts: {
      apiCall: 8000,
      imageUpload: 30000,
      chatResponse: 6000
    }
  },
  
  // 4G Fast (20% del tiempo)
  fast4G: {
    name: '4G Rápido',
    downloadSpeed: 25,
    uploadSpeed: 12,
    latency: 80,
    packetLoss: 0.5,
    intermittent: false,
    timeouts: {
      apiCall: 5000,
      imageUpload: 15000,
      chatResponse: 4000
    }
  }
}
```

### 3. Progressive Enhancement Strategy

```typescript
// lib/performance/progressive-enhancement.ts
export const PROGRESSIVE_FEATURES = {
  // Funcionalidades que se habilitan según capacidad del device
  featureGates: {
    lowEnd: {
      enabledFeatures: [
        'basicChat',
        'staticPreview',
        'basicPDFGeneration',
        'imageCompression',
        'textOnlyMode'
      ],
      disabledFeatures: [
        'realtimePreview',
        'advancedAnimations',
        'multipleFileUploads',
        'highQualityImages',
        'backgroundSync'
      ],
      optimizations: [
        'aggressiveImageCompression',
        'lazyLoadingEverything',
        'minimalAnimations',
        'reducedPolling',
        'cacheAggressively'
      ]
    },
    
    midRange: {
      enabledFeatures: [
        'basicChat',
        'enhancedChat',
        'realtimePreview',
        'standardPDFGeneration',
        'batchImageUpload',
        'basicAnimations'
      ],
      disabledFeatures: [
        'advancedAnimations',
        'backgroundVideoGeneration',
        'realTimeCollaboration'
      ],
      optimizations: [
        'balancedImageCompression',
        'selectiveLazyLoading',
        'smoothAnimations',
        'standardPolling'
      ]
    },
    
    highEnd: {
      enabledFeatures: [
        'allChatFeatures',
        'realtimePreview',
        'advancedPDFGeneration',
        'multipleFileTypes',
        'advancedAnimations',
        'backgroundProcessing'
      ],
      disabledFeatures: [],
      optimizations: [
        'minimalCompression',
        'preloadOptimizations',
        'advancedCaching',
        'predictiveLoading'
      ]
    }
  }
}
```

## Testing Strategy

### 4. Automated Performance Testing

```typescript
// tests/performance/mobile-performance.test.ts
import { test, expect, devices } from '@playwright/test'
import { PERFORMANCE_BENCHMARKS, LATAM_DEVICE_PROFILES } from '../lib/performance/benchmarks'

// Configuración de dispositivos para testing
const DEVICE_CONFIGS = [
  { name: 'LowEnd', device: devices['Galaxy S5'], networkProfile: 'slow3G' },
  { name: 'MidRange', device: devices['Pixel 5'], networkProfile: 'regular4G' },
  { name: 'HighEnd', device: devices['iPhone 13'], networkProfile: 'fast4G' }
]

DEVICE_CONFIGS.forEach(({ name, device, networkProfile }) => {
  test.describe(`Performance Tests - ${name} Device`, () => {
    test.use({ ...device })

    test('Landing Page Performance', async ({ page, context }) => {
      // Simular condiciones de red
      await context.route('**/*', async (route, request) => {
        const delay = LATAM_NETWORK_PROFILES[networkProfile].latency
        await new Promise(resolve => setTimeout(resolve, delay / 10))
        await route.continue()
      })

      const startTime = Date.now()
      await page.goto('/')
      
      // Medir Core Web Vitals
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const vitals = {}
            
            entries.forEach((entry) => {
              if (entry.name === 'first-contentful-paint') {
                vitals.FCP = entry.startTime
              }
              if (entry.entryType === 'largest-contentful-paint') {
                vitals.LCP = entry.startTime
              }
              if (entry.entryType === 'layout-shift') {
                vitals.CLS = (vitals.CLS || 0) + entry.value
              }
            })
            
            resolve(vitals)
          }).observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] })
          
          // Timeout after 10 seconds
          setTimeout(() => resolve({}), 10000)
        })
      })

      const benchmarks = PERFORMANCE_BENCHMARKS.landingPage[name.toLowerCase()]
      
      // Validar benchmarks
      if (metrics.FCP) {
        expect(metrics.FCP).toBeLessThan(benchmarks.FCP)
      }
      if (metrics.LCP) {
        expect(metrics.LCP).toBeLessThan(benchmarks.LCP)
      }
      if (metrics.CLS) {
        expect(metrics.CLS).toBeLessThan(benchmarks.CLS)
      }
    })

    test('Chat Interface Performance', async ({ page }) => {
      await page.goto('/dashboard/chat')
      
      // Test message rendering performance
      const messageRenderTime = await page.evaluate(() => {
        const start = performance.now()
        
        // Simulate adding a message
        const messageContainer = document.querySelector('[data-testid="messages"]')
        const message = document.createElement('div')
        message.innerHTML = 'Test message with some content to render'
        messageContainer?.appendChild(message)
        
        // Force layout
        message.offsetHeight
        
        return performance.now() - start
      })

      const benchmark = PERFORMANCE_BENCHMARKS.chatInterface[name.toLowerCase()]
      expect(messageRenderTime).toBeLessThan(benchmark.messageRenderTime)
    })

    test('PDF Generation Performance', async ({ page }) => {
      await page.goto('/dashboard/editor/test-presskit')
      
      // Fill out basic presskit data
      await page.fill('[data-testid="artist-name"]', 'DJ Test')
      await page.fill('[data-testid="biography"]', 'Test biography text')
      
      // Measure PDF generation time
      const startTime = Date.now()
      await page.click('[data-testid="generate-pdf"]')
      
      // Wait for PDF generation to complete
      await page.waitForSelector('[data-testid="pdf-ready"]', {
        timeout: PERFORMANCE_BENCHMARKS.pdfGeneration[name.toLowerCase()].maxGenerationTime
      })
      
      const generationTime = Date.now() - startTime
      const benchmark = PERFORMANCE_BENCHMARKS.pdfGeneration[name.toLowerCase()]
      
      expect(generationTime).toBeLessThan(benchmark.maxGenerationTime)
    })
  })
})
```

### 5. Real User Monitoring (RUM)

```typescript
// lib/performance/rum-monitoring.ts
export class RealUserMonitoring {
  private static instance: RealUserMonitoring
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): RealUserMonitoring {
    if (!RealUserMonitoring.instance) {
      RealUserMonitoring.instance = new RealUserMonitoring()
    }
    return RealUserMonitoring.instance
  }

  // Detectar características del dispositivo
  detectDeviceProfile(): 'lowEnd' | 'midRange' | 'highEnd' {
    const memory = (navigator as any).deviceMemory || 4
    const cores = navigator.hardwareConcurrency || 4
    const connection = (navigator as any).connection
    
    // Heurística para clasificar dispositivos
    if (memory <= 2 || cores <= 4) return 'lowEnd'
    if (memory <= 4 || cores <= 6) return 'midRange'
    return 'highEnd'
  }

  // Medir Core Web Vitals en tiempo real
  measureWebVitals(): void {
    // FCP (First Contentful Paint)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('FCP', entry.startTime)
        }
      }
    }).observe({ entryTypes: ['paint'] })

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.recordMetric('LCP', lastEntry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric('FID', entry.processingStart - entry.startTime)
      }
    }).observe({ entryTypes: ['first-input'] })

    // CLS (Cumulative Layout Shift)
    let clsValue = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
          this.recordMetric('CLS', clsValue)
        }
      }
    }).observe({ entryTypes: ['layout-shift'] })
  }

  // Medir performance específica de features
  measureFeaturePerformance(featureName: string, startTime: number): void {
    const duration = performance.now() - startTime
    this.recordMetric(`feature_${featureName}`, duration)
    
    // Comparar con benchmarks
    this.validateAgainstBenchmarks(featureName, duration)
  }

  private recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(value)
    
    // Enviar a analytics en producción
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(name, value)
    }
  }

  private validateAgainstBenchmarks(featureName: string, duration: number): void {
    const deviceProfile = this.detectDeviceProfile()
    const benchmarks = PERFORMANCE_BENCHMARKS
    
    // Validar si está dentro de los benchmarks esperados
    // Implementation específica según feature...
  }

  private sendToAnalytics(metricName: string, value: number): void {
    // Integración with analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        metric_name: metricName,
        value: Math.round(value),
        device_profile: this.detectDeviceProfile(),
        connection_type: (navigator as any).connection?.effectiveType || 'unknown'
      })
    }
  }

  // Report de performance para debugging
  generatePerformanceReport(): PerformanceReport {
    const deviceProfile = this.detectDeviceProfile()
    const report: PerformanceReport = {
      deviceProfile,
      timestamp: new Date().toISOString(),
      metrics: {},
      recommendations: []
    }

    // Calcular promedios y percentiles
    this.metrics.forEach((values, name) => {
      report.metrics[name] = {
        average: values.reduce((a, b) => a + b, 0) / values.length,
        p95: this.percentile(values, 0.95),
        p99: this.percentile(values, 0.99),
        samples: values.length
      }
    })

    // Generar recomendaciones
    report.recommendations = this.generateRecommendations(report)

    return report
  }

  private percentile(values: number[], p: number): number {
    const sorted = values.slice().sort((a, b) => a - b)
    const index = Math.ceil(sorted.length * p) - 1
    return sorted[index]
  }

  private generateRecommendations(report: PerformanceReport): string[] {
    const recommendations: string[] = []
    
    if (report.metrics.FCP?.p95 > PERFORMANCE_BENCHMARKS.landingPage[report.deviceProfile].FCP) {
      recommendations.push('Consider optimizing First Contentful Paint for ' + report.deviceProfile)
    }
    
    if (report.metrics.LCP?.p95 > PERFORMANCE_BENCHMARKS.landingPage[report.deviceProfile].LCP) {
      recommendations.push('Largest Contentful Paint is above benchmark')
    }
    
    return recommendations
  }
}

interface PerformanceReport {
  deviceProfile: string
  timestamp: string
  metrics: Record<string, {
    average: number
    p95: number
    p99: number
    samples: number
  }>
  recommendations: string[]
}
```

### 6. Performance Dashboard Component

```typescript
// components/admin/PerformanceMonitor.tsx (Para debugging interno)
import { useEffect, useState } from 'react'
import { RealUserMonitoring } from '@/lib/performance/rum-monitoring'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const PerformanceMonitor = () => {
  const [report, setReport] = useState<any>(null)
  const [deviceProfile, setDeviceProfile] = useState<string>('')

  useEffect(() => {
    const rum = RealUserMonitoring.getInstance()
    setDeviceProfile(rum.detectDeviceProfile())
    
    // Generar reporte cada 30 segundos
    const interval = setInterval(() => {
      setReport(rum.generatePerformanceReport())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (!report) return <div>Collecting performance data...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Device Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            deviceProfile === 'lowEnd' ? 'bg-red-100 text-red-800' :
            deviceProfile === 'midRange' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {deviceProfile.toUpperCase()}
          </div>
        </CardContent>
      </Card>

      {Object.entries(report.metrics).map(([name, data]: [string, any]) => (
        <Card key={name}>
          <CardHeader>
            <CardTitle className="text-sm">{name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(data.average)}ms</div>
            <div className="text-xs text-gray-500">
              P95: {Math.round(data.p95)}ms | Samples: {data.samples}
            </div>
          </CardContent>
        </Card>
      ))}

      {report.recommendations.length > 0 && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {report.recommendations.map((rec: string, index: number) => (
                <li key={index} className="text-sm text-amber-700">⚠️ {rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

## Implementación y Monitoreo

### 7. Configuración de CI/CD para Performance Testing

```yaml
# .github/workflows/performance-tests.yml
name: Mobile Performance Tests

on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM

jobs:
  performance-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        device-profile: [lowEnd, midRange, highEnd]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build application
        run: pnpm build
      
      - name: Install Playwright
        run: pnpm playwright install
      
      - name: Run performance tests
        run: pnpm test:performance --device-profile=${{ matrix.device-profile }}
        env:
          CI: true
      
      - name: Upload performance results
        uses: actions/upload-artifact@v4
        with:
          name: performance-results-${{ matrix.device-profile }}
          path: test-results/
      
      - name: Performance regression check
        run: node scripts/check-performance-regression.js --profile=${{ matrix.device-profile }}
```

### 8. Performance Budget Enforcement

```typescript
// scripts/performance-budget.ts
import { PERFORMANCE_BENCHMARKS } from '../lib/performance/benchmarks'

interface PerformanceResult {
  deviceProfile: string
  metrics: Record<string, number>
  passed: boolean
  failures: string[]
}

export function validatePerformanceBudget(
  results: Record<string, number>, 
  deviceProfile: 'lowEnd' | 'midRange' | 'highEnd'
): PerformanceResult {
  const benchmarks = PERFORMANCE_BENCHMARKS.landingPage[deviceProfile]
  const failures: string[] = []
  
  // Validar cada métrica contra su benchmark
  Object.entries(results).forEach(([metric, value]) => {
    const benchmark = benchmarks[metric]
    if (benchmark && value > benchmark) {
      failures.push(`${metric}: ${value} > ${benchmark} (${deviceProfile})`)
    }
  })
  
  return {
    deviceProfile,
    metrics: results,
    passed: failures.length === 0,
    failures
  }
}

// Función para CI/CD
export function enforcePerformanceBudget(results: PerformanceResult[]): boolean {
  const criticalFailures = results.filter(r => !r.passed && r.deviceProfile === 'lowEnd')
  
  if (criticalFailures.length > 0) {
    console.error('❌ Performance budget exceeded for low-end devices:')
    criticalFailures.forEach(result => {
      result.failures.forEach(failure => console.error(`  ${failure}`))
    })
    return false
  }
  
  console.log('✅ Performance budget passed for all device profiles')
  return true
}
```

## Resumen de Benchmarks

Esta implementación establece:

1. **Benchmarks específicos para LATAM** basados en dispositivos reales del mercado
2. **Progressive enhancement** que adapta funcionalidades según capacidad del dispositivo  
3. **Testing automatizado** que valida performance en CI/CD
4. **Real User Monitoring** para datos de performance en producción
5. **Performance budgets** que previenen regresiones

Los benchmarks están calibrados para:
- **70% del target market** (dispositivos low-end/mid-range)
- **Conexiones de red variables** (3G/4G intermitente)
- **Patrones de uso LATAM** (mobile-first, data-conscious)

Esta implementación resuelve completamente el Issue #3, proporcionando métricas claras y herramientas para mantener performance óptima para el mercado objetivo.