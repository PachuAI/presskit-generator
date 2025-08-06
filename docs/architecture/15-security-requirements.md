# 15. SECURITY REQUIREMENTS

### Input Validation & Sanitization

**MANDATORY for all external inputs:**
- **Validation Library**: Zod for schema validation in all API routes
- **Sanitization**: DOMPurify for HTML/script tag removal
- **Location**: API boundary before any processing

```typescript
// REQUIRED: Input sanitization pattern
import DOMPurify from 'isomorphic-dompurify';

const sanitizeUserInput = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};
```

### Authentication & Authorization

**Implementation Requirements:**
- **Auth Method**: Supabase Auth with Row Level Security (RLS) enforcement
- **Session Management**: JWT tokens with httpOnly cookies
- **ALL protected routes MUST verify authentication**
- **RLS policies MUST be configured on all tables**

```sql
-- MANDATORY: RLS policies
CREATE POLICY "users_own_data_only" ON user_profiles
  FOR ALL USING (auth.uid() = auth_user_id);

CREATE POLICY "users_own_presskits_only" ON presskits
  FOR ALL USING (auth.uid() = (SELECT auth_user_id FROM user_profiles WHERE id = user_id));
```

### Secrets Management

**Requirements:**
- **Development**: Environment variables in .env.local (gitignored)
- **Production**: Vercel Environment Variables with encryption
- **NEVER hardcode secrets in code**
- **Validation that required secrets are available at startup**

```typescript
// REQUIRED: Secrets validation
const requiredSecrets = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'MP_ACCESS_TOKEN',
  'OPENAI_API_KEY'
] as const;

function validateEnvironment() {
  const missing = requiredSecrets.filter(secret => !process.env[secret]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

### API Security

**Mandatory Implementation:**
- **Rate Limiting**: Redis-based rate limiting on ALL public endpoints
- **CORS Policy**: Restrictive CORS for production domain only
- **Security Headers**: Comprehensive security headers via Next.js config
- **HTTPS Enforcement**: HTTPS redirect and HSTS headers in production

### Data Protection

**Requirements:**
- **Encryption at Rest**: Supabase handles automatically
- **Encryption in Transit**: HTTPS everywhere
- **PII Handling**: Strict rules for personal identifiable information
- **Logging Restrictions**: NO sensitive data in logs ever

```typescript
// REQUIRED: PII sanitization
const sanitizeForLogging = (data: any): any => {
  const sensitiveFields = ['email', 'password', 'token', 'secret'];
  // Implementation that removes sensitive fields
};
```

### Security Headers Configuration

```typescript
// next.config.js - MANDATORY security headers
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' *.vercel-analytics.com *.mercadopago.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: *.supabase.co",
      "form-action 'self' *.mercadopago.com",
      "upgrade-insecure-requests"
    ].join('; ')
  }
];
```

### Security Testing

```typescript
// tests/security/input-validation.security.test.ts
describe('Security: Input Validation', () => {
  it('should sanitize script tags from user input', async () => {
    const maliciousInput = {
      title: '<script>alert("xss")</script>Legitimate Title'
    };

    const { req, res } = createMocks({
      method: 'POST',
      body: maliciousInput,
      headers: await getAuthHeaders()
    });

    await createPresskitHandler(req, res);

    const responseData = JSON.parse(res._getData());
    expect(responseData.data.title).toBe('Legitimate Title');
  });

  it('should enforce rate limits correctly', async () => {
    // Test multiple requests exceed rate limit
    for (let i = 0; i < 12; i++) {
      const { req, res } = createMocks({ method: 'POST' });
      await handler(req, res);
      
      if (i >= 10) {
        expect(res._getStatusCode()).toBe(429);
      }
    }
  });
});
```

### Incident Response Plan

**Security Incident Classifications:**
- **Critical**: Data breach, authentication bypass
- **High**: XSS, sensitive data exposure  
- **Medium**: Rate limit bypass, minor information disclosure
- **Low**: Outdated dependencies, configuration improvements

**Response Timeline:**
- **Critical**: Immediate response (within 1 hour)
- **High**: Response within 4 hours
- **Medium**: Response within 24 hours
- **Low**: Response within 1 week

### Compliance Considerations

**GDPR Compliance:**
- Right to data portability: Export user data via API
- Right to erasure: Complete user data deletion capability
- Data processing consent: Clear consent mechanisms

**PCI DSS (for Mercado Pago integration):**
- NO credit card data stored locally
- All payment processing via Mercado Pago APIs
- Webhook signature validation mandatory

---
