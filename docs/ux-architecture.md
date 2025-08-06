# ÍTERA PressKit Generator - Arquitectura de Experiencia UX

## Resumen Ejecutivo

Esta arquitectura de experiencia está diseñada mobile-first para DJs y artistas jóvenes en LATAM, priorizando el flujo conversacional del chat, preview en tiempo real, y un branding vanguardista con modo oscuro nativo. La experiencia transmite innovación tecnológica mientras mantiene accesibilidad para usuarios que pueden no ser técnicos.

## 1. Principios de Diseño Core

### 1.1 Mobile-First Absoluto
- **Principio**: Toda decisión de UX se toma primero para dispositivos móviles
- **Implementación**: Breakpoints móvil (320-768px), tablet (768-1024px), desktop (1024px+)
- **Rationale**: 85% del target usa móvil como dispositivo principal

### 1.2 Conversacional y Humano
- **Principio**: El chat Pre-Generator debe sentirse como hablar con un asistente personal experto
- **Implementación**: Mensajes con personalidad, respuestas adaptadas al contexto del artista
- **Rationale**: Reduce ansiedad técnica y aumenta engagement

### 1.3 Preview en Tiempo Real
- **Principio**: El usuario debe ver el resultado inmediatamente mientras edita
- **Implementación**: Split view desktop, tabs con swipe móvil, actualizaciones sin delay
- **Rationale**: Aumenta confianza y reduce abandono en el proceso

### 1.4 Vanguardia Tecnológica Accesible
- **Principio**: Transmitir innovación sin intimidar
- **Implementación**: Animaciones fluidas, transiciones suaves, feedback inmediato
- **Rationale**: Diferenciación de marca y alineación con identidad musical electrónica

## 2. Arquitectura de Navegación Mobile-First

### 2.1 Estructura Global

```
├── Landing Page (/)
├── Auth Modal (overlay)
├── Dashboard (/dashboard)
│   ├── Home (default)
│   ├── Pre-Generator Chat (/dashboard/chat)
│   ├── PressKit Editor (/dashboard/editor/[id])
│   ├── Mis PressKits (/dashboard/presskits)
│   ├── Landing Builder (/dashboard/builder) [Próximamente]
│   └── Configuración (/dashboard/settings)
└── PressKit Público (/p/[slug])
```

### 2.2 Navegación Mobile

**Bottom Tab Navigation** (Principal - siempre visible en dashboard):
```
[Home] [Chat] [Editor] [PressKits] [Más]
```

**Top App Bar** (Contextual):
- Título de sección actual
- Action buttons específicos del contexto
- User avatar/settings en esquina superior derecha

**Sidebar Desktop** (Persistent):
- Logo ÍTERA
- Navegación principal con iconos
- User profile compacto
- Toggle modo oscuro/claro

### 2.3 Patrones de Navegación

#### Mobile Navigation Patterns:
- **Swipe Gestures**: Entre tabs en Pre-Generator y Editor
- **Pull to Refresh**: En listas de presskits
- **Bottom Sheets**: Para acciones secundarias
- **Floating Action Button**: Para "Nuevo PressKit" (principal CTA)

#### Desktop Navigation Patterns:
- **Persistent Sidebar**: Siempre visible, colapsible
- **Breadcrumb Navigation**: En rutas profundas
- **Keyboard Shortcuts**: Para power users
- **Context Menus**: Click derecho en elementos

## 3. Wireframes Conceptuales

### 3.1 Landing Page

#### Mobile (320-768px):
```
┌─────────────────────────┐
│ [☰] ÍTERA      [Login] │
├─────────────────────────┤
│                         │
│    🎵 HERO VISUAL       │
│                         │
│  Crea tu presskit       │
│  profesional en         │
│  minutos                │
│                         │
│ [Comenzar Gratis] CTA   │
│                         │
├─────────────────────────┤
│ ¿Cómo funciona?         │
│                         │
│ 1️⃣ Chatea              │
│ Cuéntanos sobre tu      │
│ música                  │
│                         │
│ 2️⃣ Personaliza         │
│ Ajusta tu presskit      │
│ en tiempo real          │
│                         │
│ 3️⃣ Comparte            │
│ URL profesional         │
│ lista para usar         │
│                         │
├─────────────────────────┤
│ 📱 Preview de           │
│    PressKits            │
│                         │
│ [Ver ejemplos]          │
├─────────────────────────┤
│ Footer compacto         │
└─────────────────────────┘
```

