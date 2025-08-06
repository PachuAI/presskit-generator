# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ÍTERA PressKit Generator** is a Next.js 15 application built for DJs and musicians in LATAM to create professional press kits powered by AI. The project follows enterprise-grade architecture patterns and uses Supabase for backend services.

## Development Commands

### Core Development
```bash
npm run dev          # Start development server with Turbo
npm run build        # Build for production
npm start           # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run prettier     # Check code formatting
npm run prettier:fix # Fix formatting issues
npm run typecheck    # Run TypeScript type checking
```

### Testing
```bash
npm test            # Run unit tests with Vitest
npm run test:watch  # Run tests in watch mode
npm run test:ui     # Open Vitest UI
npm run test:coverage # Run tests with coverage
npm run test:e2e    # Run Playwright E2E tests
npm run e2e:ui      # Open Playwright UI for debugging
```

### Storybook
```bash
npm run storybook      # Start Storybook dev server
npm run build-storybook # Build Storybook for production
npm run test-storybook # Run Storybook tests
```

### Analysis & Utilities
```bash
npm run analyze        # Analyze bundle size
npm run coupling-graph # Generate component relationship graph
```

## Architecture Overview

### Application Structure
The application follows Next.js 15 App Router patterns with a clear separation of concerns:

**Frontend Architecture:**
- **Authentication Flow**: Complete user registration/login with Supabase Auth
- **Dashboard System**: Protected routes with middleware-based authentication
- **Component System**: Radix UI components with Tailwind CSS and CVA styling
- **State Management**: React Context for authentication state

**Backend Architecture:**
- **API Routes**: RESTful endpoints under `/api` for auth and user management  
- **Database Layer**: Supabase with TypeScript-generated types
- **Services Layer**: Business logic encapsulated in service classes
- **Validation**: Zod schemas for runtime type validation

### Key Directories

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── (auth)/            # Auth pages group (login, register)  
│   ├── api/               # API endpoints
│   └── dashboard/         # Protected dashboard pages
├── components/            # Reusable UI components
│   ├── auth/             # Authentication forms
│   ├── dashboard/        # Dashboard-specific components  
│   ├── layout/           # Header, footer, sidebar
│   └── ui/               # Base UI components (Radix + Tailwind)
├── hooks/                # Custom React hooks
├── lib/                  # Core utilities and services
│   ├── auth/            # Authentication service layer
│   ├── services/        # Business logic services
│   ├── supabase/        # Database client configuration
│   └── validation/      # Zod schemas
└── types/               # TypeScript type definitions
```

### Authentication System
The auth system uses a multi-layer approach:
1. **Frontend**: React Context (`AuthProvider`) manages auth state
2. **Middleware**: Next.js middleware protects routes (`/dashboard`, `/presskits`, `/profile`)
3. **Backend**: Supabase Auth with custom user profiles
4. **Validation**: Zod schemas ensure data integrity

### Database Schema
- **user_profiles**: Extended user data beyond Supabase auth
- **presskits**: User-generated press kit content and metadata
- **templates**: Reusable press kit templates
- **analytics_events**: Usage tracking and analytics

## Environment Configuration

### Required Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or production URL
```

Copy `.env.local.example` to `.env.local` and configure with your Supabase credentials.

## Development Guidelines

### Cursor Agent System
This project uses specialized Cursor agents for different development tasks:
- `@dev`: Full-stack development and implementation
- `@architect`: System design and architecture decisions

### Component Development
- Use Radix UI primitives for accessible components
- Apply CVA (Class Variance Authority) for consistent styling variants
- Follow the established component patterns in `components/ui/`

### Type Safety
- Database types are auto-generated from Supabase schema
- Use Zod for runtime validation in API routes
- Maintain strict TypeScript configuration

### Testing Strategy
- Unit tests: Components and utilities with Vitest + React Testing Library
- E2E tests: Critical user flows with Playwright
- Component stories: Document components with Storybook

### Code Quality Standards
- ESLint enforces code consistency
- Prettier handles formatting
- Import ordering follows specific patterns (external → internal → relative)
- Replace `any` types with `unknown` for type safety

## Supabase Integration

### Client Configuration
- **Browser Client**: `src/lib/supabase/client.ts` for client-side operations
- **Server Client**: `src/lib/supabase/server.ts` for server-side operations (currently using browser client for compatibility)

### Service Layer Pattern
Business logic is encapsulated in service classes:
- `AuthService`: User authentication operations
- `UserService`: User profile management
- `PressskitService`: Press kit CRUD operations
- `TemplateService`: Template management

## Performance & Production

### Bundle Analysis
Run `npm run analyze` to analyze bundle size and optimize accordingly.

### Build Process
The application supports:
- Static generation for public pages
- Server-side rendering for authenticated pages
- Turbo mode for development speed

### Observability
OpenTelemetry integration is configured for production monitoring.

## Common Troubleshooting

### Build Issues
- Ensure all environment variables are properly set
- Check TypeScript compilation with `npm run typecheck`
- Verify linting passes with `npm run lint`

### Authentication Issues  
- Verify Supabase configuration in `.env.local`
- Check middleware configuration in `src/middleware.ts`
- Ensure auth service methods handle errors properly

### Database Issues
- Run type generation if schema changes: `npx supabase gen types typescript`
- Check service layer error handling
- Verify database migrations are applied