# Epic 3: PressKit Generator Completo - Brownfield Enhancement

## Epic Goal

Crear el generador de presskits con preview en tiempo real, capacidades de edición, y exportación PDF/imagen con landing pages públicos para compartir presskits, transformando la información recopilada del chat interactivo en presskits profesionales visualmente impactantes que los artistas puedan usar inmediatamente para promocionarse.

## Epic Description

### Existing System Context:

- **Funcionalidad actual relevante:** Sistema de autenticación completo, perfiles de usuario enriquecidos con información del chat interactivo (biografía, géneros, redes sociales, enlaces musicales), dashboard con navegación, UI components establecidos
- **Stack tecnológico:** Next.js 15 + TypeScript + Tailwind CSS v4, Supabase (PostgreSQL + Auth + Storage), Vercel hosting
- **Puntos de integración:** Dashboard existente, perfiles de usuario completos post-chat, sistema de navegación, AuthService y UserService, posible integración con Supabase Storage para assets

### Enhancement Details:

- **Lo que se está agregando:** Motor de generación de presskits con templates profesionales, editor visual con preview en tiempo real, sistema de exportación PDF/imagen usando react-pdf y html2canvas, landing pages públicas con URLs únicas (/p/[slug]) para compartir presskits
- **Cómo se integra:** Nueva ruta `/generator` accesible desde dashboard, integración con UserService para datos de perfil, nuevo servicio PressskitService para CRUD, Supabase Storage para assets generados
- **Criterios de éxito:** 
  - Usuarios crean su primer presskit en menos de 3 minutos
  - Preview en tiempo real sin lag perceptible (<300ms)
  - Exportación PDF de calidad profesional en menos de 10 segundos
  - Landing pages públicas cargan en menos de 2 segundos
  - 95%+ de usuarios satisfechos con calidad visual del presskit

## Stories

### 1. **Story 3.1: Motor de Templates y Preview en Tiempo Real**
Implementar el sistema de templates de presskits con diseños profesionales y preview visual que se actualiza en tiempo real mientras el usuario edita el contenido.

### 2. **Story 3.2: Sistema de Exportación PDF/Imagen**
Desarrollar la funcionalidad de exportación usando react-pdf y html2canvas para generar PDFs e imágenes de alta calidad con diseño profesional.

### 3. **Story 3.3: Landing Pages Públicas para Compartir**
Crear el sistema de landing pages públicas con URLs únicas (/p/[slug]) que permitan a los artistas compartir sus presskits en redes sociales y con bookers.

## Compatibility Requirements