#### Desktop (1024px+):
```
┌─────────────────────────────────────────────────────────────────┐
│ ÍTERA                                    [Login] [Registrarse]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────┐  ┌───────────────────────────────────┐  │
│  │                    │  │ Crea tu presskit profesional     │  │
│  │   🎵 HERO VISUAL   │  │ en minutos, no en días           │  │
│  │   (Animated)       │  │                                  │  │
│  │                    │  │ Para DJs y artistas que quieren  │  │
│  │                    │  │ destacar sin complicaciones      │  │
│  │                    │  │                                  │  │
│  │                    │  │ [Comenzar Gratis] [Ver Demo]     │  │
│  └────────────────────┘  └───────────────────────────────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                     ¿Cómo funciona?                            │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ 1️⃣ Chatea      │ │ 2️⃣ Personaliza │ │ 3️⃣ Comparte    │   │
│  │ Visual + texto  │ │ Visual + texto  │ │ Visual + texto  │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                 Ejemplos de PressKits                          │
│    [Grid de 3-4 ejemplos con preview interactive]              │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Chat Pre-Generator

#### Mobile Layout:
```
┌─────────────────────────┐
│ [←] Pre-Generator   [⋯] │
├─────────────────────────┤
│                         │
│ Hola! Soy tu asistente  │
│ para crear tu presskit  │
│ ¿Cuál es tu nombre      │
│ artístico? 🎵           │
│              [Bot Msg]  │
│                         │
│ [User Msg] DJ NEXUS     │
│                         │
│ ¡Perfecto! Cuéntame     │
│ sobre tu música...      │
│              [Bot Msg]  │
│                         │
│ ┌─────────────────────┐ │
│ │ [Escribe aquí...]   │ │
│ │                [→]  │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ ● ● ○ ○ ○ ○ ○           │ Progress
│                         │
│ [Ver Preview] ↑ Slide   │
└─────────────────────────┘
```

#### Desktop Layout:
```
┌─────────────────────────────────────────────────────────────────┐
│ [←] ÍTERA / Pre-Generator                              [User] ⋯ │
├─────────────────────────┬───────────────────────────────────────┤
│                         │                                       │
│ Hola! Soy tu asistente  │        📄 PREVIEW EN TIEMPO REAL     │
│ para crear tu presskit  │                                       │
│ ¿Cuál es tu nombre      │  ┌─────────────────────────────────┐   │
│ artístico? 🎵           │  │                                 │   │
│              [Bot Msg]  │  │         DJ NEXUS                │   │
│                         │  │                                 │   │
│ [User] DJ NEXUS         │  │    [Foto placeholder]           │   │
│                         │  │                                 │   │
│ ¡Perfecto! Cuéntame     │  │    Bio: ...                     │   │
│ sobre tu música...      │  │                                 │   │
│              [Bot Msg]  │  │    Géneros: Electronic, House   │   │
│                         │  │                                 │   │
│ ┌─────────────────────┐ │  │    Contacto: ...                │   │
│ │ [Escribe aquí...]   │ │  │                                 │   │
│ │                [→]  │ │  └─────────────────────────────────┘   │
│ └─────────────────────┘ │                                       │
│                         │                                       │
│ ● ● ○ ○ ○ ○ ○           │                                       │ Progress
│                         │                                       │
├─────────────────────────┴───────────────────────────────────────┤
│ [← Anterior] [Continuar →] [Finalizar Chat]                    │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 PressKit Generator/Editor

