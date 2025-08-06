# Configuración de Supabase - ÍTERA PressKit Generator

## Pasos para Configurar Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Crea una nueva organización o selecciona una existente
4. Crea un nuevo proyecto con el nombre "presskit-generator"
5. Selecciona la región más cercana (preferiblemente South America)
6. Genera una contraseña segura para la base de datos

### 2. Configurar Variables de Entorno

1. Copia `.env.local.example` a `.env.local`
2. En el dashboard de Supabase, ve a Settings > API
3. Copia la `Project URL` y `anon public` key
4. Actualiza `.env.local` con tus valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Ejecutar Script SQL

1. En el dashboard de Supabase, ve a SQL Editor
2. Copia y pega el contenido completo de `supabase-setup.sql`
3. Ejecuta el script haciendo clic en "Run"

Esto creará:
- Tabla `user_profiles` con todos los campos necesarios
- Políticas RLS para seguridad
- Trigger automático para crear perfiles en signup
- Función de actualización de timestamps

### 4. Configurar Google OAuth

1. Ve a Authentication > Providers en Supabase
2. Habilita "Google" como proveedor
3. Necesitarás configurar Google OAuth Client:

#### Configurar Google Cloud Console:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita Google+ API
4. Ve a Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Configura Authorized JavaScript origins:
   - `http://localhost:3000` (desarrollo)
   - `https://tu-proyecto-ref.supabase.co` (producción)
6. Configura Authorized redirect URIs:
   - `https://tu-proyecto-ref.supabase.co/auth/v1/callback`
7. Copia Client ID y Client Secret

#### En Supabase:
1. Pega Client ID y Client Secret en la configuración de Google
2. Guarda la configuración

### 5. Verificar Configuración

Ejecuta estos comandos para verificar que todo funciona:

```bash
# Instalar dependencias
npm install

# Ejecutar aplicación en desarrollo
npm run dev

# Ejecutar tests
npm run test
```

### 6. Estructura de la Base de Datos

La tabla `user_profiles` contiene:

- `id`: UUID primario
- `auth_user_id`: Referencia a auth.users
- `email`: Email del usuario (único)
- `artist_name`: Nombre artístico (requerido)
- `full_name`: Nombre completo (opcional)
- `avatar_url`: URL del avatar (opcional)
- `bio`: Biografía corta (opcional)
- `subscription_status`: free/pro/enterprise (default: free)
- `presskit_limit`: Límite de presskits (default: 3)
- `social_media`: JSONB con redes sociales
- `contact_email`: Email de contacto profesional
- `phone`: Teléfono de contacto
- `location`: Ubicación (Ciudad, País)
- `created_at`: Timestamp de creación
- `updated_at`: Timestamp de actualización

### 7. Seguridad (RLS)

Las políticas RLS configuradas permiten:
- Los usuarios solo pueden ver su propio perfil
- Los usuarios solo pueden insertar su propio perfil
- Los usuarios solo pueden actualizar su propio perfil

### Notas Importantes

- El trigger `on_auth_user_created` se ejecuta automáticamente al registrarse un usuario
- Los metadatos del registro (artist_name, full_name) se copian al perfil automáticamente
- La función `handle_new_user()` maneja la creación de perfiles de forma segura