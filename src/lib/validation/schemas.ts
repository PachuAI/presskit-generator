import { z } from 'zod'

export const SignUpSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  artist_name: z.string()
    .min(2, 'Nombre de artista muy corto')
    .max(100, 'Nombre de artista muy largo')
    .transform(input => input.trim()),
  full_name: z.string()
    .max(200, 'Nombre completo muy largo')
    .optional()
    .transform(input => input ? input.trim() : undefined)
})

export const SignInSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  password: z.string().min(1, 'Contraseña requerida')
})

export const UserProfileUpdateSchema = z.object({
  artist_name: z.string()
    .min(2, 'Nombre de artista muy corto')
    .max(100, 'Nombre de artista muy largo')
    .optional()
    .transform(input => input ? input.trim() : undefined),
  full_name: z.string()
    .max(200, 'Nombre completo muy largo')
    .optional()
    .transform(input => input ? input.trim() : undefined),
  bio: z.string()
    .max(2000, 'Biografía muy larga')
    .optional()
    .transform(input => input ? input.trim() : undefined),
  avatar_url: z.string().url('URL de avatar inválida').optional(),
  contact_email: z.string().email('Email de contacto inválido').optional(),
  phone: z.string().max(50, 'Teléfono muy largo').optional(),
  location: z.string().max(200, 'Ubicación muy larga').optional(),
  social_media: z.object({
    instagram: z.string().url('URL de Instagram inválida').optional(),
    twitter: z.string().url('URL de Twitter inválida').optional(),
    tiktok: z.string().url('URL de TikTok inválida').optional(),
    soundcloud: z.string().url('URL de SoundCloud inválida').optional(),
    spotify: z.string().url('URL de Spotify inválida').optional(),
    youtube: z.string().url('URL de YouTube inválida').optional(),
  }).optional()
})

export type SignUpData = z.infer<typeof SignUpSchema>
export type SignInData = z.infer<typeof SignInSchema>
export type UserProfileUpdateData = z.infer<typeof UserProfileUpdateSchema>