#### Mobile Layout (Tabs):
```
┌─────────────────────────┐
│ [←] Editor PressKit [✓] │
├─────────────────────────┤
│ [Editar] [Preview] 📱   │ Tabs
├─────────────────────────┤
│                         │
│ Tab "Editar":           │
│                         │
│ Nombre Artístico        │
│ ┌─────────────────────┐ │
│ │ DJ NEXUS            │ │
│ └─────────────────────┘ │
│                         │
│ Biografía               │
│ ┌─────────────────────┐ │
│ │ Multiline text...   │ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ Géneros Musicales       │
│ ┌─────────────────────┐ │
│ │ Electronic, House   │ │
│ └─────────────────────┘ │
│                         │
│ [+ Agregar Sección]     │
│                         │
├─────────────────────────┤
│ [Guardar] [Exportar]    │
└─────────────────────────┘
```

#### Desktop Layout (Split View):
```
┌─────────────────────────────────────────────────────────────────┐
│ [←] ÍTERA / Editor                                     [User] ⋯ │
├─────────────────────────┬───────────────────────────────────────┤
│ 📝 EDITOR               │ 👁 PREVIEW EN TIEMPO REAL              │
│                         │                                       │
│ Información Básica      │  ┌─────────────────────────────────┐   │
│                         │  │                                 │   │
│ Nombre Artístico        │  │         DJ NEXUS                │   │
│ ┌─────────────────────┐ │  │                                 │   │
│ │ DJ NEXUS            │ │  │    [Foto perfil circular]      │   │
│ └─────────────────────┘ │  │                                 │   │
│                         │  │  🎵 Electronic • House • Tech  │   │
│ Biografía               │  │                                 │   │
│ ┌─────────────────────┐ │  │  "Lorem ipsum bio text que     │   │
│ │ Multiline text...   │ │  │  se actualiza en tiempo real   │   │
│ │ Auto-expands        │ │  │  mientras escribes..."          │   │
│ │                     │ │  │                                 │   │
│ └─────────────────────┘ │  │  📧 booking@djnexus.com        │   │
│                         │  │  🌐 djnexus.com                 │   │
│ Géneros                 │  │  📱 @djnexus                    │   │
│ [Electronic] [x]        │  │                                 │   │
│ [House] [x]             │  │  🎧 Últimos tracks:            │   │
│ [+ Agregar]             │  │  • Track 1                      │   │
│                         │  │  • Track 2                      │   │
│ Redes Sociales          │  │                                 │   │
│ ┌─────────────────────┐ │  │                                 │   │
│ │ Instagram           │ │  └─────────────────────────────────┘   │
│ └─────────────────────┘ │                                       │
│                         │                                       │
│ [+ Agregar Sección]     │                                       │
│                         │                                       │
├─────────────────────────┴───────────────────────────────────────┤
│ [💾 Auto-guardado] [🔗 Obtener enlace] [📄 Exportar PDF]       │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Dashboard CRM-Style

#### Mobile Layout:
```
┌─────────────────────────┐
│ ÍTERA Dashboard    [👤] │
├─────────────────────────┤
│                         │
│ ¡Hola, DJ NEXUS! 👋     │
│                         │
│ Tu último presskit      │
│ ┌─────────────────────┐ │
│ │ [Thumbnail]         │ │
│ │ DJ NEXUS            │ │
│ │ Editado hace 2h     │ │
│ │ [Editar] [Ver]      │ │
│ └─────────────────────┘ │
│                         │
│ Accesos rápidos         │
│ ┌─────────────────────┐ │
│ │ 🎯 Nuevo PressKit   │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 📊 Ver estadísticas │ │
│ └─────────────────────┘ │
│                         │
│ Mis PressKits (3)       │
│ ┌─────────────────────┐ │
│ │ [Lista compacta]    │ │
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│[🏠][💬][✏️][📁][⋯]     │ Bottom Nav
└─────────────────────────┘
```

#### Desktop Layout:
```
┌─────────────────────────────────────────────────────────────────┐
│ ÍTERA                                              [👤] Settings│
├───────────────────┬─────────────────────────────────────────────┤
│ 🏠 Dashboard      │ ¡Hola, DJ NEXUS! 👋                        │
│ 💬 Pre-Generator  │                                             │
│ ✏️ Editor         │ Stats Overview                              │
│ 📁 Mis PressKits  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ 🏗 Landing Builder│ │  3   │ │ 245  │ │ 12   │ │ 89%  │       │
│   (Próximamente)  │ │Total │ │Vistas│ │Links │ │Tasa  │       │
│ ⚙️ Configuración  │ └──────┘ └──────┘ └──────┘ └──────┘       │
│                   │                                             │
│ ────────────────  │ Tu último presskit                         │
│                   │ ┌─────────────────────────────────────────┐ │
│ 👤 DJ NEXUS       │ │ [Preview thumbnail]                     │ │
│    Cuenta Pro     │ │ DJ NEXUS                                │ │
│                   │ │ Electronic • House                      │ │
│ 🌙 Modo Oscuro    │ │ Editado hace 2 horas                   │ │
│                   │ │ 👁 45 vistas esta semana               │ │
│                   │ │ [Editar] [Ver público] [Compartir]     │ │
│                   │ └─────────────────────────────────────────┘ │
│                   │                                             │
│                   │ Accesos rápidos                            │
│                   │ ┌─────────────────┐ ┌─────────────────────┐ │
│                   │ │ 🎯 Nuevo        │ │ 📊 Analytics        │ │
│                   │ │   PressKit      │ │   detallados        │ │
│                   │ └─────────────────┘ └─────────────────────┘ │
│                   │                                             │
│                   │ Todos tus PressKits                        │
│                   │ [Grid/Lista con filtros y búsqueda]        │
└───────────────────┴─────────────────────────────────────────────┘
```

### 3.5 Landing Público del PressKit

#### Mobile Layout:
```
┌─────────────────────────┐
│ [←] Compartir      [⋯]  │
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │  [Foto de perfil]   │ │
│ │     circular        │ │
│ └─────────────────────┘ │
│                         │
│       DJ NEXUS          │
│                         │
│ 🎵 Electronic • House   │
│ 🇦🇷 Buenos Aires        │
│                         │
│ ┌─────────────────────┐ │
│ │ "Biografía del      │ │
│ │ artista que se      │ │
│ │ muestra de forma    │ │
│ │ elegant..."         │ │
│ └─────────────────────┘ │
│                         │
│ 🎧 Música               │
│ ┌─────────────────────┐ │
│ │ ▶️ Latest Mix       │ │
│ │ 🔗 Spotify          │ │
│ │ 🔗 SoundCloud       │ │
│ └─────────────────────┘ │
│                         │
│ 📧 Contacto             │
│ ┌─────────────────────┐ │
│ │ booking@djnexus.com │ │
│ │ +54 11 1234-5678    │ │
│ └─────────────────────┘ │
│                         │
│ 🌐 Redes Sociales       │
│ [IG] [FB] [TW] [YT]     │
│                         │
├─────────────────────────┤
│ [💾 Descargar PDF]      │
│ [🔗 Compartir enlace]   │
└─────────────────────────┘
```

#### Desktop Layout:
```
┌─────────────────────────────────────────────────────────────────┐
│                                          [🔗 Compartir] [💾 PDF]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐  ┌───────────────────────────────────┐ │
│  │                      │  │         DJ NEXUS                  │ │
│  │   [Foto de perfil    │  │                                   │ │
│  │    grande, circular] │  │ 🎵 Electronic • House • Techno   │ │
│  │                      │  │ 🇦🇷 Buenos Aires, Argentina      │ │
│  │                      │  │                                   │ │
│  │                      │  │ "Biografía completa del artista   │ │
│  │                      │  │ que se muestra en formato         │ │
│  │                      │  │ elegante y profesional con        │ │
│  │                      │  │ suficiente espacio..."            │ │
│  └──────────────────────┘  └───────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🎧 MÚSICA                                                   │ │
│ │ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │ │
│ │ │ ▶️ Latest Mix   │ │ 🔗 Spotify      │ │ 🔗 SoundCloud   │ │ │
│ │ │ [Cover art]     │ │ [Album covers]  │ │ [Track list]    │ │ │
│ │ └─────────────────┘ └─────────────────┘ └─────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 📧 CONTACTO & BOOKING                                       │ │
│ │                                                             │ │
│ │ 📧 booking@djnexus.com    📱 +54 11 1234-5678              │ │
│ │ 🌐 www.djnexus.com        📍 Buenos Aires, Argentina        │ │
│ │                                                             │ │
│ │ 🌐 REDES SOCIALES:                                          │ │
│ │ [Instagram] [Facebook] [Twitter] [YouTube] [TikTok]         │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│         Powered by ÍTERA PressKit Generator                    │
└─────────────────────────────────────────────────────────────────┘
```

## 4. Interaction Patterns Específicos

### 4.1 Chat Conversacional

#### Patrón de Conversación:
```typescript
// Estructura de mensaje bot
interface BotMessage {
  text: string;
  type: 'question' | 'confirmation' | 'suggestion' | 'celebration';
  quickReplies?: string[];
  progressStep: number;
  context?: 'bio' | 'genres' | 'social' | 'contact' | 'experience';
}

