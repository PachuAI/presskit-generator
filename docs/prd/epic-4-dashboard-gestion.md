# Epic 4: Dashboard & Gestión de Usuario - Brownfield Enhancement

## Epic Goal

Proporcionar interfaz completa de gestión donde usuarios pueden administrar sus presskits, perfil y configuraciones con analytics básicos, transformando el dashboard básico existente en un centro de control completo tipo CRM que permita a los artistas gestionar toda su presencia digital desde una sola plataforma.

## Epic Description

### Existing System Context:

- **Funcionalidad actual relevante:** Dashboard básico con sidebar, sistema de autenticación completo, perfiles de usuario enriquecidos, presskits creados y landing pages públicas funcionando, UI components establecidos
- **Stack tecnológico:** Next.js 15 + TypeScript + Tailwind CSS v4, Supabase (PostgreSQL + Auth + Storage), Vercel hosting
- **Puntos de integración:** Dashboard existente con sidebar navigation, UserService y PressskitService, tabla presskits con datos de analytics, sistema de autenticación robusto

### Enhancement Details:

- **Lo que se está agregando:** Dashboard avanzado tipo CRM con gestión completa de presskits, editor de perfil avanzado con preview, analytics de views y shares, sistema de configuraciones de usuario, gestión de assets y archivos, módulo "Landing Page Builder" como placeholder para futuras funcionalidades
- **Cómo se integra:** Extiende dashboard existente agregando nuevas secciones al sidebar, integra con todos los servicios existentes, añade nuevas vistas y funcionalidades avanzadas
- **Criterios de éxito:** 
  - Usuarios pueden gestionar todos sus presskits desde una interfaz intuitiva
  - Analytics básicos muestran performance de presskits (views, shares)
  - Editor de perfil permite actualización completa con preview inmediato
  - Tiempo de carga del dashboard <2s incluso con múltiples presskits
  - 90%+ de usuarios encuentran todas las funciones fácilmente

## Stories

### 1. **Story 4.1: Dashboard Avanzado y Gestión de Presskits**
Extender el dashboard existente con gestión completa de presskits (listar, editar, duplicar, eliminar, analytics básicos) y navegación mejorada tipo CRM.

### 2. **Story 4.2: Editor de Perfil Avanzado y Configuraciones**
Implementar editor completo del perfil de usuario con preview en tiempo real, gestión de assets personales, y panel de configuraciones de cuenta.

### 3. **Story 4.3: Analytics y Módulos Futuros (Landing Page Builder Placeholder)**
Crear sistema de analytics para tracking de performance de presskits y implementar módulo "Landing Page Builder" como placeholder "Próximamente" para futuras expansiones.

## Compatibility Requirements

- [x] Dashboard existente se extiende sin breaking changes
- [x] Todos los servicios existentes (Auth, User, Presskit) se mantienen intactos
- [x] UI components existentes se reutilizan y extienden
- [x] Esquema de base de datos se extiende para analytics sin afectar funcionalidad actual
- [x] Performance optimizada con paginación y lazy loading
- [x] Responsive design mantenido para todas las nuevas vistas

## Risk Mitigation

- **Riesgo Principal:** Dashboard sobrecargado podría volverse lento con múltiples presskits y analytics
- **Mitigación:** 
  - Implementar paginación inteligente y virtualización
  - Lazy loading de componentes pesados
  - Cache inteligente de datos de analytics
  - Optimistic updates para mejor UX
- **Plan de Rollback:** Feature flags por módulo, permitiendo rollback granular sin afectar funcionalidades core

## Definition of Done

- [ ] Las 3 historias completadas con criterios de aceptación cumplidos
- [ ] Toda funcionalidad existente verificada sin regresiones
- [ ] Performance del dashboard optimizada (<2s load time)
- [ ] Analytics básicos funcionando correctamente
- [ ] Editor de perfil con preview en tiempo real
- [ ] Tests unitarios e integración para nuevas funcionalidades
- [ ] Documentación actualizada para todas las nuevas características

## Database Extensions Required

```sql
-- Tabla para tracking de analytics
CREATE TABLE presskit_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    presskit_id UUID REFERENCES presskits(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'view', 'share', 'download'
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla para configuraciones de usuario
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'light', -- 'light', 'dark'
    language TEXT DEFAULT 'es',
    email_notifications BOOLEAN DEFAULT true,
    public_profile BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}', -- Configuraciones adicionales flexibles
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_analytics_presskit_id ON presskit_analytics(presskit_id);
CREATE INDEX idx_analytics_created_at ON presskit_analytics(created_at);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- Vista para analytics agregados
CREATE VIEW presskit_stats AS
SELECT 
    p.id as presskit_id,
    p.title,
    p.user_id,
    COUNT(CASE WHEN pa.event_type = 'view' THEN 1 END) as total_views,
    COUNT(CASE WHEN pa.event_type = 'share' THEN 1 END) as total_shares,
    COUNT(CASE WHEN pa.event_type = 'download' THEN 1 END) as total_downloads,
    MAX(pa.created_at) as last_activity
FROM presskits p
LEFT JOIN presskit_analytics pa ON p.id = pa.presskit_id
GROUP BY p.id, p.title, p.user_id;
```

## Enhanced Dashboard Architecture

