# ÍTERA PressKit Generator - Guía de Implementación

## Resumen Ejecutivo

Esta guía proporciona la implementación práctica de la arquitectura UX usando shadcn/ui + Tailwind CSS, siguiendo el diseño mobile-first y el branding ÍTERA. Incluye componentes específicos, configuración de Tailwind personalizada, y ejemplos de código listo para implementar.

## 1. Configuración Base

### 1.1 Tailwind Config Personalizada

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      // ÍTERA Brand Colors
      colors: {
        itera: {
          red: {
            DEFAULT: '#E53935',
            hover: '#C62928',
            light: '#FFEBEE',
            50: '#FFEBEE',
            100: '#FFCDD2',
            500: '#E53935',
            600: '#C62928',
            700: '#AD2A2A',
          },
          black: {
            DEFAULT: '#181316',
            light: '#23181A',
            medium: '#2D2328',
            surface: '#3D3338',
          },
          gray: {
            warm: '#23181A',
            medium: '#2D2328',
            light: '#3D3338',
            text: {
              primary: '#FFFFFF',
              secondary: '#B8B3B6',
              tertiary: '#8B8589',
            }
          }
        },
        // Semantic colors
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
      },
      
      // Typography
      fontFamily: {
        primary: ['Inter', 'system-ui', 'sans-serif'],
        secondary: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      
      // Mobile-first spacing
      spacing: {
        '18': '4.5rem',   // 72px
        '72': '18rem',    // 288px
        '84': '21rem',    // 336px
        '96': '24rem',    // 384px
      },
      
      // Custom shadows with warm tint
      boxShadow: {
        'itera-sm': '0 1px 3px rgba(24, 19, 22, 0.3)',
        'itera-md': '0 4px 12px rgba(24, 19, 22, 0.4)',
        'itera-lg': '0 8px 24px rgba(24, 19, 22, 0.5)',
        'focus-ring': '0 0 0 3px rgba(229, 57, 53, 0.3)',
      },
      
      // Animation durations
      transitionDuration: {
        '400': '400ms',
      },
      
      // Mobile-first breakpoints
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}

export default config
```

### 1.2 CSS Variables Global

```css
/* globals.css */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

:root {
  /* ÍTERA Brand Variables */
  --itera-red: 229 57 53;
  --itera-red-hover: 198 41 40;
  --itera-black: 24 19 22;
  --itera-gray-warm: 35 24 26;
  --itera-gray-medium: 45 35 40;
  --itera-gray-light: 61 51 56;
  
  /* Text Colors */
  --text-primary: 255 255 255;
  --text-secondary: 184 179 182;
  --text-tertiary: 139 133 137;
  
  /* Interactive States */
  --hover-overlay: 255 255 255;
  --focus-ring: 229 57 53;
}

/* Light theme */
:root[data-theme="light"] {
  --itera-black: 255 255 255;
  --itera-gray-warm: 245 245 245;
  --itera-gray-medium: 224 224 224;
  --itera-gray-light: 249 249 249;
  
  --text-primary: 24 19 22;
  --text-secondary: 74 70 74;
  --text-tertiary: 107 107 107;
}

/* Base styles */
* {
  border-color: rgb(var(--itera-gray-medium));
}

body {
  background: rgb(var(--itera-black));
  color: rgb(var(--text-primary));
  font-family: 'Inter', system-ui, sans-serif;
}