// Ejemplos de mensajes contextuales:
const chatFlow = {
  welcome: "¡Hola! 🎵 Soy tu asistente para crear un presskit increíble. ¿Cuál es tu nombre artístico?",
  bio: "Perfecto, DJ NEXUS! Ahora cuéntame tu historia musical en tus propias palabras...",
  genres: "¿Qué géneros musicales defines tu sonido? Puedes elegir varios:",
  experience: "¿Cuánto tiempo llevas en la música? ¿Algún evento o logro que quieras destacar?",
  social: "Genial! Ahora comparte tus redes sociales para que te encuentren fácilmente:",
  confirmation: "¡Increíble! Tu presskit está tomando forma. ¿Quieres añadir algo más o pasamos a personalizarlo?"
}
```

#### Micro-interacciones:
- **Typing indicator**: Puntos animados mientras "el bot piensa"
- **Message delivery**: Checkmarks verde cuando se envía
- **Auto-complete**: Sugerencias mientras escribe géneros musicales
- **Quick replies**: Botones para respuestas comunes
- **Progress animation**: Barra que se llena suavemente

### 4.2 Preview en Tiempo Real

#### Desktop Split View:
```typescript
// Debounced real-time updates
const useRealtimePreview = () => {
  const [formData, setFormData] = useState();
  const [previewData, setPreviewData] = useState();
  
  const debouncedUpdate = useMemo(
    () => debounce((data) => {
      setPreviewData(generatePreview(data));
    }, 300),
    []
  );
  
  useEffect(() => {
    debouncedUpdate(formData);
  }, [formData, debouncedUpdate]);
};
```

#### Mobile Tab Switching:
- **Swipe gestures**: Swipe horizontal entre "Editar" y "Preview"
- **Tab animation**: Sliding animation entre vistas
- **Preview scroll**: Mantiene posición de scroll al cambiar tabs
- **Floating preview button**: Botón flotante "Ver preview" siempre visible

### 4.3 Gestión de Estado y Navegación

#### Auto-save pattern:
```typescript
const useAutoSave = () => {
  // Auto-save cada 2 segundos
  // Visual indicator de "guardando..." y "guardado"
  // Offline support con queue de cambios
};
```

#### Mobile navigation:
```typescript
const mobileNavigation = {
  bottomTabs: ['Home', 'Chat', 'Editor', 'PressKits', 'More'],
  swipeGestures: {
    rightSwipe: 'goBack',
    leftSwipe: 'goForward'
  },
  floatingActionButton: {
    action: 'newPresskit',
    position: 'bottomRight'
  }
};
```

## 5. Design System ÍTERA

### 5.1 Paleta de Colores

#### Colores Principales:
```css
:root {
  /* ÍTERA Brand Colors */
  --itera-red: #E53935;          /* Primary CTA, highlights */
  --itera-red-hover: #C62928;    /* Hover states */
  --itera-red-light: #FFEBEE;    /* Light backgrounds */
  
  --itera-black: #181316;        /* Primary background */
  --itera-gray-warm: #23181A;    /* Cards, secondary surfaces */
  --itera-gray-medium: #2D2328;  /* Borders, dividers */
  --itera-gray-light: #3D3338;   /* Input fields, hover states */
  
  /* Text Colors */
  --text-primary: #FFFFFF;       /* Primary text on dark */
  --text-secondary: #B8B3B6;     /* Secondary text */
  --text-tertiary: #8B8589;      /* Tertiary text, placeholders */
  --text-on-primary: #FFFFFF;    /* Text on red backgrounds */
}

