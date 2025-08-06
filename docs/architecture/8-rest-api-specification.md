# 8. REST API SPECIFICATION

### API Overview

- **Base URL**: `https://presskit.itera.com/api`
- **Authentication**: Bearer token (JWT from Supabase)
- **Content Type**: `application/json`
- **Rate Limiting**: 100 requests/hour per user
- **API Version**: v1 (included in path)

### Authentication Endpoints

#### POST /api/auth/signup
```json
{
  "requestBody": {
    "email": "artist@example.com",
    "password": "securepassword123",
    "artist_name": "DJ Example"
  },
  "responses": {
    "201": {
      "success": true,
      "data": {
        "user": {
          "id": "uuid",
          "email": "artist@example.com",
          "email_confirmed": false
        },
        "session": {
          "access_token": "jwt-token",
          "refresh_token": "refresh-token"
        }
      }
    },
    "400": {
      "success": false,
      "error_code": "VALIDATION_ERROR",
      "message": "Email already registered"
    }
  }
}
```

#### POST /api/auth/signin
```json
{
  "requestBody": {
    "email": "artist@example.com",
    "password": "securepassword123"
  },
  "responses": {
    "200": {
      "success": true,
      "data": {
        "user": {
          "id": "uuid",
          "email": "artist@example.com"
        },
        "session": {
          "access_token": "jwt-token",
          "refresh_token": "refresh-token"
        }
      }
    }
  }
}
```

### User Profile Endpoints

#### GET /api/users/profile
```json
{
  "headers": {
    "Authorization": "Bearer jwt-token"
  },
  "responses": {
    "200": {
      "success": true,
      "data": {
        "id": "uuid",
        "email": "artist@example.com",
        "artist_name": "DJ Example",
        "avatar_url": "https://storage.url/avatar.jpg",
        "subscription_status": "pro",
        "presskit_limit": 10,
        "social_media": {
          "instagram": "@djexample"
        }
      }
    }
  }
}
```

#### PUT /api/users/profile
```json
{
  "headers": {
    "Authorization": "Bearer jwt-token"
  },
  "requestBody": {
    "artist_name": "DJ Updated Name",
    "bio": "Updated biography",
    "social_media": {
      "instagram": "@djupdated",
      "soundcloud": "soundcloud.com/djupdated"
    }
  },
  "responses": {
    "200": {
      "success": true,
      "data": {
        // Updated profile object
      }
    }
  }
}
```

### PressKit Endpoints

#### GET /api/presskits
```json
{
  "headers": {
    "Authorization": "Bearer jwt-token"
  },
  "queryParameters": {
    "status": "published",
    "limit": 10,
    "offset": 0
  },
  "responses": {
    "200": {
      "success": true,
      "data": [
        {
          "id": "uuid",
          "title": "DJ Example Press Kit",
          "status": "published",
          "is_public": true,
          "public_slug": "dj-example-press-kit",
          "view_count": 156,
          "created_at": "2024-01-15T10:30:00Z"
        }
      ],
      "pagination": {
        "total": 3,
        "limit": 10,
        "offset": 0,
        "has_more": false
      }
    }
  }
}
```

#### POST /api/presskits
```json
{
  "headers": {
    "Authorization": "Bearer jwt-token"
  },
  "requestBody": {
    "title": "My New Press Kit",
    "template_type": "electronic",
    "content_data": {
      "biography": "Artist biography...",
      "genre": ["Electronic", "House"],
      "contact_info": {
        "booking_email": "booking@artist.com"
      }
    }
  },
  "responses": {
    "201": {
      "success": true,
      "data": {
        "id": "uuid",
        "title": "My New Press Kit",
        "status": "draft",
        "template_type": "electronic",
        "content_data": {
          // Full content object
        },
        "created_at": "2024-01-15T10:30:00Z"
      }
    }
  }
}
```

### Export Endpoints

#### POST /api/export/pdf
```json
{
  "headers": {
    "Authorization": "Bearer jwt-token"
  },
  "requestBody": {
    "presskit_id": "uuid",
    "format": "A4",
    "orientation": "portrait",
    "quality": "high"
  },
  "responses": {
    "202": {
      "success": true,
      "data": {
        "export_id": "uuid",
        "status": "pending",
        "estimated_time_seconds": 30
      }
    }
  }
}
```

#### GET /api/export/{export_id}/status
```json
{
  "responses": {
    "200": {
      "success": true,
      "data": {
        "id": "uuid",
        "status": "completed",
        "file_url": "https://storage.url/presskit.pdf",
        "file_size": 2048576,
        "created_at": "2024-01-15T10:30:00Z"
      }
    }
  }
}
```

### Subscription Endpoints

#### POST /api/subscription/create
```json
{
  "headers": {
    "Authorization": "Bearer jwt-token"
  },
  "requestBody": {
    "plan": "pro"
  },
  "responses": {
    "201": {
      "success": true,
      "data": {
        "checkout_url": "https://mercadopago.com/checkout/...",
        "subscription_id": "uuid"
      }
    }
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error_code": "VALIDATION_ERROR",
  "message": "Human readable error message",
  "details": {
    "field": "specific validation errors"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "trace_id": "uuid"
}
```

### Common Error Codes
- `VALIDATION_ERROR` (400): Input validation failed
- `AUTHENTICATION_ERROR` (401): Invalid or missing authentication
- `AUTHORIZATION_ERROR` (403): Insufficient permissions
- `RESOURCE_NOT_FOUND` (404): Requested resource doesn't exist
- `SUBSCRIPTION_LIMIT_EXCEEDED` (402): User has reached subscription limits
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `EXTERNAL_SERVICE_ERROR` (503): External service unavailable
- `INTERNAL_SERVER_ERROR` (500): Unexpected server error

---
