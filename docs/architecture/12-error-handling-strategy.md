# 12. ERROR HANDLING STRATEGY

### General Approach
- **Error Model**: Hierarchical error system with typed errors for different domains
- **Exception Hierarchy**: Custom error classes that extend native JavaScript Error
- **Error Propagation**: Controlled propagation with error boundaries and API error responses
- **Logging Standards**: Structured JSON logs with correlation IDs for distributed tracing

### Custom Error Classes

```typescript
// lib/errors/types.ts
export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;
  abstract readonly isOperational: boolean;

  constructor(message: string, public readonly context?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      isOperational: this.isOperational
    };
  }
}

// Authentication errors
export class AuthenticationError extends AppError {
  readonly statusCode = 401;
  readonly code = 'AUTH_ERROR';
  readonly isOperational = true;
}

export class AuthorizationError extends AppError {
  readonly statusCode = 403;
  readonly code = 'AUTHORIZATION_ERROR';
  readonly isOperational = true;
}

// Business logic errors
export class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly code = 'VALIDATION_ERROR';
  readonly isOperational = true;
}

export class ResourceNotFoundError extends AppError {
  readonly statusCode = 404;
  readonly code = 'RESOURCE_NOT_FOUND';
  readonly isOperational = true;
}

export class SubscriptionLimitError extends AppError {
  readonly statusCode = 402;
  readonly code = 'SUBSCRIPTION_LIMIT_EXCEEDED';
  readonly isOperational = true;
}

// External service errors
export class ExternalServiceError extends AppError {
  readonly statusCode = 503;
  readonly code = 'EXTERNAL_SERVICE_ERROR';
  readonly isOperational = true;
}
```

### Structured Logging System

```typescript
// lib/logging/logger.ts
export interface LogContext {
  correlationId?: string;
  userId?: string;
  component: string;
  function?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private sanitizeLog(logEntry: any): any {
    const sensitive = ['password', 'token', 'secret', 'key', 'authorization'];
    const sanitized = JSON.parse(JSON.stringify(logEntry));
    
    const sanitizeValue = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      for (const [key, value] of Object.entries(obj)) {
        if (sensitive.some(s => key.toLowerCase().includes(s))) {
          obj[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          sanitizeValue(value);
        }
      }
      return obj;
    };

    return sanitizeValue(sanitized);
  }

  error(message: string, context: LogContext, error?: Error) {
    const logEntry = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      correlationId: context.correlationId || `req-${Date.now()}`,
      ...context,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      })
    };

    console.error(JSON.stringify(this.sanitizeLog(logEntry)));
  }
}

export const logger = new Logger();
```

### Error Handling Patterns

#### API Route Error Handler
```typescript
// lib/api/error-handler.ts
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logging/logger';
import { AppError } from '@/lib/errors/types';

export function handleApiError(error: unknown, context: any): NextResponse {
  const correlationId = context.correlationId || `api-${Date.now()}`;
  
  if (error instanceof AppError) {
    logger.error('Operational error occurred', { ...context, correlationId }, error);

    return NextResponse.json({
      success: false,
      error_code: error.code,
      message: error.message,
      timestamp: new Date().toISOString(),
      trace_id: correlationId
    }, { status: error.statusCode });
  }

  // Unknown error - don't expose details
  logger.error('Unknown error occurred', { ...context, correlationId }, error as Error);

  return NextResponse.json({
    success: false,
    error_code: 'INTERNAL_SERVER_ERROR',
    message: 'Internal server error occurred',
    timestamp: new Date().toISOString(),
    trace_id: correlationId
  }, { status: 500 });
}

// API route wrapper
export function withErrorHandling(
  handler: (request: Request, context: { params: any }) => Promise<NextResponse>
) {
  return async (request: Request, context: { params: any }) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error, {
        component: 'APIRoute',
        metadata: {
          method: request.method,
          url: request.url,
          params: context.params
        }
      });
    }
  };
}
```

#### React Error Boundaries
```typescript
// components/common/ErrorBoundary.tsx
'use client';

import React from 'react';
import { logger } from '@/lib/logging/logger';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

export class ErrorBoundary extends React.Component<Props, { hasError: boolean; error?: Error }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React Error Boundary caught an error', {
      component: 'ErrorBoundary',
      function: 'componentDidCatch',
      metadata: { errorInfo: errorInfo.componentStack }
    }, error);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}
```

---