/* Light Mode (Secondary) */
:root[data-theme="light"] {
  --itera-black: #FFFFFF;        /* Inverted background */
  --itera-gray-warm: #F5F5F5;    /* Light cards */
  --itera-gray-medium: #E0E0E0;  /* Light borders */
  --itera-gray-light: #F9F9F9;   /* Light inputs */
  
  --text-primary: #181316;       /* Dark text on light */
  --text-secondary: #4A464A;     /* Secondary on light */
  --text-tertiary: #6B6B6B;      /* Tertiary on light */
}
```

#### Colores Semánticos:
```css
:root {
  /* Status Colors */
  --success: #4CAF50;
  --success-light: #E8F5E8;
  --warning: #FF9800;
  --warning-light: #FFF3E0;
  --error: #F44336;
  --error-light: #FFEBEE;
  --info: #2196F3;
  --info-light: #E3F2FD;
  
  /* Interactive States */
  --focus-ring: rgba(229, 57, 53, 0.3);
  --hover-overlay: rgba(255, 255, 255, 0.05);
  --active-overlay: rgba(255, 255, 255, 0.1);
}
```

### 5.2 Tipografía

#### Font Stack:
```css
:root {
  /* Primary Font (Headings, UI) */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                  'Roboto', 'Helvetica Neue', Arial, sans-serif;
  
  /* Secondary Font (Body, longer text) */
  --font-secondary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                    'Roboto', 'Helvetica Neue', Arial, sans-serif;
  
  /* Monospace (Code, technical info) */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace;
}
```

#### Type Scale:
```css
:root {
  /* Mobile-first type scale */
  --text-xs: 0.75rem;     /* 12px - captions, labels */
  --text-sm: 0.875rem;    /* 14px - body small, secondary */
  --text-base: 1rem;      /* 16px - body text */
  --text-lg: 1.125rem;    /* 18px - body large, highlights */
  --text-xl: 1.25rem;     /* 20px - small headings */
  --text-2xl: 1.5rem;     /* 24px - section headings */
  --text-3xl: 1.875rem;   /* 30px - page headings */
  --text-4xl: 2.25rem;    /* 36px - hero headings */
  --text-5xl: 3rem;       /* 48px - display headings */
}

