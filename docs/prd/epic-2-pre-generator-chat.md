# Epic 2: Pre-Generator Chat Interactivo - Brownfield Enhancement

## Epic Goal

Implementar una experiencia conversacional guiada que recopile información del artista de manera natural e intuitiva mediante un chat interactivo, permitiendo la transición fluida desde la recopilación de datos hasta el generador de presskits, transformando la experiencia de onboarding en un proceso conversacional que reduzca la fricción y aumente la completitud de los perfiles de artista.

## Epic Description

### Existing System Context:

- **Funcionalidad actual relevante:** Sistema de autenticación completo con perfiles de usuario básicos, dashboard funcional con navegación sidebar, infraestructura de UI components (Button, Input, Card)
- **Stack tecnológico:** Next.js 15 + TypeScript + Tailwind CSS v4, Supabase (PostgreSQL + Auth), Vercel hosting
- **Puntos de integración:** Dashboard existente, perfiles de usuario (user_profiles table), sistema de navegación con sidebar, AuthService y UserService

### Enhancement Details:

- **Lo que se está agregando:** Módulo de chat interactivo que guía al usuario a través de preguntas conversacionales para completar su perfil de artista con información específica para presskits (biografía, géneros, experiencia, redes sociales, enlaces musicales, contacto booking)
- **Cómo se integra:** Nueva ruta `/chat` accesible desde el dashboard, integración con UserService existente para actualizar perfiles, transición directa al futuro generador de presskits
- **Criterios de éxito:** 
  - Usuarios completan su perfil en menos de 5 minutos
  - Tasa de abandono menor al 20% durante el chat
  - 90%+ de usuarios tienen perfiles completos post-chat
  - Experiencia conversacional fluida y natural en español

## Stories

### 1. **Story 2.1: Infraestructura del Chat Interactivo**
Implementar la infraestructura base del chat con UI conversacional, estado de conversación, y flujo de navegación integrado al dashboard existente.

### 2. **Story 2.2: Motor Conversacional de Recopilación de Datos**
Desarrollar la lógica conversacional que guía al usuario a través de preguntas específicas para recopilar información del artista (biografía, géneros, experiencia, redes sociales, música, contacto).

### 3. **Story 2.3: Persistencia y Transición al Generador**
Implementar la persistencia de datos recopilados en el perfil de usuario existente y crear la transición fluida hacia el futuro generador de presskits.

## Compatibility Requirements

- [x] APIs de UserService existentes se mantienen sin cambios
- [x] Esquema de base de datos user_profiles se extiende de manera backward compatible
- [x] UI sigue patrones de design system ÍTERA existente (colores rojo #E53935, negro #181316)
- [x] Integración con AuthService y middleware de autenticación existente
- [x] Impacto mínimo en performance, carga lazy de componentes de chat

## Risk Mitigation

- **Riesgo Principal:** Complejidad del estado conversacional podría afectar performance del dashboard
- **Mitigación:** Implementar lazy loading del módulo de chat, gestión de estado localizada con React hooks, persistencia incremental en Supabase
- **Plan de Rollback:** Feature flag para deshabilitar módulo de chat, manteniendo funcionalidad de dashboard existente intacta

## Definition of Done

- [ ] Las 3 historias completadas con criterios de aceptación cumplidos
- [ ] Funcionalidad de dashboard y autenticación existente verificada sin regresiones
- [ ] Integración correcta con UserService y tabla user_profiles
- [ ] Documentación actualizada con nuevos endpoints y componentes
- [ ] Tests unitarios e integración para flujo conversacional
- [ ] Performance testing confirmando impacto mínimo (<200ms adicionales)

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-08-06 | 1.0 | Epic brownfield inicial para chat interactivo | John (PM) |

## Story Manager Handoff

"Please develop detailed user stories for this brownfield epic. Key considerations:

- This is an enhancement to an existing system running **Next.js 15 + TypeScript + Tailwind CSS v4 + Supabase**
- Integration points: 
  - **Dashboard existente** con sidebar navigation en `/dashboard`
  - **UserService** (`lib/services/user-service.ts`) para CRUD de perfiles
  - **Tabla user_profiles** en Supabase con campos existentes (artist_name, bio, social_media JSONB, etc.)
  - **AuthService y middleware** para protección de rutas
- Existing patterns to follow: 
  - **UI components** en `src/components/ui/` (Button, Input, Card)
  - **Layout patterns** con Header/Footer/Sidebar
  - **TypeScript estricto** con interfaces en `src/types/`
  - **Supabase client patterns** en `lib/supabase/`
- Critical compatibility requirements: 
  - **Mantener UserService APIs** existentes sin breaking changes
  - **Extender tabla user_profiles** de manera backward compatible
  - **Seguir design system ÍTERA** (rojo #E53935, negro #181316, grises cálidos)
  - **Lazy loading** del módulo de chat para performance
- Each story must include verification that existing functionality remains intact

The epic should maintain system integrity while delivering **experiencia conversacional guiada que recopila información del artista mediante chat interactivo, transformando el onboarding en un proceso natural que aumente la completitud de perfiles para presskits**."