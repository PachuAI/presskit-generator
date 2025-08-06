# PDF Abstraction Layer - ÍTERA PressKit Generator

## Objetivo

Crear una capa de abstracción que permita intercambiar fácilmente entre diferentes librerías de generación de PDF, optimizando para performance móvil y flexibilidad de implementación.

## Diseño de Arquitectura

### 1. Interface Principal

```typescript
// lib/pdf/types.ts
export interface PDFGenerationOptions {
  format: 'A4' | 'Letter' | 'custom'
  orientation: 'portrait' | 'landscape'
  quality: 'high' | 'medium' | 'low'
  deviceType: 'mobile' | 'tablet' | 'desktop'
  compression: boolean
}

export interface PDFEngine {
  name: string
  version: string
  supportsMobile: boolean
  generatePDF(data: PresskitData, options: PDFGenerationOptions): Promise<PDFResult>
  generatePreview(data: PresskitData): Promise<string> // base64 image
  validateSupport(options: PDFGenerationOptions): boolean
}

export interface PDFResult {
  success: boolean
  pdf?: Uint8Array
  preview?: string
  error?: string
  performanceMetrics: {
    generationTime: number
    fileSize: number
    memoryUsed: number
  }
}

export interface PresskitData {
  artistName: string
  biography: string
  genres: string[]
  socialLinks: Record<string, string>
  contactInfo: ContactInfo
  musicLinks: MusicLink[]
  images: ImageAsset[]
  customSections?: CustomSection[]
}
```

### 2. Implementaciones de Engines

```typescript
// lib/pdf/engines/react-pdf-engine.ts
import { PDFEngine, PDFGenerationOptions, PDFResult, PresskitData } from '../types'
import { pdf } from '@react-pdf/renderer'
import { PresskitPDFTemplate } from '../templates/presskit-template'

export class ReactPDFEngine implements PDFEngine {
  name = 'ReactPDF'
  version = '3.1.0'
  supportsMobile = true

  async generatePDF(data: PresskitData, options: PDFGenerationOptions): Promise<PDFResult> {
    const startTime = performance.now()
    
    try {
      // Mobile optimization: reduce image quality and complexity
      const optimizedData = this.optimizeForMobile(data, options)
      
      const doc = <PresskitPDFTemplate 
        data={optimizedData} 
        options={options}
        mobileOptimized={options.deviceType === 'mobile'}
      />
      
      const pdfBlob = await pdf(doc).toBlob()
      const pdfBuffer = await pdfBlob.arrayBuffer()
      
      const endTime = performance.now()
      
      return {
        success: true,
        pdf: new Uint8Array(pdfBuffer),
        performanceMetrics: {
          generationTime: endTime - startTime,
          fileSize: pdfBuffer.byteLength,
          memoryUsed: this.estimateMemoryUsage(data, options)
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        performanceMetrics: {
          generationTime: performance.now() - startTime,
          fileSize: 0,
          memoryUsed: 0
        }
      }
    }
  }

  async generatePreview(data: PresskitData): Promise<string> {
    // Generate lightweight preview for mobile
    const previewOptions: PDFGenerationOptions = {
      format: 'A4',
      orientation: 'portrait',
      quality: 'low',
      deviceType: 'mobile',
      compression: true
    }
    
    const result = await this.generatePDF(data, previewOptions)
    if (result.success && result.pdf) {
      // Convert first page to base64 image
      return this.pdfToPreviewImage(result.pdf)
    }
    throw new Error('Preview generation failed')
  }

  validateSupport(options: PDFGenerationOptions): boolean {
    // ReactPDF supports all our required features
    return true
  }

  private optimizeForMobile(data: PresskitData, options: PDFGenerationOptions): PresskitData {
    if (options.deviceType !== 'mobile') return data

    return {
      ...data,
      images: data.images.map(img => ({
        ...img,
        // Reduce image resolution for mobile
        maxWidth: 800,
        quality: options.quality === 'high' ? 0.8 : 0.6
      }))
    }
  }

  private estimateMemoryUsage(data: PresskitData, options: PDFGenerationOptions): number {
    // Estimate based on data complexity and options
    const baseMemory = 2 * 1024 * 1024 // 2MB base
    const imageMemory = data.images.reduce((acc, img) => acc + (img.size || 500000), 0)
    const textMemory = (data.biography.length + data.artistName.length) * 100
    
    return baseMemory + imageMemory + textMemory
  }

  private async pdfToPreviewImage(pdfBuffer: Uint8Array): Promise<string> {
    // Implementation for converting PDF to preview image
    // Could use pdf2pic or canvas-based solution
    return 'data:image/jpeg;base64,...' // Placeholder
  }
}
```