/* Desktop adjustments */
@media (min-width: 1024px) {
  :root {
    --text-base: 1.125rem;  /* 18px base on desktop */
    --text-lg: 1.25rem;     /* 20px */
    --text-xl: 1.375rem;    /* 22px */
    --text-2xl: 1.625rem;   /* 26px */
    --text-3xl: 2rem;       /* 32px */
    --text-4xl: 2.5rem;     /* 40px */
    --text-5xl: 3.5rem;     /* 56px */
  }
}
```

#### Typography Classes:
```css
/* Heading styles */
.heading-display {
  font-size: var(--text-5xl);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.heading-h1 {
  font-size: var(--text-4xl);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.heading-h2 {
  font-size: var(--text-3xl);
  font-weight: 600;
  line-height: 1.3;
}

.heading-h3 {
  font-size: var(--text-2xl);
  font-weight: 600;
  line-height: 1.4;
}

/* Body styles */
.body-large {
  font-size: var(--text-lg);
  line-height: 1.6;
}

.body-base {
  font-size: var(--text-base);
  line-height: 1.5;
}

.body-small {
  font-size: var(--text-sm);
  line-height: 1.5;
}

/* UI styles */
.ui-label {
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

.ui-caption {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  line-height: 1.4;
}
```

### 5.3 Spacing System

```css
:root {
  /* Base spacing unit: 4px */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  
  /* Component-specific spacing */
  --space-component-sm: var(--space-4);
  --space-component-md: var(--space-6);
  --space-component-lg: var(--space-8);
  
  /* Layout spacing */
  --space-section-sm: var(--space-12);
  --space-section-md: var(--space-16);
  --space-section-lg: var(--space-24);
}
```

### 5.4 Border Radius & Shadows

```css
:root {
  /* Border radius */
  --radius-sm: 0.25rem;   /* 4px - small elements */
  --radius-md: 0.5rem;    /* 8px - buttons, inputs */
  --radius-lg: 0.75rem;   /* 12px - cards, modals */
  --radius-xl: 1rem;      /* 16px - large cards */
  --radius-full: 9999px;  /* Fully rounded */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.25);
  
  /* ÍTERA specific shadows (warm tinted) */
  --shadow-itera-sm: 0 1px 3px rgba(24, 19, 22, 0.3);
  --shadow-itera-md: 0 4px 12px rgba(24, 19, 22, 0.4);
  --shadow-itera-lg: 0 8px 24px rgba(24, 19, 22, 0.5);
}
```

### 5.5 Componentes Base

#### Button System:
```css
/* Primary button */
.btn-primary {
  background: var(--itera-red);
  color: var(--text-on-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: var(--text-base);
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--itera-red-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Secondary button */
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--itera-gray-medium);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--hover-overlay);
  border-color: var(--itera-gray-light);
}

/* Ghost button */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: none;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: var(--hover-overlay);
  color: var(--text-primary);
}
```

#### Card System:
```css
.card {
  background: var(--itera-gray-warm);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-itera-sm);
  border: 1px solid var(--itera-gray-medium);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-itera-md);
  border-color: var(--itera-gray-light);
}

