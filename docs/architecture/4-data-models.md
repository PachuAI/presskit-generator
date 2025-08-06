# 4. DATA MODELS

### Entity Relationship Overview
```
User (1) ←→ (n) PressKit ←→ (1) Template
  ↓              ↓              ↓
UserProfile   ExportHistory   TemplateVersion
  ↓              ↓
Subscription  Analytics
  ↓
Payment
```

### Model Definitions

#### 1. User Profiles
```typescript
interface UserProfile {
  id: string;                    // UUID, matches auth.users.id
  email: string;                 // From Supabase Auth
  artist_name: string;           // Professional name
  full_name?: string;            // Legal name (optional)
  avatar_url?: string;           // Profile picture
  bio?: string;                  // Short biography
  subscription_status: 'free' | 'pro' | 'enterprise';
  presskit_limit: number;        // Based on subscription
  created_at: timestamp;
  updated_at: timestamp;
  
  // Social media (optional)
  social_media?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    soundcloud?: string;
    spotify?: string;
    youtube?: string;
  };
  
  // Contact info
  contact_email?: string;        // Business email
  phone?: string;               // Business phone
  location?: string;            // City, Country
}
```

#### 2. Press Kits
```typescript
interface PressKit {
  id: string;                    // UUID
  user_id: string;              // FK to UserProfile
  title: string;                // PressKit title
  artist_name: string;          // Artist name at creation time
  template_type: 'basic' | 'electronic' | 'band' | 'solo';
  status: 'draft' | 'published' | 'archived';
  is_public: boolean;           // Public accessibility
  public_slug?: string;         // URL-friendly slug
  
  // Content data (JSON)
  content_data: {
    // Core info
    biography: string;
    genre: string[];
    formed_date?: string;
    location: string;
    
    // Media
    profile_photo?: string;      // Supabase Storage URL
    press_photos: string[];     // Array of image URLs
    audio_samples?: {
      track_name: string;
      url: string;
      duration?: number;
    }[];
    
    // Links
    social_media: Record<string, string>;
    streaming_platforms: Record<string, string>;
    website?: string;
    
    // Press info
    achievements?: string[];
    notable_performances?: string[];
    media_coverage?: {
      publication: string;
      title: string;
      url: string;
      date: string;
    }[];
    
    // Contact
    contact_info: {
      booking_email: string;
      press_email?: string;
      management_contact?: string;
    };
    
    // Technical rider (for live acts)
    technical_rider?: {
      stage_plot?: string;       // File URL
      input_list?: string;       // File URL
      hospitality_rider?: string; // File URL
    };
  };
  
  // Metadata
  created_at: timestamp;
  updated_at: timestamp;
  published_at?: timestamp;
  view_count: number;           // Public view analytics
  download_count: number;       // PDF download analytics
}
```

#### 3. Templates
```typescript
interface Template {
  id: string;                    // UUID
  name: string;                 // Template display name
  type: 'basic' | 'electronic' | 'band' | 'solo';
  description: string;          // Template description
  is_premium: boolean;          // Requires Pro subscription
  
  // Template configuration
  config: {
    // Layout
    layout: 'single-page' | 'multi-page' | 'magazine';
    color_scheme: {
      primary: string;          // Hex color
      secondary: string;        // Hex color
      accent: string;           // Hex color
      background: string;       // Hex color
      text: string;            // Hex color
    };
    
    // Typography
    fonts: {
      heading: string;          // Font family
      body: string;            // Font family
      accent: string;          // Font family
    };
    
    // Sections
    sections: {
      name: string;            // Section identifier
      required: boolean;       // Must be included
      customizable: boolean;   // User can modify
      order: number;          // Display order
    }[];
    
    // Export settings
    export_formats: ('pdf' | 'web' | 'social')[];
    pdf_settings?: {
      page_size: 'A4' | 'Letter' | 'Legal';
      orientation: 'portrait' | 'landscape';
      margins: number;         // In mm
    };
  };
  
  created_at: timestamp;
  updated_at: timestamp;
  version: string;             // Semantic versioning
  is_active: boolean;          // Available for use
}
```

