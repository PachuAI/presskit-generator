# 5. COMPONENTS & SERVICES

### Service Architecture Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  API Routes  │  Auth Middleware  │  Error Handlers         │
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                           │
├─────────────────────────────────────────────────────────────┤
│ PressKit │ User  │ Template │ Export │ Payment │ Analytics │
│ Service  │Service│ Service  │Service │ Service │ Service   │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                              │
├─────────────────────────────────────────────────────────────┤
│  Supabase Client  │  File Storage  │  Cache Layer         │
└─────────────────────────────────────────────────────────────┘
```

### 1. Authentication Service
```typescript
// lib/auth/auth-service.ts
interface AuthService {
  // Authentication
  signUp(email: string, password: string, metadata?: UserMetadata): Promise<AuthResult>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
  
  // Social auth
  signInWithProvider(provider: 'google' | 'facebook'): Promise<AuthResult>;
  
  // Session management
  getCurrentUser(): Promise<User | null>;
  refreshSession(): Promise<Session | null>;
  
  // Password management
  resetPassword(email: string): Promise<void>;
  updatePassword(newPassword: string): Promise<void>;
}
```

### 2. User Profile Service
```typescript
// lib/services/user-service.ts
interface UserService {
  // Profile management
  createProfile(userData: CreateUserProfileData): Promise<UserProfile>;
  getProfile(userId: string): Promise<UserProfile | null>;
  updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>;
  deleteProfile(userId: string): Promise<void>;
  
  // Avatar management
  uploadAvatar(userId: string, file: File): Promise<string>;
  deleteAvatar(userId: string): Promise<void>;
  
  // Social media links
  updateSocialMedia(userId: string, socialMedia: SocialMediaLinks): Promise<void>;
  
  // Statistics
  getUserStats(userId: string): Promise<UserStats>;
}

interface UserStats {
  presskitCount: number;
  totalViews: number;
  totalDownloads: number;
  subscriptionStatus: string;
  accountAge: number; // days
}
```

### 3. PressKit Service
```typescript
// lib/services/presskit-service.ts
interface PresskitService {
  // CRUD operations
  createPresskit(userId: string, data: CreatePresskitData): Promise<PressKit>;
  getPressskitById(id: string, userId?: string): Promise<PressKit | null>;
  getPresskitBySlug(slug: string): Promise<PressKit | null>;
  getUserPresskits(userId: string, status?: PresskitStatus): Promise<PressKit[]>;
  updatePresskit(id: string, userId: string, updates: Partial<PressKit>): Promise<PressKit>;
  deletePresskit(id: string, userId: string): Promise<void>;
  
  // Publishing
  publishPresskit(id: string, userId: string, slug: string): Promise<PressKit>;
  unpublishPresskit(id: string, userId: string): Promise<PressKit>;
  
  // Content management
  updateContent(id: string, userId: string, content: PresskitContent): Promise<PressKit>;
  uploadMedia(presskitId: string, userId: string, files: File[]): Promise<string[]>;
  deleteMedia(presskitId: string, userId: string, mediaUrls: string[]): Promise<void>;
  
  // Analytics
  incrementViewCount(id: string): Promise<void>;
  getPresskitAnalytics(id: string, userId: string): Promise<PresskitAnalytics>;
  
  // Validation
  validatePresskitData(data: any): ValidationResult;
  generateSlug(title: string): Promise<string>;
}
```

### 4. Template Service
```typescript
// lib/services/template-service.ts
interface TemplateService {
  // Template retrieval
  getAllTemplates(userSubscription?: SubscriptionTier): Promise<Template[]>;
  getTemplateById(id: string): Promise<Template | null>;
  getTemplatesByType(type: TemplateType): Promise<Template[]>;
  
  // Template application
  applyTemplate(presskitId: string, templateId: string): Promise<PressKit>;
  previewTemplate(templateId: string, presskitData: PresskitContent): Promise<TemplatePreview>;
  
  // Template customization
  customizeTemplate(templateId: string, customizations: TemplateCustomization): Promise<CustomTemplate>;
  
  // Template management (admin)
  createTemplate(templateData: CreateTemplateData): Promise<Template>;
  updateTemplate(id: string, updates: Partial<Template>): Promise<Template>;
  activateTemplate(id: string): Promise<Template>;
  deactivateTemplate(id: string): Promise<Template>;
}
```

### 5. Export Service
```typescript
// lib/services/export-service.ts
interface ExportService {
  // PDF export
  generatePDF(presskitId: string, options: PDFExportOptions): Promise<ExportResult>;
  
