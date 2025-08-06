# Technical Assumptions

## Repository Structure: Monorepo

Proyecto único con estructura modular clara, ideal para MVP y escalabilidad futura con múltiples módulos (Pre-Generator, PressKit Generator, Landing Builder).

## Service Architecture

**Arquitectura:** Full-stack serverless con Next.js basado en **Next.js Enterprise Boilerplate**
- Next.js 15 con App Router y TypeScript estricto
- Supabase como backend-as-a-service (auth, database, storage) 
- Funciones serverless para lógica de negocio (generación PDF, procesamiento imágenes)
- Arquitectura enterprise con testing, linting y performance optimizados
- Despliegue en Vercel con configuración de producción

## Testing Requirements

**Testing:** Unit + Integration + E2E (completo)
- Jest + React Testing Library para componentes y lógica
- Playwright para testing E2E automatizado con MCP integration
- ESLint 9 + Prettier para calidad de código
- Testing de performance con Lighthouse integrado
- Husky para git hooks y testing pre-commit
- Testing manual para UX/UI específica de creación de presskits

## Boilerplate Selection: Next.js Enterprise Boilerplate

**Justificación de selección:**
- ✅ **Next.js 15 + TypeScript:** Cumple requerimiento técnico exacto
- ✅ **Enterprise tooling:** Configuración completa de testing, linting, performance
- ✅ **Playwright integration:** MCP testing capabilities listas para usar
- ✅ **Production-ready:** 100/100 Lighthouse scores, monitoring integrado
- ✅ **Developer experience:** Configuración completa para equipos profesionales
- ✅ **Escalabilidad:** Arquitectura preparada para crecimiento empresarial

**Template:** https://github.com/Blazity/next-enterprise
**Deployment:** Vercel template disponible oficialmente

## Additional Technical Assumptions and Requests

• **Stack completo:** Next.js 15, TypeScript strict, Tailwind CSS v4, shadcn/ui, Radix UI
• **Base de datos:** Supabase PostgreSQL con Row Level Security y realtime subscriptions
• **Autenticación:** Supabase Auth con Google OAuth y email/password
• **Generación PDF:** react-pdf para layouts profesionales del presskit
• **Generación imágenes:** html2canvas para capturas de preview en tiempo real
• **Gestión estado:** Zustand para estado global mínimo (compatible con RSC)
• **Deploy:** Vercel con GitHub Actions CI/CD automático del boilerplate
• **Testing automation:** Playwright MCP integration para testing de flujos críticos
• **Performance:** OpenTelemetry monitoring incluido en el boilerplate
• **Code quality:** ESLint 9, Prettier, conventional commits enforced
• **Package manager:** pnpm para mejor performance y gestión de dependencias
• **File uploads:** Supabase Storage para imágenes de usuarios y assets
• **APIs externas:** Preparación para integración Mercado Pago SDK
• **Development workflow:** Hot reloading, Storybook para componentes, automated changelog