.card-interactive {
  cursor: pointer;
}

.card-interactive:hover {
  transform: translateY(-2px);
}
```

#### Input System:
```css
.input {
  background: var(--itera-gray-light);
  border: 1px solid var(--itera-gray-medium);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  color: var(--text-primary);
  font-size: var(--text-base);
  transition: all 0.2s ease;
  width: 100%;
}

.input:focus {
  outline: none;
  border-color: var(--itera-red);
  box-shadow: 0 0 0 3px var(--focus-ring);
  background: var(--itera-black);
}

.input::placeholder {
  color: var(--text-tertiary);
}
```

## 6. User Flow Completo

### 6.1 Flujo Principal: Landing → PressKit Compartido

```mermaid
graph TD
    A[Landing Page] -->|Click "Comenzar Gratis"| B[Auth Modal]
    B -->|Google OAuth / Email| C[Dashboard Home]
    C -->|Click "Nuevo PressKit"| D[Pre-Generator Chat]
    
    D --> D1[Step 1: Nombre Artístico]
    D1 --> D2[Step 2: Biografía]
    D2 --> D3[Step 3: Géneros Musicales]
    D3 --> D4[Step 4: Experiencia]
    D4 --> D5[Step 5: Redes Sociales]
    D5 --> D6[Step 6: Contacto]
    D6 --> D7[Step 7: Música/Links]
    D7 -->|"¡Perfecto! Vamos a personalizarlo"| E[PressKit Editor]
    
    E --> E1[Vista de Edición con Preview]
    E1 --> E2[Auto-guardado activado]
    E2 --> E3[Personalización avanzada]
    E3 -->|"Obtener enlace"| F[URL Pública Generada]
    
    F --> G[Landing Público del PressKit]
    G --> H[Compartir en RRSS / Email]
    
    C --> I[Ver PressKits Anteriores]
    I -->|Seleccionar| E1
    
    E3 --> J[Exportar PDF]
```

### 6.2 Flujos Secundarios

#### A. Gestión de PressKits:
```
Dashboard → Mis PressKits → [Lista/Grid] → Seleccionar → Editor
                         → Duplicar → Nuevo Editor
                         → Eliminar → Confirmación
                         → Ver público → Landing público