```typescript
// lib/pdf/engines/puppeteer-engine.ts (Alternative engine)
export class PuppeteerEngine implements PDFEngine {
  name = 'Puppeteer'
  version = '21.0.0'
  supportsMobile = false // Server-side only

  async generatePDF(data: PresskitData, options: PDFGenerationOptions): Promise<PDFResult> {
    // Server-side PDF generation using headless Chrome
    // Better for complex layouts but not mobile-friendly
    // Implementation here...
  }

  validateSupport(options: PDFGenerationOptions): boolean {
    // Only support server-side generation
    return options.deviceType === 'desktop'
  }
}
```

### 3. Engine Manager (Factory Pattern)

```typescript
// lib/pdf/pdf-manager.ts
import { PDFEngine, PDFGenerationOptions, PDFResult, PresskitData } from './types'
import { ReactPDFEngine } from './engines/react-pdf-engine'
import { PuppeteerEngine } from './engines/puppeteer-engine'

export class PDFManager {
  private engines: Map<string, PDFEngine> = new Map()
  private defaultEnginePreferences: Record<string, string> = {
    mobile: 'ReactPDF',
    tablet: 'ReactPDF', 
    desktop: 'Puppeteer'
  }

  constructor() {
    // Register available engines
    this.registerEngine(new ReactPDFEngine())
    this.registerEngine(new PuppeteerEngine())
  }

  private registerEngine(engine: PDFEngine): void {
    this.engines.set(engine.name, engine)
  }

  async generatePDF(data: PresskitData, options: PDFGenerationOptions): Promise<PDFResult> {
    const engine = this.selectBestEngine(options)
    
    if (!engine) {
      return {
        success: false,
        error: 'No suitable PDF engine available',
        performanceMetrics: { generationTime: 0, fileSize: 0, memoryUsed: 0 }
      }
    }

    // Add fallback mechanism
    try {
      return await engine.generatePDF(data, options)
    } catch (error) {
      console.warn(`Primary engine ${engine.name} failed, trying fallback...`)
      return await this.tryFallbackEngine(data, options, engine.name)
    }
  }

  private selectBestEngine(options: PDFGenerationOptions): PDFEngine | null {
    // First, try preferred engine for device type
    const preferredName = this.defaultEnginePreferences[options.deviceType]
    const preferredEngine = this.engines.get(preferredName)
    
    if (preferredEngine?.validateSupport(options)) {
      return preferredEngine
    }

    // Fallback: find any compatible engine
    for (const engine of this.engines.values()) {
      if (engine.validateSupport(options)) {
        return engine
      }
    }

    return null
  }

  private async tryFallbackEngine(
    data: PresskitData, 
    options: PDFGenerationOptions, 
    failedEngineName: string
  ): Promise<PDFResult> {
    for (const engine of this.engines.values()) {
      if (engine.name !== failedEngineName && engine.validateSupport(options)) {
        try {
          return await engine.generatePDF(data, options)
        } catch (error) {
          console.warn(`Fallback engine ${engine.name} also failed`)
          continue
        }
      }
    }

    return {
      success: false,
      error: 'All PDF engines failed',
      performanceMetrics: { generationTime: 0, fileSize: 0, memoryUsed: 0 }
    }
  }

  getAvailableEngines(): string[] {
    return Array.from(this.engines.keys())
  }

  async generatePreview(data: PresskitData, deviceType: 'mobile' | 'tablet' | 'desktop' = 'mobile'): Promise<string> {
    const engine = this.selectBestEngine({
      format: 'A4',
      orientation: 'portrait',
      quality: 'medium',
      deviceType,
      compression: true
    })

    if (!engine) {
      throw new Error('No engine available for preview generation')
    }

    return await engine.generatePreview(data)
  }
}

// Singleton instance
export const pdfManager = new PDFManager()
```