#### 4. Subscriptions
```typescript
interface Subscription {
  id: string;                    // UUID
  user_id: string;              // FK to UserProfile
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  plan: 'free' | 'pro' | 'enterprise';
  
  // Mercado Pago integration
  mp_preapproval_id?: string;   // MP subscription ID
  mp_payer_id?: string;         // MP payer ID
  
  // Billing
  current_period_start: timestamp;
  current_period_end: timestamp;
  cancel_at_period_end: boolean;
  
  // Features
  features: {
    presskit_limit: number;
    premium_templates: boolean;
    custom_branding: boolean;
    analytics_access: boolean;
    priority_support: boolean;
    export_formats: string[];
  };
  
  // Metadata
  created_at: timestamp;
  updated_at: timestamp;
  canceled_at?: timestamp;
}
```

#### 5. Export History
```typescript
interface ExportHistory {
  id: string;                    // UUID
  presskit_id: string;          // FK to PressKit
  user_id: string;              // FK to UserProfile
  export_type: 'pdf' | 'web' | 'social';
  format_details: {
    // For PDF
    page_size?: string;
    quality?: 'low' | 'medium' | 'high';
    
    // For social
    platform?: 'instagram' | 'twitter' | 'facebook';
    dimensions?: string;
  };
  
  // File info
  file_url?: string;            // Supabase Storage URL
  file_size?: number;           // Bytes
  generation_time_ms: number;   // Performance tracking
  
  // Status
  status: 'pending' | 'completed' | 'failed';
  error_message?: string;
  
  created_at: timestamp;
}
```

#### 6. Analytics Events
```typescript
interface AnalyticsEvent {
  id: string;                    // UUID
  user_id?: string;             // FK to UserProfile (null for anonymous)
  presskit_id?: string;         // FK to PressKit
  event_type: 'page_view' | 'presskit_view' | 'export_download' | 
              'template_preview' | 'subscription_upgrade' | 'user_signup';
  
  // Event data
  event_data: {
    // Common
    timestamp: timestamp;
    user_agent?: string;
    country_code?: string;       // Derived from IP
    device_type?: 'mobile' | 'desktop' | 'tablet';
    
    // Specific to event type
    [key: string]: any;
  };
  
  // Session tracking
  session_id?: string;          // Anonymous session
  
  created_at: timestamp;
}
```

#### 7. Payment Records
```typescript
interface PaymentRecord {
  id: string;                    // UUID
  user_id: string;              // FK to UserProfile
  subscription_id: string;       // FK to Subscription
  
  // Mercado Pago data
  mp_payment_id: string;        // MP payment ID
  mp_status: string;            // MP payment status
  mp_webhook_data: jsonb;       // Full webhook payload
  
  // Payment details
  amount: number;               // In cents (ARS)
  currency: 'ARS' | 'USD' | 'BRL'; // LATAM currencies
  payment_method: string;       // Card, cash, bank transfer
  
  // Timestamps
  processed_at: timestamp;
  created_at: timestamp;
}
```

### Data Relationships

1. **User → PressKits**: One-to-many, user can have multiple presskits (limited by subscription)
2. **PressKit → Template**: Many-to-one, presskit uses one template
3. **User → Subscription**: One-to-one, user has one active subscription
4. **Subscription → Payments**: One-to-many, subscription has payment history
5. **PressKit → ExportHistory**: One-to-many, presskit can be exported multiple times
6. **User → Analytics**: One-to-many, user generates multiple analytics events

### Data Validation Rules

- **Email uniqueness**: Enforced at Supabase Auth level
- **Slug uniqueness**: Public slugs must be unique across all published presskits
- **Subscription limits**: RLS policies enforce presskit limits based on subscription
- **File size limits**: Media uploads limited to 5MB per file
- **Content validation**: All user inputs sanitized with DOMPurify
- **Required fields**: Template-specific required fields enforced at API level

---
