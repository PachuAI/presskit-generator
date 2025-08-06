# 13. CODING STANDARDS

### Core Standards (AI Agent Requirements)

**MANDATORY rules for AI agents to prevent problematic code:**

- **Languages & Runtimes**: TypeScript 5.3+ strict mode, Node.js 20.11.0 LTS, React 18.x with Next.js 15
- **Style & Linting**: ESLint 9 + Prettier with enterprise configuration
- **NEVER use console.log in production** - Use structured logger from lib/logging/logger.ts
- **ALL API responses must use error wrapper** - Unified schema with success/error_code/message
- **Database queries ALWAYS via Supabase client** - Never raw SQL in application code
- **Secrets NEVER hardcoded** - Only via environment variables with validation
- **User inputs ALWAYS validated** - Use Zod schemas before processing
- **Authentication REQUIRED** - Middleware protects all /dashboard and /api/auth routes

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Input Validation Pattern

```typescript
// MANDATORY: Validate all API inputs
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const PresskitSchema = z.object({
  title: z.string()
    .min(2, 'Title too short')
    .max(200, 'Title too long')
    .transform(input => DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })),
  
  content_data: z.object({
    biography: z.string()
      .max(2000, 'Biography too long')
      .transform(input => DOMPurify.sanitize(input, { ALLOWED_TAGS: ['b', 'i', 'br'] }))
  })
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // REQUIRED: Validate before any processing
  const validationResult = PresskitSchema.safeParse(body);
  if (!validationResult.success) {
    throw new ValidationError('Invalid input', { 
      errors: validationResult.error.flatten() 
    });
  }
  
  const sanitizedData = validationResult.data;
  // Continue with sanitized data...
}
```

### Security Patterns

```typescript
// MANDATORY: Rate limiting on API endpoints
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    throw new TooManyRequestsError('Rate limit exceeded');
  }
  
  // Continue with normal processing...
}
```

### Performance Patterns

```typescript
// MANDATORY: Debounced API calls for real-time features
import { useDebouncedCallback } from 'use-debounce';

const PresskitEditor = ({ presskitId }: { presskitId: string }) => {
  const debouncedSave = useDebouncedCallback(
    async (field: string, value: any) => {
      try {
        await fetch(`/api/presskit/${presskitId}`, {
          method: 'PUT',
          body: JSON.stringify({ field, value })
        });
      } catch (error) {
        toast.error('Error guardando cambios');
        revertOptimisticUpdate(field);
      }
    },
    500 // 500ms delay
  );
};
```

---