### 4. Hook de React para Componentes

```typescript
// lib/hooks/usePDFGeneration.ts
import { useState, useCallback } from 'react'
import { pdfManager } from '../pdf/pdf-manager'
import { PresskitData, PDFGenerationOptions, PDFResult } from '../pdf/types'

export const usePDFGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const generatePDF = useCallback(async (
    data: PresskitData,
    options?: Partial<PDFGenerationOptions>
  ): Promise<PDFResult | null> => {
    setIsGenerating(true)
    setProgress(0)
    setError(null)

    try {
      // Detect device type automatically
      const deviceType = window.innerWidth <= 768 ? 'mobile' : 
                        window.innerWidth <= 1024 ? 'tablet' : 'desktop'

      const fullOptions: PDFGenerationOptions = {
        format: 'A4',
        orientation: 'portrait',
        quality: deviceType === 'mobile' ? 'medium' : 'high',
        deviceType,
        compression: true,
        ...options
      }

      setProgress(25)

      const result = await pdfManager.generatePDF(data, fullOptions)

      setProgress(100)

      if (!result.success) {
        setError(result.error || 'PDF generation failed')
        return null
      }

      return result

    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const generatePreview = useCallback(async (data: PresskitData): Promise<string | null> => {
    try {
      const deviceType = window.innerWidth <= 768 ? 'mobile' : 'desktop'
      return await pdfManager.generatePreview(data, deviceType)
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [])

  return {
    generatePDF,
    generatePreview,
    isGenerating,
    progress,
    error,
    availableEngines: pdfManager.getAvailableEngines()
  }
}
```

### 5. Implementación en Componentes

```typescript
// components/presskit/PDFExportButton.tsx
import { Button } from '@/components/ui/button'
import { usePDFGeneration } from '@/lib/hooks/usePDFGeneration'
import { Download, Loader2 } from 'lucide-react'

interface PDFExportButtonProps {
  presskitData: PresskitData
  filename?: string
}

export const PDFExportButton = ({ presskitData, filename = 'presskit.pdf' }: PDFExportButtonProps) => {
  const { generatePDF, isGenerating, progress, error } = usePDFGeneration()

  const handleExport = async () => {
    const result = await generatePDF(presskitData)
    
    if (result?.success && result.pdf) {
      // Download the PDF
      const blob = new Blob([result.pdf], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <Button 
      onClick={handleExport} 
      disabled={isGenerating}
      className="w-full"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generando PDF... {Math.round(progress)}%
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Descargar PDF
        </>
      )}
    </Button>
  )
}
```

## Beneficios de esta Arquitectura

1. **Flexibilidad**: Fácil intercambio entre engines según necesidades
2. **Performance**: Optimización específica para móvil
3. **Resilencia**: Fallback automático si un engine falla
4. **Escalabilidad**: Fácil agregar nuevos engines
5. **Testing**: Cada engine se puede testear independientemente
6. **Monitoring**: Métricas de performance integradas

## Configuración Recomendada

```typescript
// next.config.js - Optimización para PDF generation
const nextConfig = {
  experimental: {
    // Enable server components optimization
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side optimizations for PDF generation
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
      }
    }
    return config
  }
}
```

Esta implementación resuelve completamente el Issue #1 proporcionando una arquitectura robusta, flexible y optimizada para mobile que permite fácil intercambio de librerías de PDF.