- [x] APIs de UserService existentes se mantienen sin cambios
- [x] Esquema de base de datos se extiende con tabla presskits de manera backward compatible
- [x] UI sigue design system ÍTERA existente (rojo #E53935, negro #181316)
- [x] Integración con AuthService y middleware de autenticación existente
- [x] Performance optimizada con lazy loading y optimización de imágenes
- [x] Supabase Storage integrado para assets sin afectar arquitectura existente

## Risk Mitigation

- **Riesgo Principal:** Generación de PDFs podría ser pesada computacionalmente y afectar performance
- **Mitigación:** 
  - Implementar generación asíncrona en background con loading states
  - Usar Vercel Edge Functions para procesamiento optimizado
  - Cache inteligente de templates y assets
  - Compresión de imágenes automática
- **Plan de Rollback:** Feature flag para deshabilitar generador, mantener funcionalidades de chat y dashboard intactas

## Definition of Done

- [ ] Las 3 historias completadas con criterios de aceptación cumplidos
- [ ] Funcionalidad existente (auth, chat, dashboard) verificada sin regresiones
- [ ] Integración correcta con UserService y nuevos servicios (PressskitService)
- [ ] Base de datos extendida con tabla presskits y relaciones apropiadas
- [ ] Tests unitarios e integración para generación y exportación
- [ ] Performance testing confirmando tiempos de generación <10s
- [ ] Landing pages públicas funcionando con SEO optimizado

## Database Extensions Required

```sql
-- Nueva tabla presskits
CREATE TABLE presskits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    template_id TEXT NOT NULL,
    content JSONB NOT NULL, -- Datos estructurados del presskit
    cover_image_url TEXT,
    pdf_url TEXT,
    is_public BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_presskits_user_id ON presskits(user_id);
CREATE INDEX idx_presskits_slug ON presskits(slug);
CREATE UNIQUE INDEX idx_presskits_user_slug ON presskits(user_id, slug);
```

## Technical Architecture

### New Services Required:
- **PressskitService** - CRUD operations para presskits
- **TemplateService** - Gestión de templates y rendering
- **ExportService** - Generación PDF/imagen con optimizaciones
- **SlugService** - Generación y validación de URLs únicas

### Component Architecture:
```
src/components/presskit/
├── generator/
│   ├── PressskitEditor.tsx
│   ├── TemplateSelector.tsx
│   └── PreviewPanel.tsx
├── templates/
│   ├── Template1.tsx
│   ├── Template2.tsx
│   └── TemplateBase.tsx
└── public/
    ├── PublicPresskit.tsx
    └── ShareButtons.tsx
```

### API Endpoints:
- `GET /api/presskits` - Listar presskits del usuario
- `POST /api/presskits` - Crear nuevo presskit
- `PUT /api/presskits/[id]` - Actualizar presskit
- `POST /api/presskits/[id]/export` - Generar PDF/imagen
- `GET /p/[slug]` - Landing page pública del presskit

## Integration Points

### With Existing System:
- **Dashboard:** Nueva sección "Mis Presskits" en sidebar
- **User Profiles:** Usar datos del chat para pre-llenar templates
- **AuthService:** Protección de rutas del generador
- **Supabase Storage:** Almacenamiento de PDFs e imágenes generadas

### External Dependencies:
- **react-pdf:** Para generación de PDFs profesionales
- **html2canvas:** Para captura de imágenes de alta resolución  
- **Vercel Edge Functions:** Para procesamiento optimizado
- **Supabase Storage:** Para hosting de assets generados

## Performance Considerations

### Optimization Strategies:
- **Template caching:** Templates pre-renderizados en build time
- **Lazy loading:** Componentes del editor cargados bajo demanda
- **Image optimization:** Compresión automática de imágenes subidas
- **Background generation:** PDFs generados asincrónicamente
- **CDN integration:** Assets servidos via Vercel CDN

### Performance Targets:
- Preview updates: <300ms response time
- PDF generation: <10s end-to-end
- Public landing pages: <2s load time
- Template switching: <500ms transition

## SEO & Sharing Features

### Public Landing Pages:
- **Meta tags dinámicos** para cada presskit
- **Open Graph optimization** para redes sociales
- **Structured data** para mejor indexación
- **Mobile-first responsive** design
- **Fast loading** con optimizaciones Vercel

### Social Sharing:
- **Share buttons** para todas las redes principales
- **Custom preview images** para cada presskit
- **Direct download links** para PDFs
- **Analytics tracking** de views y shares

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-08-06 | 1.0 | Epic brownfield inicial para generador de presskits | John (PM) |

## Story Manager Handoff

"Please develop detailed user stories for this brownfield epic. Key considerations:

- This is an enhancement building on existing system with **completed auth + chat functionality**
- Integration points: 
  - **User profiles completos** con datos del chat interactivo
  - **Dashboard existente** que debe incluir nueva sección "Mis Presskits"
  - **UserService** existente para datos de usuario
  - **Supabase Storage** para assets generados (PDFs, imágenes)
- Existing patterns to follow: 
  - **UI components** existentes en `src/components/ui/`
  - **Service pattern** similar a AuthService y UserService
  - **TypeScript interfaces** en `src/types/`
  - **API routes** pattern de Next.js
- Critical technical requirements: 
  - **Performance optimization** - Preview en tiempo real <300ms
  - **Async PDF generation** - Background processing con loading states
  - **SEO optimization** para landing pages públicas
  - **Mobile-first design** para templates y público
- New services needed:
  - **PressskitService** para CRUD operations
  - **ExportService** para PDF/imagen generation
  - **TemplateService** para template management
- Each story must include verification that existing functionality remains intact

The epic should deliver **generador profesional de presskits con preview en tiempo real y landing pages públicas compartibles** while maintaining system integrity."