### New Components Required:
```
src/components/dashboard/
├── analytics/
│   ├── AnalyticsOverview.tsx
│   ├── PressskitMetrics.tsx
│   └── ActivityFeed.tsx
├── presskit-management/
│   ├── PressskitGrid.tsx
│   ├── PressskitCard.tsx
│   ├── BulkActions.tsx
│   └── QuickActions.tsx
├── profile/
│   ├── ProfileEditor.tsx
│   ├── ProfilePreview.tsx
│   ├── AssetManager.tsx
│   └── SocialLinksEditor.tsx
├── settings/
│   ├── AccountSettings.tsx
│   ├── NotificationSettings.tsx
│   ├── ThemeSettings.tsx
│   └── DataExport.tsx
└── placeholders/
    └── LandingPageBuilder.tsx
```

### New Services Required:
- **AnalyticsService** - Tracking y reporting de metrics
- **SettingsService** - Gestión de configuraciones de usuario
- **AssetService** - Gestión de archivos y assets personales

### API Endpoints:
- `GET /api/analytics/overview` - Overview de analytics del usuario
- `GET /api/analytics/presskit/[id]` - Analytics específicos de un presskit
- `POST /api/analytics/track` - Tracking de eventos
- `GET /api/settings` - Configuraciones del usuario
- `PUT /api/settings` - Actualizar configuraciones
- `GET/POST/DELETE /api/assets` - Gestión de assets personales

## Dashboard Navigation Enhancement

### Extended Sidebar Menu:
```
🏠 Dashboard (Home)
📝 Mis Presskits
├── Ver Todos
├── Crear Nuevo
└── Borradores
👤 Mi Perfil
├── Editar Perfil
├── Redes Sociales
└── Assets/Archivos
📊 Analytics
├── Resumen General
├── Performance de Presskits
└── Actividad Reciente
⚙️ Configuraciones
├── Cuenta
├── Notificaciones
├── Tema/Apariencia
└── Privacidad
🚀 Landing Page Builder (Próximamente)
```

## Advanced Features Implementation

### Analytics Dashboard:
- **Overview cards:** Total views, shares, downloads este mes
- **Presskit performance:** Top performing presskits
- **Activity timeline:** Actividad reciente de todos los presskits
- **Growth metrics:** Comparación mes anterior
- **Export capabilities:** Datos básicos en CSV

### Profile Management:
- **Live preview:** Cambios se ven inmediatamente
- **Asset management:** Upload y organización de fotos, logos
- **Social validation:** Verificación de URLs de redes sociales
- **Bulk operations:** Actualizaciones masivas de información

### Settings & Customization:
- **Theme switching:** Light/Dark mode
- **Language preferences:** Español (preparado para i18n)
- **Notification preferences:** Email settings
- **Privacy controls:** Perfil público/privado
- **Data export:** GDPR compliance básico

## Performance Optimization

### Dashboard Loading Strategy:
- **Critical path:** Cargar sidebar y overview primero
- **Progressive enhancement:** Cargar analytics en background
- **Virtualization:** Para listas largas de presskits
- **Caching strategy:** Cache inteligente de analytics

### Data Management:
- **Pagination:** Para presskits y analytics
- **Infinite scroll:** En feeds de actividad
- **Optimistic updates:** Para mejor UX
- **Background sync:** Actualización de analytics

## User Experience Enhancements

### Accessibility:
- **Keyboard navigation:** Completa en dashboard
- **Screen reader support:** Para todos los componentes
- **Focus management:** Navegación intuitiva
- **Color contrast:** Cumple WCAG guidelines

### Mobile Optimization:
- **Responsive grids:** Para management de presskits
- **Touch-friendly:** Controles optimizados para móvil
- **Progressive Web App:** Características PWA básicas

## Future-Proofing

### Placeholder Modules:
- **Landing Page Builder:** Interface preparado para desarrollo futuro
- **Advanced Analytics:** Hooks para métricas más profundas
- **Team Collaboration:** Estructura para múltiples usuarios
- **API Integration:** Preparado para integraciones externas

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-08-06 | 1.0 | Epic brownfield inicial para dashboard avanzado | John (PM) |

## Story Manager Handoff

"Please develop detailed user stories for this brownfield epic. Key considerations:

- This builds on **complete system** with auth + chat + presskit generator
- Integration points: 
  - **Dashboard existente** que debe ser extendido, no reemplazado
  - **Todos los servicios existentes** (Auth, User, Presskit) deben mantenerse
  - **Sidebar navigation** existente debe expandirse orgánicamente
  - **UI components** establecidos deben reutilizarse y extenderse
- Existing patterns to follow: 
  - **Service architecture** similar a servicios existentes
  - **Component structure** consistente con arquitectura actual
  - **TypeScript patterns** ya establecidos
  - **API design** siguiendo convenciones existentes
- Critical requirements: 
  - **Performance first** - Dashboard no debe volverse lento
  - **Responsive design** - Toda funcionalidad debe ser móvil-friendly
  - **Analytics privacy-aware** - Tracking básico respetando privacidad
  - **Future-proof architecture** - Preparado para expansiones futuras
- New capabilities needed:
  - **AnalyticsService** para tracking y reporting
  - **SettingsService** para configuraciones
  - **Enhanced navigation** con mejor organización
- Each story must verify no regression in existing features

The epic should deliver **dashboard profesional tipo CRM para gestión completa** while maintaining all current functionality and performance."