# 7. CORE WORKFLOWS

### Workflow 1: User Registration & Onboarding

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant SupabaseAuth
    participant API
    participant Database

    User->>Frontend: Submit email/password
    Frontend->>SupabaseAuth: signUp()
    SupabaseAuth->>Database: Create auth.users record
    SupabaseAuth-->>Frontend: Return user + session
    
    Frontend->>API: POST /api/users/profile
    API->>Database: Create user_profiles record
    API-->>Frontend: Return profile data
    
    Frontend->>API: POST /api/notifications/welcome
    API->>ResendAPI: Send welcome email
    API-->>Frontend: Email sent confirmation
    
    Frontend->>User: Redirect to dashboard
```

### Workflow 2: Conversational PressKit Creation

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant OpenAI
    participant Database

    User->>Frontend: Start PressKit creation
    Frontend->>API: POST /api/chat/session
    API->>Database: Create chat_sessions record
    API-->>Frontend: Return session_id

    loop Chat Interaction
        User->>Frontend: Send message
        Frontend->>API: POST /api/chat/message
        API->>OpenAI: Generate response
        OpenAI-->>API: Return AI response
        API->>Database: Store message + response
        API-->>Frontend: Return response + suggestions
        Frontend->>User: Show response + input prompt
    end

    User->>Frontend: Complete chat flow
    Frontend->>API: POST /api/presskit/generate
    API->>Database: Create presskits record
    API-->>Frontend: Return presskit_id
    Frontend->>User: Redirect to editor
```

### Workflow 3: Subscription Upgrade

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant MercadoPago
    participant Database

    User->>Frontend: Select Pro plan
    Frontend->>API: POST /api/subscription/create
    API->>MercadoPago: Create preapproval
    MercadoPago-->>API: Return checkout URL
    API-->>Frontend: Return checkout URL

    Frontend->>MercadoPago: Redirect user
    User->>MercadoPago: Complete payment
    MercadoPago->>API: Webhook notification
    
    API->>Database: Update subscription status
    API->>Database: Update user features
    MercadoPago->>Frontend: Redirect to success page
    Frontend->>User: Show upgrade success
```

### Workflow 4: PressKit Publishing

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Database
    participant StorageAPI

    User->>Frontend: Click "Publish"
    Frontend->>API: POST /api/presskit/{id}/publish
    API->>Database: Check subscription limits
    
    alt Has publishing access
        API->>Database: Generate unique slug
        API->>Database: Update presskit status
        API->>StorageAPI: Generate public assets
        API-->>Frontend: Return public URL
        Frontend->>User: Show success + share options
    else No publishing access
        API-->>Frontend: Return upgrade required
        Frontend->>User: Show upgrade prompt
    end
```

### Workflow 5: PDF Export Generation

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant PDFService
    participant StorageAPI
    participant Database

    User->>Frontend: Request PDF export
    Frontend->>API: POST /api/export/pdf
    API->>Database: Create export_history record
    API-->>Frontend: Return export_id (pending)

    API->>PDFService: Generate PDF async
    PDFService->>StorageAPI: Save generated PDF
    StorageAPI-->>PDFService: Return file URL
    
    PDFService->>Database: Update export status
    Database->>Frontend: Real-time notification
    Frontend->>User: Show download ready
    
    User->>Frontend: Click download
    Frontend->>API: GET /api/export/{id}/download
    API->>StorageAPI: Get signed URL
    API-->>Frontend: Return download URL
    Frontend->>User: Start download
```

---
