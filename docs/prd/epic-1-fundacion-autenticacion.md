# Epic 1: Fundación & Autenticación Core - Brownfield Enhancement

## Epic Goal

Establecer la infraestructura base del proyecto ÍTERA PressKit Generator con sistema de autenticación completo, landing page profesional con branding ÍTERA (naranja intenso + dark theme), y dashboard inicial, creando una base sólida enterprise-grade que permita a DJs y artistas registrarse de forma segura y acceder a un MVP navegable desde día uno.

## Epic Description

### Project Context:

- **Proyecto nuevo:** ÍTERA PressKit Generator - Plataforma para que DJs y artistas creen presskits profesionales
- **Stack tecnológico:** Next.js 15 + TypeScript + Tailwind CSS v4, Supabase (PostgreSQL + Auth), Vercel hosting
- **Objetivo inicial:** MVP funcional con sistema de usuarios completo y branding distintivo

### Enhancement Details:

- **Lo que se está creando:** Sistema completo desde cero con infraestructura enterprise, autenticación multi-proveedor, landing page impactante con branding ÍTERA, dashboard con navegación intuitiva, y base de datos optimizada para artistas musicales
- **Branding ÍTERA:** Naranja intenso como color primario (#FF6B35), layout estilo oscuro con negros (#0F0F0F), grises oscuros (#1A1A1A, #2D2D2D), y acentos blancos (#FFFFFF) para contraste y legibilidad
- **Criterios de éxito:** 
  - Infraestructura enterprise escalable y mantenible
  - Onboarding fluido en menos de 2 minutos
  - Branding impactante que transmita vanguardia tecnológica
  - Performance optimizada (Lighthouse 95+)
  - Base sólida para épicas posteriores

## Stories

### 1. **Story 1.1: Infraestructura Enterprise y Configuración Base**
Configurar la infraestructura base del proyecto usando Next.js Enterprise Boilerplate con stack moderno, configuración de desarrollo, testing, y deployment automático en Vercel.

### 2. **Story 1.2: Sistema de Autenticación Completo**
Implementar sistema de autenticación robusto con Supabase Auth, soporte para Google OAuth y email/password, con manejo seguro de sesiones y middleware de protección.

### 3. **Story 1.3: Base de Datos y Modelos de Usuario**
Diseñar e implementar esquema de base de datos optimizado para artistas musicales con perfiles enriquecidos, Row Level Security, y triggers automáticos.

### 4. **Story 1.4: Landing Page con Branding ÍTERA**
Crear landing page profesional e impactante con branding ÍTERA distintivo (naranja intenso + dark theme), CTAs efectivos, y diseño que transmita vanguardia tecnológica.

### 5. **Story 1.5: Dashboard Inicial y Navegación**
Implementar dashboard base con navegación sidebar intuitiva, layout responsivo, y preparación para módulos futuros, manteniendo el dark theme de ÍTERA.

## Compatibility Requirements

- [x] Proyecto nuevo - sin compatibilidad backwards requerida
- [x] UI sigue design system ÍTERA (naranja intenso #FF6B35, dark theme con negros y grises oscuros)
- [x] Arquitectura modular para facilitar extensiones futuras
- [x] APIs diseñadas con versionado para estabilidad futura
- [x] Performance optimizada desde el inicio (Lighthouse 95+)
- [x] Responsive design mobile-first completamente funcional

## Risk Mitigation

- **Riesgo Principal:** Configuración enterprise compleja podría retrasar el desarrollo inicial
- **Mitigación:** 
  - Usar Next.js Enterprise Boilerplate para acelerar configuración
  - Documentación detallada de cada paso de setup
  - Testing automatizado desde el primer commit
  - Deploy continuo configurado desde el inicio
- **Plan de Rollback:** Versionado git granular permite rollback a cualquier punto estable

## Definition of Done

- [ ] Las 5 historias completadas con criterios de aceptación cumplidos
- [ ] Infraestructura enterprise completamente configurada y funcional
- [ ] Sistema de autenticación robusto con múltiples proveedores
- [ ] Landing page profesional con branding ÍTERA correcto implementado
- [ ] Dashboard básico funcional con navegación preparada para expansión
- [ ] Base de datos optimizada con RLS y esquemas para artistas
- [ ] Testing coverage ≥80% implementado desde el inicio
- [ ] Performance Lighthouse ≥95 en todas las páginas principales

## Technical Architecture

### Infrastructure Requirements:
- **Next.js Enterprise Boilerplate** - Base con mejores prácticas enterprise
- **Stack completo:** Next.js 15, TypeScript estricto, Tailwind CSS v4
- **Testing framework:** Jest + React Testing Library + Playwright
- **Code quality:** ESLint 9 + Prettier con configuración enterprise
- **CI/CD:** GitHub Actions + Vercel deployment automático

### Authentication System Design:
- **Supabase Auth** configurado con Google OAuth y email/password
- **Row Level Security (RLS)** implementado en todas las tablas
- **AuthService** centralizado en `lib/auth/auth-service.ts`
- **UserService** para CRUD de perfiles en `lib/services/user-service.ts`
- **Middleware** de protección de rutas en `src/middleware.ts`

### Database Schema Design:
```sql
-- Tabla principal de perfiles de artistas
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    artist_name TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    subscription_status TEXT NOT NULL DEFAULT 'free',
    presskit_limit INTEGER NOT NULL DEFAULT 3,
    social_media JSONB DEFAULT '{}',
    contact_email TEXT,
    phone TEXT,
    location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = auth_user_id);
```

### ÍTERA Design System Specifications:

#### Color Palette:
- **Primario:** Naranja intenso (#FF6B35) - CTAs, enlaces, elementos interactivos
- **Background:** Negro profundo (#0F0F0F) - Fondo principal
- **Superficies:** Gris oscuro (#1A1A1A) - Cards, modales, paneles
- **Borders:** Gris medio (#2D2D2D) - Separadores, bordes sutiles  
- **Texto:** Blanco (#FFFFFF) - Texto principal
- **Texto secundario:** Gris claro (#A0A0A0) - Texto de apoyo

#### Typography:
- **Headings:** Inter Bold - Títulos impactantes
- **Body:** Inter Regular - Texto de contenido  
- **Code:** JetBrains Mono - Elementos técnicos

#### Component Variants:
- **Buttons:** 
  - Primary: Naranja intenso con hover effects
  - Secondary: Outline naranja sobre dark background
  - Ghost: Texto naranja sin background
- **Inputs:** Dark background con border naranja al focus
- **Cards:** Gris oscuro con subtle border y hover effects

### Component Architecture:
```
src/components/
├── ui/
│   ├── Button.tsx        // Variantes ÍTERA
│   ├── Input.tsx         // Dark theme inputs
│   ├── Card.tsx          // Dark surface cards
│   └── index.ts          // Barrel exports
├── layout/
│   ├── Header.tsx        // Navigation con branding
│   ├── Footer.tsx        // Footer minimalista
│   └── Sidebar.tsx       // Dashboard navigation
└── auth/
    ├── LoginForm.tsx     // Form con dark theme
    ├── RegisterForm.tsx  // Form con Google OAuth
    └── AuthLayout.tsx    // Layout para auth pages
```

### Page Structure:
- **Landing page:** `/` - Impacto visual con branding ÍTERA
- **Auth pages:** `/login`, `/register` - Dark theme consistente
- **Dashboard:** `/dashboard` - Base con sidebar navigation
- **Auth callback:** `/auth/callback` - Manejo OAuth

## User Experience Design

### Landing Page Requirements:
- **Hero Section:** Impacto visual inmediato con naranja intenso
- **Value Proposition:** Claro para DJs y artistas
- **Social Proof:** Testimoniales o casos de uso
- **CTAs:** Registro prominente con naranja intenso
- **Dark Theme:** Toda la página siguiendo el branding oscuro

### Authentication Flow:
- **Registration:** Email/password + Google OAuth options
- **Login:** Múltiples opciones con UX fluida
- **Post-auth:** Redirección automática al dashboard
- **Error Handling:** Mensajes claros en español

### Dashboard Initial State:
- **Welcome Message:** Onboarding amigable
- **Navigation Sidebar:** Preparado para módulos futuros
- **Profile Preview:** Información básica del usuario
- **Empty States:** Placeholders para funcionalidades futuras

## Performance & SEO

### Performance Targets:
- **Lighthouse Score:** ≥95 en todas las métricas
- **First Contentful Paint:** <1.5s
- **Largest Contentful Paint:** <2.5s
- **Time to Interactive:** <3s

### SEO Optimization:
- **Meta tags:** Optimizados para búsquedas de música/DJ
- **Schema markup:** Artist/Organization structured data
- **Spanish content:** Todo el contenido en español
- **Social sharing:** Open Graph optimizado

## Testing Strategy

### Unit Testing:
- **AuthService:** Cobertura completa de autenticación
- **UserService:** CRUD operations y validaciones
- **Components:** UI components con múltiples variantes

### Integration Testing:
- **Auth Flow:** Registro, login, logout completo
- **Database:** CRUD operations con RLS
- **API Routes:** Endpoints de autenticación

### E2E Testing:
- **User Journey:** Registro → Login → Dashboard
- **Responsive:** Testing en móvil y desktop
- **Performance:** Lighthouse CI en pipeline

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-08-06 | 1.0 | Epic inicial con 5 historias y branding ÍTERA correcto | John (PM) |

## Story Manager Handoff

"Please develop detailed user stories for this foundational epic. Key considerations:

- This is a **greenfield project** - building from scratch with enterprise standards
- Brand requirements: 
  - **ÍTERA branding:** Naranja intenso (#FF6B35) como color primario
  - **Dark theme:** Layout oscuro con negros, grises oscuros, acentos blancos
  - **Vanguardia tecnológica:** Diseño que transmita innovación
- Technical foundation needed:
  - **Next.js Enterprise Boilerplate** para acelerar desarrollo
  - **Supabase** para backend completo (auth + database)
  - **TypeScript estricto** desde el primer día
  - **Testing comprehensive** desde el inicio
- User focus: 
  - **DJs y artistas musicales** como usuarios principales
  - **Español como idioma** principal (Argentina/LATAM)
  - **Onboarding fluido** en menos de 2 minutos
- Future-proofing:
  - **Arquitectura modular** para épicas posteriores
  - **Performance optimizada** para escalabilidad
  - **APIs versionadas** para estabilidad

Each story should be **implementable independently** while building towards the complete foundation. The epic should deliver a **professional MVP** that artistas can register, login, and navigate, ready for chat and presskit functionality."