/* Smooth theme transitions */
*,
*::before,
*::after {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
```

## 2. Componentes shadcn/ui Personalizados

### 2.1 Button Component

```tsx
// components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // ÍTERA Primary
        default: "bg-itera-red text-white hover:bg-itera-red-hover hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
        
        // ÍTERA Secondary
        secondary: "bg-transparent text-white border border-itera-gray-medium hover:bg-white/5 hover:border-itera-gray-light",
        
        // ÍTERA Ghost
        ghost: "bg-transparent text-itera-gray-text-secondary hover:bg-white/5 hover:text-white",
        
        // Destructive
        destructive: "bg-red-500 text-white hover:bg-red-600",
        
        // Outline
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        
        // Link
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### 2.2 Card Component

```tsx
// components/ui/card.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }
>(({ className, interactive = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg bg-itera-gray-warm border border-itera-gray-medium p-6 shadow-itera-sm transition-all duration-300",
      interactive && "cursor-pointer hover:shadow-itera-md hover:border-itera-gray-light hover:-translate-y-0.5",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-itera-gray-text-secondary", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

### 2.3 Input Component

```tsx
// components/ui/input.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-itera-gray-text-primary">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md bg-itera-gray-light border border-itera-gray-medium px-3 py-2 text-sm text-white placeholder:text-itera-gray-text-tertiary",
            "focus:outline-none focus:ring-2 focus:ring-itera-red focus:ring-offset-2 focus:ring-offset-itera-black focus:bg-itera-black",
            "transition-all duration-200",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
```

### 2.4 Textarea Component

```tsx
// components/ui/textarea.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-itera-gray-text-primary">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md bg-itera-gray-light border border-itera-gray-medium px-3 py-2 text-sm text-white placeholder:text-itera-gray-text-tertiary",
            "focus:outline-none focus:ring-2 focus:ring-itera-red focus:ring-offset-2 focus:ring-offset-itera-black focus:bg-itera-black",
            "transition-all duration-200 resize-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
```

## 3. Componentes Específicos de ÍTERA

### 3.1 Chat Message Component

```tsx
// components/chat/ChatMessage.tsx
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"

interface ChatMessageProps {
  type: 'bot' | 'user'
  message: string
  timestamp?: Date
  quickReplies?: string[]
  onQuickReply?: (reply: string) => void
}

export const ChatMessage = ({ 
  type, 
  message, 
  timestamp, 
  quickReplies, 
  onQuickReply 
}: ChatMessageProps) => {
  const isBot = type === 'bot'
  
  return (
    <div className={cn(
      "flex gap-3 mb-6",
      !isBot && "justify-end"
    )}>
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-itera-red flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      )}
      
      <div className={cn(
        "flex flex-col space-y-2 max-w-[85%] md:max-w-[70%]",
        !isBot && "items-end"
      )}>
        <div className={cn(
          "px-4 py-3 rounded-2xl text-sm",
          isBot 
            ? "bg-itera-gray-warm text-white rounded-tl-sm" 
            : "bg-itera-red text-white rounded-tr-sm"
        )}>
          {message}
        </div>
        
        {quickReplies && quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => onQuickReply?.(reply)}
                className="px-3 py-1 text-xs bg-itera-gray-light text-itera-gray-text-secondary rounded-full hover:bg-itera-gray-medium hover:text-white transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
        
        {timestamp && (
          <span className="text-xs text-itera-gray-text-tertiary">
            {timestamp.toLocaleTimeString('es-AR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        )}
      </div>
      
      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-itera-gray-medium flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  )
}
```

### 3.2 Progress Indicator Component

```tsx
// components/ui/ProgressIndicator.tsx
import { cn } from "@/lib/utils"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export const ProgressIndicator = ({ 
  currentStep, 
  totalSteps, 
  className 
}: ProgressIndicatorProps) => {
  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            index < currentStep 
              ? "bg-itera-red" 
              : index === currentStep 
                ? "bg-itera-red/50 scale-125" 
                : "bg-itera-gray-medium"
          )}
        />
      ))}
      <span className="ml-4 text-xs text-itera-gray-text-secondary">
        {currentStep} de {totalSteps}
      </span>
    </div>
  )
}
```

### 3.3 Theme Toggle Component

```tsx
// components/ui/ThemeToggle.tsx
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Oscuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## 4. Layout Components

### 4.1 Mobile Bottom Navigation