```

#### B. Configuración de cuenta:
```
Dashboard → Configuración → Perfil personal
                         → Preferencias de tema
                         → Configuración de notificaciones
                         → Plan y facturación (futuro)
```

#### C. Onboarding de nuevo usuario:
```
Landing → Registro → Email verificación → Dashboard welcome
                  → Tooltip tour → Primer PressKit guiado
```

## 7. Modo Oscuro Nativo

### 7.1 Sistema de Temas

```typescript
// Theme system
type Theme = 'dark' | 'light' | 'system';

const themeConfig = {
  dark: {
    primary: '#181316',
    surface: '#23181A',
    surfaceVariant: '#2D2328',
    text: {
      primary: '#FFFFFF',
      secondary: '#B8B3B6',
      tertiary: '#8B8589'
    },
    accent: '#E53935',
    shadows: 'warm-dark'
  },
  light: {
    primary: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceVariant: '#E0E0E0',
    text: {
      primary: '#181316',
      secondary: '#4A464A',
      tertiary: '#6B6B6B'
    },
    accent: '#E53935',
    shadows: 'neutral-light'
  }
};
```

### 7.2 Implementación CSS

```css
/* Theme toggle implementation */
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark theme by default */
    color-scheme: dark;
  }
}

/* Light theme override */
:root[data-theme="light"] {
  color-scheme: light;
  /* All light theme variables */
}

/* System theme detection */
:root[data-theme="system"] {
  /* Inherits from prefers-color-scheme */
}

/* Smooth theme transitions */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
```

### 7.3 Componente Theme Toggle

```tsx
// React component for theme switching
const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Cambiar tema"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
};
```

## 8. Performance Mobile

### 8.1 Lazy Loading Strategy

```typescript
// Component lazy loading
const PressKitEditor = lazy(() => import('./components/PressKitEditor'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Image lazy loading
const LazyImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={imgRef} className="lazy-image-container">
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          {...props}
        />
      )}
    </div>
  );
};
```

### 8.2 Progressive Enhancement

```typescript
// Progressive enhancement approach
const ProgressiveFeature = ({ fallback, children }) => {
  const [isEnhanced, setIsEnhanced] = useState(false);
  
  useEffect(() => {
    // Check for advanced feature support
    const hasAdvancedSupport = 
      'ResizeObserver' in window && 
      'IntersectionObserver' in window &&
      CSS.supports('backdrop-filter', 'blur(10px)');
    
    setIsEnhanced(hasAdvancedSupport);
  }, []);
  
  return isEnhanced ? children : fallback;
};

// Usage in components
<ProgressiveFeature
  fallback={<SimplePreview />}
>
  <AdvancedPreviewWithAnimations />
</ProgressiveFeature>
```

### 8.3 Performance Budget

```typescript
// Performance monitoring
const performanceConfig = {
  budgets: {
    // Mobile targets
    mobile: {
      FCP: 1500,  // First Contentful Paint
      LCP: 2500,  // Largest Contentful Paint
      FID: 100,   // First Input Delay
      CLS: 0.1    // Cumulative Layout Shift
    },
    // Desktop targets
    desktop: {
      FCP: 1000,
      LCP: 1500,
      FID: 50,
      CLS: 0.05
    }
  },
  
  // Bundle size limits
  bundles: {
    main: '150kb',      // Main bundle
    vendor: '200kb',    // Third-party code
    async: '50kb'       // Lazy-loaded chunks
  }
};
```

### 8.4 Optimización de Imágenes

```typescript
// Image optimization pipeline
const ImageOptimizer = {
  // Next.js Image component configuration
  formats: ['webp', 'avif', 'jpg'],
  sizes: {
    mobile: '(max-width: 768px) 100vw',
    tablet: '(max-width: 1024px) 50vw',
    desktop: '25vw'
  },
  quality: 75,
  placeholder: 'blur',
  
  // Dynamic image resizing
  generateSrcSet: (src: string) => {
    const sizes = [320, 640, 1024, 1280];
    return sizes.map(size => 
      `${src}?w=${size}&q=75 ${size}w`
    ).join(', ');
  }
};
```