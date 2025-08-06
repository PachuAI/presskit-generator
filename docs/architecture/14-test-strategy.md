# 14. TEST STRATEGY

### Testing Philosophy
- **Approach**: Test-Driven Development (TDD) for critical business logic
- **Coverage Goals**: 80% code coverage minimum, 95% for business logic
- **Test Pyramid**: 70% unit tests, 20% integration tests, 10% E2E tests

### Unit Testing

```typescript
// tests/unit/services/presskit-service.test.ts
import { validatePresskitData, InvalidPresskitDataError } from '@/lib/services/presskit-service';

describe('validatePresskitData', () => {
  const validData = {
    title: 'Test Presskit',
    artist_name: 'DJ Test',
    content_data: { biography: 'Test bio' }
  };

  describe('happy path', () => {
    it('should validate correct presskit data', () => {
      const result = validatePresskitData(validData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });
  });

  describe('error scenarios', () => {
    it('should reject data with empty title', () => {
      const invalidData = { ...validData, title: '' };
      expect(() => validatePresskitData(invalidData))
        .toThrow(InvalidPresskitDataError);
    });
  });
});
```

### Integration Testing

```typescript
// tests/integration/presskit-creation-flow.test.ts
import { createMocks } from 'node-mocks-http';
import { POST as createPresskitHandler } from '@/app/api/presskit/route';

describe('Presskit Creation Flow Integration', () => {
  beforeAll(async () => {
    await setupTestDatabase();
    testUser = await createTestUser();
  });

  it('should create presskit and update user limits', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: await getAuthHeaders(),
      body: {
        title: 'My First Presskit',
        template_type: 'basic'
      }
    });

    await createPresskitHandler(req, { params: {} });

    expect(res._getStatusCode()).toBe(201);
    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(true);
  });
});
```

### End-to-End Testing

```typescript
// tests/e2e/presskit-creation.spec.ts
import { test, expect } from '@playwright/test';

test('should create presskit through complete flow', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('text=Crear PressKit');
  
  // Fill chat questions
  await page.fill('[data-testid="chat-input"]', 'DJ E2E Test');
  await page.click('[data-testid="chat-submit"]');
  
  // Continue through workflow...
  await page.click('text=Generar mi PressKit');
  await expect(page).toHaveURL(/\/presskit\/[a-f0-9-]+\/edit/);
});
```

### CI/CD Integration

```yaml