```tsx
// components/layout/BottomNavigation.tsx
import Link from "next/link"
import { useRouter } from "next/router"
import { cn } from "@/lib/utils"
import { 
  Home, 
  MessageCircle, 
  Edit3, 
  FileText, 
  MoreHorizontal 
} from "lucide-react"

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Chat', href: '/dashboard/chat', icon: MessageCircle },
  { name: 'Editor', href: '/dashboard/editor', icon: Edit3 },
  { name: 'PressKits', href: '/dashboard/presskits', icon: FileText },
  { name: 'Más', href: '/dashboard/more', icon: MoreHorizontal },
]

export const BottomNavigation = () => {
  const router = useRouter()
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-itera-black border-t border-itera-gray-medium">
      <div className="grid grid-cols-5">
        {navigation.map((item) => {
          const isActive = router.pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-3 px-2 text-xs transition-colors",
                isActive 
                  ? "text-itera-red bg-itera-red/10" 
                  : "text-itera-gray-text-secondary hover:text-white"
              )}
            >
              <Icon size={20} className="mb-1" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

### 4.2 Desktop Sidebar

```tsx
// components/layout/Sidebar.tsx
import Link from "next/link"
import { useRouter } from "next/router"
import { cn } from "@/lib/utils"
import { 
  Home, 
  MessageCircle, 
  Edit3, 
  FileText, 
  Wrench,
  Settings,
  User
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Pre-Generator', href: '/dashboard/chat', icon: MessageCircle },
  { name: 'Editor', href: '/dashboard/editor', icon: Edit3 },
  { name: 'Mis PressKits', href: '/dashboard/presskits', icon: FileText },
  { 
    name: 'Landing Builder', 
    href: '/dashboard/builder', 
    icon: Wrench,
    badge: 'Próximamente',
    disabled: true
  },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export const Sidebar = ({ user }: SidebarProps) => {
  const router = useRouter()
  
  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow bg-itera-black border-r border-itera-gray-medium">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-itera-gray-medium">
          <h1 className="text-xl font-bold text-white">ÍTERA</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = router.pathname.startsWith(item.href)
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  isActive
                    ? "bg-itera-red text-white"
                    : item.disabled
                      ? "text-itera-gray-text-tertiary cursor-not-allowed"
                      : "text-itera-gray-text-secondary hover:bg-itera-gray-warm hover:text-white"
                )}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                <Icon 
                  size={20} 
                  className={cn(
                    "mr-3",
                    isActive ? "text-white" : "text-itera-gray-text-secondary group-hover:text-white"
                  )} 
                />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="text-xs bg-itera-gray-medium text-itera-gray-text-tertiary px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        
        {/* User Profile + Theme Toggle */}
        <div className="px-4 py-4 border-t border-itera-gray-medium">
          <div className="flex items-center justify-between mb-4">
            <ThemeToggle />
          </div>
          
          {user && (
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {user.avatar ? (
                  <img 
                    className="w-8 h-8 rounded-full" 
                    src={user.avatar} 
                    alt={user.name} 
                  />
                ) : (
                  <div className="w-8 h-8 bg-itera-gray-medium rounded-full flex items-center justify-center">
                    <User size={16} className="text-itera-gray-text-secondary" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-itera-gray-text-secondary truncate">
                  Cuenta Pro
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

### 4.3 Mobile Header

```tsx
// components/layout/MobileHeader.tsx
import { Menu, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

interface MobileHeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
  onMenuToggle?: () => void
}

export const MobileHeader = ({ 
  title, 
  showBack = false, 
  onBack, 
  onMenuToggle 
}: MobileHeaderProps) => {
  return (
    <header className="md:hidden sticky top-0 z-50 bg-itera-black/95 backdrop-blur-sm border-b border-itera-gray-medium">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center space-x-4">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="w-9 h-9"
            >
              <ArrowLeft size={20} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="w-9 h-9"
            >
              <Menu size={20} />
            </Button>
          )}
          
          <h1 className="text-lg font-semibold text-white truncate">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
```

## 5. Page Templates

### 5.1 Landing Page Template

```tsx
// pages/index.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-itera-black">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-itera-gray-medium">
        <div className="flex items-center justify-center">
          <span className="text-xl font-bold text-white">ÍTERA</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button 
            variant="ghost" 
            onClick={() => setIsAuthModalOpen(true)}
          >
            Iniciar sesión
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                  Crea tu presskit profesional en{" "}
                  <span className="text-itera-red">minutos</span>
                </h1>
                <p className="max-w-[600px] text-itera-gray-text-secondary md:text-xl">
                  Para DJs y artistas que quieren destacar sin complicaciones. 
                  Conversación guiada, diseño automático, resultado profesional.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button 
                  size="lg" 
                  className="inline-flex items-center"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="secondary" size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Ver Demo
                </Button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Placeholder for hero visual/animation */}
                <div className="aspect-square bg-gradient-to-br from-itera-red/20 to-itera-gray-warm rounded-2xl flex items-center justify-center">
                  <div className="text-6xl">🎵</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-itera-gray-warm">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
              ¿Cómo funciona?
            </h2>
            <p className="text-itera-gray-text-secondary mt-4">
              Tres pasos simples para tu presskit profesional
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Chatea",
                description: "Cuéntanos sobre tu música en una conversación natural",
                icon: "💬"
              },
              {
                step: "2", 
                title: "Personaliza",
                description: "Ve tu presskit actualizarse en tiempo real mientras editas",
                icon: "🎨"
              },
              {
                step: "3",
                title: "Comparte",
                description: "URL profesional lista para enviar a sellos, bookers y medios",
                icon: "🚀"
              }
            ].map((item, index) => (
              <Card key={index} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.step}. {item.title}
                </h3>
                <p className="text-itera-gray-text-secondary">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

### 5.2 Chat Pre-Generator Template

```tsx
// pages/dashboard/chat.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { ProgressIndicator } from "@/components/ui/ProgressIndicator"
import { Send, Eye } from "lucide-react"

const chatSteps = [
  {
    id: 1,
    question: "¡Hola! 🎵 Soy tu asistente para crear un presskit increíble. ¿Cuál es tu nombre artístico?",
    type: "text" as const,
    field: "artistName"
  },
  {
    id: 2,
    question: "Perfecto, {artistName}! Ahora cuéntame tu historia musical en tus propias palabras...",
    type: "textarea" as const,
    field: "biography"
  },
  {
    id: 3,
    question: "¿Qué géneros musicales definen tu sonido? Puedes elegir varios:",
    type: "multiselect" as const,
    field: "genres",
    options: ["Electronic", "House", "Techno", "Progressive", "Trance", "Deep House", "Tech House"]
  }
]

export default function ChatPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [messages, setMessages] = useState([
    {
      type: 'bot' as const,
      message: chatSteps[0].question,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [formData, setFormData] = useState({})
  const [showPreview, setShowPreview] = useState(false)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user' as const,
      message: inputValue,
      timestamp: new Date()
    }])

    // Update form data
    const currentStepData = chatSteps[currentStep]
    setFormData(prev => ({
      ...prev,
      [currentStepData.field]: inputValue
    }))

    // Move to next step
    if (currentStep < chatSteps.length - 1) {
      const nextStep = chatSteps[currentStep + 1]
      const nextQuestion = nextStep.question.replace('{artistName}', formData.artistName || inputValue)
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot' as const,
          message: nextQuestion,
          timestamp: new Date(),
          quickReplies: nextStep.options
        }])
        setCurrentStep(prev => prev + 1)
      }, 1000)
    }

    setInputValue("")
  }

  return (
    <div className="flex flex-col h-screen bg-itera-black">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-itera-gray-medium">
        <h1 className="text-lg font-semibold text-white">Pre-Generator</h1>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="md:hidden"
        >
          <Eye size={16} className="mr-2" />
          Preview
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${showPreview ? 'hidden md:flex' : ''}`}>
          {/* Progress Indicator */}
          <div className="p-4 border-b border-itera-gray-medium">
            <ProgressIndicator 
              currentStep={currentStep + 1} 
              totalSteps={chatSteps.length} 
            />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                type={message.type}
                message={message.message}
                timestamp={message.timestamp}
                quickReplies={message.quickReplies}
                onQuickReply={(reply) => setInputValue(reply)}
              />
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-itera-gray-medium">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu respuesta..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`w-full md:w-96 border-l border-itera-gray-medium bg-itera-gray-warm p-6 ${showPreview ? 'block' : 'hidden md:block'}`}>
          <h3 className="text-lg font-semibold text-white mb-4">Preview en Tiempo Real</h3>
          
          {/* Preview content based on form data */}
          <div className="space-y-4">
            {formData.artistName && (
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {formData.artistName}
                </h2>
              </div>
            )}
            
            {formData.biography && (
              <div>
                <h4 className="text-sm font-medium text-itera-gray-text-secondary mb-2">
                  Biografía
                </h4>
                <p className="text-sm text-white">
                  {formData.biography}
                </p>
              </div>
            )}
            
            {formData.genres && (
              <div>
                <h4 className="text-sm font-medium text-itera-gray-text-secondary mb-2">
                  Géneros
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.genres.split(',').map((genre, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-itera-red/20 text-itera-red text-xs rounded-full"
                    >
                      {genre.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-2">
            <Button 
              variant="secondary" 
              className="w-full"
              disabled={currentStep < chatSteps.length - 1}
            >
              Finalizar Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 6. Responsive Utilities

### 6.1 Mobile-First Breakpoints

```css
/* Custom responsive utilities */
@layer utilities {
  /* Mobile-first containers */
  .container-mobile {
    @apply px-4 mx-auto;
  }
  
  .container-tablet {
    @apply px-6 mx-auto max-w-4xl;
  }
  
  .container-desktop {
    @apply px-8 mx-auto max-w-7xl;
  }
  
  /* Mobile-specific utilities */
  .mobile-only {
    @apply block md:hidden;
  }
  
  .desktop-only {
    @apply hidden md:block;
  }
  
  /* Safe area padding for mobile */
  .safe-area-top {
    padding-top: env(safe-area-inset-top);
  }
  
  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  /* Mobile touch targets */
  .touch-target {
    @apply min-h-[44px] min-w-[44px];
  }
}
```

### 6.2 Animation Utilities

```css
/* Custom animations for ÍTERA */
@layer utilities {
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
  
  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }
  
  .animate-scale-in {
    animation: scale-in 0.2s ease-out;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

## 7. Implementación Tips

### 7.1 Next.js 15 App Router Structure

```
app/
├── globals.css
├── layout.tsx
├── page.tsx                 # Landing page
├── dashboard/
│   ├── layout.tsx          # Dashboard layout with sidebar
│   ├── page.tsx            # Dashboard home
│   ├── chat/
│   │   └── page.tsx        # Pre-Generator chat
│   ├── editor/
│   │   └── [id]/
│   │       └── page.tsx    # PressKit editor
│   ├── presskits/
│   │   └── page.tsx        # PressKits list
│   └── settings/
│       └── page.tsx        # Settings
└── p/
    └── [slug]/
        └── page.tsx        # Public presskit landing
```

### 7.2 State Management con Zustand

```typescript
// lib/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PresskitStore {
  currentPresskit: any
  presskits: any[]
  chatData: any
  setCurrentPresskit: (presskit: any) => void
  updateChatData: (data: any) => void
  addPresskit: (presskit: any) => void
}

export const usePresskitStore = create<PresskitStore>()(
  persist(
    (set, get) => ({
      currentPresskit: null,
      presskits: [],
      chatData: {},
      
      setCurrentPresskit: (presskit) => 
        set({ currentPresskit: presskit }),
      
      updateChatData: (data) => 
        set((state) => ({ 
          chatData: { ...state.chatData, ...data } 
        })),
      
      addPresskit: (presskit) =>
        set((state) => ({ 
          presskits: [...state.presskits, presskit] 
        })),
    }),
    {
      name: 'itera-presskit-store',
    }
  )
)
```

### 7.3 Supabase Integration Hooks

```typescript
// lib/hooks/useSupabase.ts
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const usePresskits = () => {
  const [presskits, setPresskits] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchPresskits = async () => {
      const { data, error } = await supabase
        .from('presskits')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data && !error) {
        setPresskits(data)
      }
      setLoading(false)
    }
    
    fetchPresskits()
  }, [])
  
  return { presskits, loading }
}
```

Esta guía de implementación proporciona todo lo necesario para desarrollar ÍTERA PressKit Generator con el diseño y funcionalidad especificados en la arquitectura UX, utilizando shadcn/ui y Tailwind CSS de manera optimizada para mobile-first.