# Requirements

## Functional

• **FR1:** El sistema debe permitir registro y autenticación de usuarios mediante Google OAuth y email/password
• **FR2:** El Pre-Generator debe guiar al usuario mediante chat interactivo para recopilar: nombre artístico, biografía, géneros musicales, experiencia, redes sociales, enlaces de música y contacto de booking
• **FR3:** El usuario debe poder editar sus respuestas del chat antes de enviarlas al generador de presskit
• **FR4:** El PressKit Generator debe mostrar un preview visual en tiempo real mientras el usuario edita el contenido
• **FR5:** El sistema debe generar presskits exportables en formato PDF y/o imagen con diseño profesional
• **FR6:** Cada presskit debe tener una landing page pública accesible mediante URL única (/p/[slug])
• **FR7:** El dashboard debe presentar navegación tipo CRM con sidebar lateral mostrando todos los módulos disponibles
• **FR8:** El sistema debe guardar automáticamente los presskits creados asociados al perfil del usuario en Supabase
• **FR9:** Los usuarios deben poder acceder y editar sus presskits anteriores desde el dashboard
• **FR10:** El módulo Landing Page Builder debe mostrar estado "Próximamente" como placeholder en el MVP

## Non Functional

• **NFR1:** La UI debe seguir estrictamente el branding ÍTERA: colores rojo (#E53935), negro (#181316), grises cálidos, sin tonos fríos
• **NFR2:** La plataforma debe ser 100% responsive, funcionando perfectamente en móvil y desktop
• **NFR3:** Todo el contenido debe estar en español, optimizado para usuarios de Argentina y Latinoamérica
• **NFR4:** El onboarding debe completarse en menos de 3 minutos desde registro hasta primer presskit
• **NFR5:** La aplicación debe funcionar completamente en el free tier de Vercel y Supabase
• **NFR6:** El tiempo de carga de cualquier página no debe exceder 3 segundos en conexión 3G
• **NFR7:** La arquitectura debe ser modular para facilitar la adición de nuevas funcionalidades
• **NFR8:** El código debe usar solo dependencias modernas y estables: Next.js, Supabase, shadcn/ui, Tailwind, react-pdf/html2canvas
• **NFR9:** La experiencia debe transmitir "vanguardia tecnológica" con animaciones suaves y transiciones fluidas
• **NFR11:** La aplicación debe incluir modo oscuro como opción de personalización para los usuarios
• **NFR10:** El sistema debe preparar la infraestructura para integración futura con Mercado Pago sin implementarla en MVP
