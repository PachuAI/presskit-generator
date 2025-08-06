# DEBUGGEANDO 🚀

## Deployment Exitoso en Vercel - Lecciones Aprendidas

Este documento captura todo lo aprendido durante nuestro primer deployment exitoso a Vercel después de múltiples intentos fallidos. Es una guía de supervivencia para futuros proyectos con Next.js + Supabase + Vercel.

---

## 🚨 PROBLEMAS CRÍTICOS Y SOLUCIONES

### 1. React 19 - NO USAR EN PRODUCCIÓN ❌

**Problema:**
- React 19.1.1 genera conflictos de peer dependencies con muchas librerías
- @testing-library/react, @vercel/otel y otras no son compatibles
- npm ERR EOVERRIDE al intentar resolverlo con overrides

**Solución Definitiva:**
```json
// package.json
{
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
```

**⚠️ IMPORTANTE:** Para futuros proyectos, SIEMPRE usar React 18.x hasta que React 19 tenga soporte completo del ecosistema.

---

### 2. Gestor de Paquetes - Usar PNPM 📦

**Problema:**
- npm install con --legacy-peer-deps reinyecta conflictos en Vercel
- npm tiene problemas con la resolución de dependencias complejas

**Solución:**
1. Crear `vercel.json`:
```json
{
  "installCommand": "pnpm install",
  "buildCommand": "pnpm run build"
}
```

2. En Vercel Dashboard → Settings → General:
   - Install Command: `pnpm install`
   - Build Command: `pnpm run build`

**Beneficios de PNPM:**
- Mejor manejo de peer dependencies
- Instalaciones más rápidas
- Menor uso de espacio en disco

---

### 3. OpenTelemetry - Sincronización de Versiones 🔄

**Problema:**
- @vercel/otel requiere @opentelemetry/* ≥ 1.19
- Conflictos entre diferentes versiones de paquetes OpenTelemetry

**Solución:**
```json
// package.json
{
  "dependencies": {
    "@opentelemetry/api": "1.20.0",
    "@opentelemetry/auto-instrumentations-node": "0.51.2",
    "@opentelemetry/exporter-trace-otlp-http": "0.46.0",
    "@opentelemetry/instrumentation": "0.46.0",
    "@opentelemetry/resources": "1.20.0",
    "@opentelemetry/semantic-conventions": "1.20.0"
  }
}
```

**Nota:** Mantener todas las versiones sincronizadas en 1.20.0 (excepto auto-instrumentations y SDK).

---

### 4. NO USAR "overrides" en package.json ⛔

**Problema:**
- Los overrides causan npm ERR EOVERRIDE en Vercel
- Rompen el proceso de build aunque funcionen localmente

**Solución:**
- Resolver conflictos actualizando/downgradeando dependencias directas
- NO usar overrides para forzar versiones

---

### 5. Errores de TypeScript Comunes 🔧

#### A. Tipos de Usuario - AuthUser vs User
**Problema:**
```typescript
Type error: Type 'AuthUser | null' is not assignable to type 'User | null'.
Type 'AuthUser' is missing the following properties from type 'User': app_metadata, aud, created_at
```

**Solución:**
- Crear tipos propios en lugar de usar los de Supabase directamente
- Definir `AuthUser` con solo los campos necesarios:

```typescript
// src/types/auth.ts
export interface AuthUser {
  id: string
  email?: string
  user_metadata?: {
    artist_name?: string
    full_name?: string
    avatar_url?: string
  }
}
```

#### B. Supabase v2 - Métodos Obsoletos
**Problema:**
```typescript
Property 'raw' does not exist on type 'SupabaseClient'
```

**Solución:**
- Usar RPC functions en lugar de .raw():
```typescript
// ❌ Antiguo (Supabase v1)
.update({ view_count: supabase.raw('view_count + 1') })

// ✅ Nuevo (Supabase v2)
await supabase.rpc('increment_view_count', { presskit_id: pressskitId })
```

#### C. Cookies en Server Components
**Problema:**
```typescript
Property 'getAll' does not exist on type 'Promise<ReadonlyRequestCookies>'
```

**Solución temporal:**
- Usar createBrowserClient en ambos lados (client y server)
- Para producción real, investigar configuración correcta de SSR

---

### 6. Variables de Entorno de Supabase 🔑

**SIEMPRE configurar estas 3 variables en Vercel:**

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Encontrar en: Supabase Dashboard → Settings → API → Project URL
   - Ejemplo: `https://lbkdaoummgyfkdlwvdlf.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Encontrar en: Supabase Dashboard → Settings → API → anon public
   - Es una JWT larga que empieza con `eyJ...`

3. **NEXT_PUBLIC_APP_URL**
   - Tu URL de Vercel: `https://tu-proyecto.vercel.app`
   - O dominio personalizado si lo configuraste

---

### 7. Configuración Específica de Vercel ⚙️

**Framework Preset:** Next.js (auto-detectado)

**Node.js Version:** 20.x

**Environment Variables:**
- Agregar en Settings → Environment Variables
- NO commitear el .env.local al repositorio
- Usar .env.local.example como plantilla

**Build & Development Settings:**
- Output Directory: `.next` (default)
- Install Command: `pnpm install`
- Build Command: `pnpm run build`
- Development Command: `pnpm run dev`

---

## 📋 CHECKLIST PARA NUEVO PROYECTO

### Antes de empezar:
- [ ] Usar React 18.3.1, NO React 19
- [ ] Inicializar con pnpm desde el principio
- [ ] Crear proyecto en Supabase y obtener credenciales
- [ ] Configurar TypeScript en modo strict

### Durante el desarrollo:
- [ ] Definir tipos propios (AuthUser) en lugar de usar tipos de librerías externas
- [ ] Usar métodos actualizados de Supabase v2
- [ ] NO usar overrides en package.json
- [ ] Mantener versiones de OpenTelemetry sincronizadas

### Antes de deployar:
- [ ] Crear vercel.json con comandos de pnpm
- [ ] Configurar las 3 variables de entorno en Vercel
- [ ] Verificar que `npm run build` funcione localmente
- [ ] Asegurar que no hay imports de archivos que no existen

---

## 🎯 RESUMEN EJECUTIVO

**Stack Ganador para Vercel + Supabase:**
- Next.js 15.x
- React 18.3.1 (NO React 19)
- TypeScript 5.3+
- Supabase v2 con @supabase/ssr
- PNPM como gestor de paquetes
- Tailwind CSS
- Radix UI para componentes

**Configuración que SIEMPRE funciona:**
1. React 18, no 19
2. PNPM, no npm
3. No usar overrides
4. Definir tipos propios
5. Configurar las 3 variables de entorno

---

## 🙏 NOTA FINAL

Después de horas de debugging y múltiples intentos fallidos, esta configuración finalmente funcionó. Este documento es el resultado de ese sufrimiento convertido en conocimiento. Úsalo sabiamente para tus próximos proyectos.

**Fecha del primer deploy exitoso:** Enero 2025

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>