  // Web export
  generateWebVersion(presskitId: string): Promise<string>; // Returns public URL
  
  // Social media export
  generateSocialAssets(presskitId: string, platform: SocialPlatform): Promise<SocialAssets>;
  
  // Export history
  getExportHistory(userId: string, presskitId?: string): Promise<ExportHistory[]>;
  getExportById(exportId: string, userId: string): Promise<ExportHistory | null>;
  
  // File management
  getDownloadUrl(exportId: string, userId: string): Promise<string>;
  deleteExport(exportId: string, userId: string): Promise<void>;
}

interface PDFExportOptions {
  format: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  quality: 'low' | 'medium' | 'high';
  includeQRCode: boolean;
  customBranding?: boolean;
}
```

### 6. Payment Service
```typescript
// lib/services/payment-service.ts
interface PaymentService {
  // Subscription management
  createSubscription(userId: string, plan: SubscriptionPlan): Promise<CheckoutSession>;
  updateSubscription(subscriptionId: string, newPlan: SubscriptionPlan): Promise<Subscription>;
  cancelSubscription(subscriptionId: string): Promise<Subscription>;
  
  // Payment processing
  processWebhook(webhookData: MercadoPagoWebhook): Promise<void>;
  verifyWebhookSignature(payload: string, signature: string): boolean;
  
  // Payment history
  getPaymentHistory(userId: string): Promise<PaymentRecord[]>;
  getPaymentById(paymentId: string): Promise<PaymentRecord | null>;
  
  // Subscription status
  getSubscriptionStatus(userId: string): Promise<SubscriptionStatus>;
  hasFeatureAccess(userId: string, feature: FeatureName): Promise<boolean>;
}
```

### 7. AI Chat Service
```typescript
// lib/services/chat-service.ts
interface ChatService {
  // Chat session management
  createChatSession(userId: string): Promise<ChatSession>;
  getChatSession(sessionId: string): Promise<ChatSession | null>;
  
  // Message handling
  sendMessage(sessionId: string, message: string): Promise<ChatResponse>;
  getMessageHistory(sessionId: string): Promise<ChatMessage[]>;
  
  // PressKit generation
  generatePresskitFromChat(sessionId: string): Promise<PresskitData>;
  
  // Context management
  updateChatContext(sessionId: string, context: ChatContext): Promise<void>;
}

interface ChatResponse {
  id: string;
  message: string;
  suggestions?: string[];
  requiresInput: boolean;
  inputType?: 'text' | 'select' | 'multiselect' | 'file';
  inputOptions?: string[];
  nextStep?: string;
}
```

### 8. Analytics Service
```typescript
// lib/services/analytics-service.ts
interface AnalyticsService {
  // Event tracking
  trackEvent(event: AnalyticsEvent): Promise<void>;
  trackPageView(userId: string | null, page: string, metadata?: any): Promise<void>;
  trackPresskitView(presskitId: string, userId: string | null): Promise<void>;
  
  // User analytics
  getUserAnalytics(userId: string, timeRange: TimeRange): Promise<UserAnalytics>;
  getPresskitAnalytics(presskitId: string, userId: string): Promise<PresskitAnalytics>;
  
  // Platform analytics (admin)
  getPlatformAnalytics(timeRange: TimeRange): Promise<PlatformAnalytics>;
  
  // Conversion tracking
  trackConversion(userId: string, conversionType: ConversionType): Promise<void>;
  getConversionFunnel(timeRange: TimeRange): Promise<ConversionFunnel>;
}
```

### 9. Notification Service
```typescript
// lib/services/notification-service.ts
interface NotificationService {
  // Email notifications
  sendWelcomeEmail(userId: string): Promise<void>;
  sendPresskitPublishedEmail(userId: string, presskitId: string): Promise<void>;
  sendSubscriptionEmail(userId: string, type: 'welcome' | 'expired' | 'renewed'): Promise<void>;
  
  // System notifications
  sendSystemAlert(message: string, severity: 'info' | 'warning' | 'error'): Promise<void>;
  
  // User notifications
  createNotification(userId: string, notification: UserNotification): Promise<void>;
  getNotifications(userId: string, unreadOnly?: boolean): Promise<UserNotification[]>;
  markNotificationRead(notificationId: string): Promise<void>;
}
```

---
