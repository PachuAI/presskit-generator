# 6. EXTERNAL APIS

### 1. Mercado Pago Integration

**Configuration:**
```typescript
// lib/payments/mercadopago-config.ts
const MP_CONFIG = {
  accessToken: process.env.MP_ACCESS_TOKEN!,
  publicKey: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!,
  webhookSecret: process.env.MP_WEBHOOK_SECRET!,
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.mercadopago.com' 
    : 'https://api.mercadopago.com',
  notificationUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`
};
```

**Subscription Creation:**
```typescript
// lib/payments/mercadopago-service.ts
async function createSubscription(userId: string, plan: 'pro' | 'enterprise') {
  const preapprovalData = {
    reason: `ÍTERA PressKit Generator - Plan ${plan.toUpperCase()}`,
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months',
      transaction_amount: plan === 'pro' ? 2999 : 9999, // ARS
      currency_id: 'ARS'
    },
    payer_email: user.email,
    back_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscription/success`,
    external_reference: userId,
    notification_url: MP_CONFIG.notificationUrl
  };

  const response = await fetch('https://api.mercadopago.com/preapproval', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MP_CONFIG.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(preapprovalData)
  });

  return response.json();
}
```

**Webhook Handler:**
```typescript
// app/api/webhooks/mercadopago/route.ts
export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-signature');
  const body = await request.text();
  
  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  const webhookData = JSON.parse(body);
  
  switch (webhookData.type) {
    case 'payment':
      await handlePaymentNotification(webhookData.data.id);
      break;
    case 'subscription_preapproval':
      await handleSubscriptionNotification(webhookData.data.id);
      break;
  }
  
  return NextResponse.json({ received: true });
}
```

### 2. OpenAI Integration

**Chat Configuration:**
```typescript
// lib/ai/openai-config.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const CHAT_CONFIG = {
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 1000,
  systemPrompt: `You are an AI assistant helping musicians create professional press kits. 
  Ask engaging questions to gather information about their music, background, and goals. 
  Keep responses conversational and encouraging. Always respond in Spanish for LATAM users.`
};
```

**Chat Service Implementation:**
```typescript
// lib/ai/chat-service.ts
async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  const chatMessages = [
    { role: 'system', content: CHAT_CONFIG.systemPrompt },
    ...messages.map(msg => ({ 
      role: msg.role, 
      content: msg.content 
    }))
  ];

  const completion = await openai.chat.completions.create({
    model: CHAT_CONFIG.model,
    messages: chatMessages,
    temperature: CHAT_CONFIG.temperature,
    max_tokens: CHAT_CONFIG.maxTokens,
  });

  return completion.choices[0]?.message?.content || '';
}
```

### 3. Resend Email Integration

**Email Configuration:**
```typescript
// lib/email/resend-config.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_CONFIG = {
  from: 'ÍTERA <noreply@presskit.itera.com>',
  replyTo: 'soporte@presskit.itera.com',
  templates: {
    welcome: 'welcome-template-id',
    presskitPublished: 'presskit-published-template-id',
    subscriptionWelcome: 'subscription-welcome-template-id'
  }
};
```

**Email Service:**
```typescript
// lib/email/email-service.ts
async function sendWelcomeEmail(userEmail: string, userName: string) {
  await resend.emails.send({
    from: EMAIL_CONFIG.from,
    to: [userEmail],
    subject: '¡Bienvenido a ÍTERA PressKit Generator!',
    template: EMAIL_CONFIG.templates.welcome,
    template_vars: {
      user_name: userName,
      dashboard_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      support_email: EMAIL_CONFIG.replyTo
    }
  });
}
```

### 4. Supabase Storage Integration

**File Upload Service:**
```typescript
// lib/storage/storage-service.ts
async function uploadFile(
  bucket: string, 
  path: string, 
  file: File | Buffer,
  options: UploadOptions = {}
): Promise<string> {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: options.upsert || false,
      ...options
    });

  if (error) throw error;
  
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}
```

---
