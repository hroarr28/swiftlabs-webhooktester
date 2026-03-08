# Form Validation Pattern

Type-safe form validation with Zod for both client and server.

## Quick Start

### 1. Install Zod

```bash
npm install zod
```

### 2. Define Schema

```typescript
// lib/validation/schemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

### 3. Validate on Server

```typescript
// app/api/auth/login/route.ts
import { validateRequest } from '@/lib/validation/validate';
import { authSchemas } from '@/lib/validation/schemas';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await validateRequest(authSchemas.login, body);
  
  if (!result.success) {
    return result.error; // Returns 400 with validation errors
  }
  
  const { email, password } = result.data;
  // Proceed with authentication...
}
```

### 4. Validate on Client

```typescript
'use client';

import { useState } from 'react';
import { authSchemas, type LoginInput } from '@/lib/validation/schemas';

export function LoginForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };
    
    // Client-side validation
    const result = authSchemas.login.safeParse(data);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    // Submit to API
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.data),
    });
    
    // Handle response...
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input type="email" name="email" />
        {errors.email && <span className="text-red-500">{errors.email}</span>}
      </div>
      
      <div>
        <input type="password" name="password" />
        {errors.password && <span className="text-red-500">{errors.password}</span>}
      </div>
      
      <button type="submit">Login</button>
    </form>
  );
}
```

## Common Schemas

### Email + Password

```typescript
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
```

### Registration with Password Confirmation

```typescript
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
```

### Contact Form

```typescript
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
```

### Search/Filter Form

```typescript
const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  sortBy: z.enum(['price', 'name', 'date']).optional(),
});
```

## Reusable Validators

```typescript
// lib/validation/schemas.ts
export const validators = {
  email: z.string().email('Invalid email address'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number'),
  
  url: z.string().url('Invalid URL'),
  
  phoneUK: z.string().regex(/^(\+44|0)7\d{9}$/, 'Invalid UK phone'),
  
  postcodeUK: z.string().regex(/^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i, 'Invalid postcode'),
  
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  
  price: z.number().positive().multipleOf(0.01),
};

// Use in schemas
const productSchema = z.object({
  name: z.string().min(1),
  price: validators.price,
  url: validators.url,
  slug: validators.slug,
});
```

## Real-World Examples

### API Route with Validation

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/validation/validate';
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await validateRequest(createUserSchema, body);
  
  if (!result.success) {
    return result.error; // Auto-formatted 400 response
  }
  
  const user = await db.users.create({
    data: result.data,
  });
  
  return NextResponse.json({ user });
}
```

### Query Parameter Validation

```typescript
// app/api/products/route.ts
import { validateQuery } from '@/lib/validation/validate';
import { z } from 'zod';

const productQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  category: z.string().optional(),
  sort: z.enum(['price', 'name', 'date']).default('date'),
});

export async function GET(req: NextRequest) {
  const result = validateQuery(productQuerySchema, req.nextUrl.searchParams);
  
  if (!result.success) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }
  
  const { page, limit, category, sort } = result.data;
  
  const products = await db.products.findMany({
    where: category ? { category } : undefined,
    orderBy: { [sort]: 'asc' },
    skip: (page - 1) * limit,
    take: limit,
  });
  
  return NextResponse.json({ products, page, limit });
}
```

### FormData Validation (File Uploads)

```typescript
// app/api/upload/route.ts
import { validateFormData } from '@/lib/validation/validate';
import { z } from 'zod';

const uploadSchema = z.object({
  file: z.instanceof(File),
  title: z.string().min(1),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const result = validateFormData(uploadSchema, formData);
  
  if (!result.success) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }
  
  const { file, title, description } = result.data;
  
  // Upload file to storage...
  const url = await uploadToStorage(file);
  
  return NextResponse.json({ url, title });
}
```

### Server Action Validation

```typescript
// app/actions/create-post.ts
'use server';

import { createAction } from '@/lib/validation/validate';
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(50),
  published: z.boolean(),
});

export const createPost = createAction(createPostSchema, async (data) => {
  const post = await db.posts.create({ data });
  return { success: true, post };
});

// Usage in component:
// const result = await createPost({ title: '...', content: '...', published: true });
// if ('error' in result) { /* Handle validation error */ }
```

### Multi-Step Form Validation

```typescript
// Step 1 schema
const step1Schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});

// Step 2 schema
const step2Schema = z.object({
  company: z.string().min(1),
  jobTitle: z.string().min(1),
});

// Step 3 schema
const step3Schema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/),
  cvc: z.string().regex(/^\d{3,4}$/),
});

// Combined schema (for final submission)
const completeFormSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
});

// In component:
function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  
  function validateStep() {
    const schema = step === 1 ? step1Schema :
                   step === 2 ? step2Schema :
                   step3Schema;
    
    const result = schema.safeParse(data);
    
    if (result.success) {
      setStep(step + 1);
    } else {
      // Show errors
    }
  }
  
  async function submitForm() {
    const result = completeFormSchema.safeParse(data);
    
    if (result.success) {
      await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(result.data),
      });
    }
  }
}
```

## Advanced Patterns

### Custom Validators

```typescript
// Custom email domain validator
const workEmailSchema = z.object({
  email: z.string().email().refine(
    (email) => !email.endsWith('@gmail.com') && !email.endsWith('@yahoo.com'),
    { message: 'Work email required (no personal emails)' }
  ),
});

// Async validation (check if email exists)
const uniqueEmailSchema = z.object({
  email: z.string().email(),
}).refine(
  async (data) => {
    const user = await db.users.findUnique({ where: { email: data.email } });
    return !user; // Returns false if user exists
  },
  { message: 'Email already registered' }
);
```

### Conditional Fields

```typescript
const productSchema = z.object({
  type: z.enum(['physical', 'digital']),
  name: z.string().min(1),
  price: z.number().positive(),
  weight: z.number().positive().optional(),
  downloadUrl: z.string().url().optional(),
}).refine(
  (data) => {
    // Physical products require weight
    if (data.type === 'physical' && !data.weight) {
      return false;
    }
    // Digital products require download URL
    if (data.type === 'digital' && !downloadUrl) {
      return false;
    }
    return true;
  },
  {
    message: 'Missing required field for product type',
    path: ['type'],
  }
);
```

### Transform Values

```typescript
const settingsSchema = z.object({
  email: z.string().email().toLowerCase(), // Auto-lowercase
  age: z.coerce.number(), // Convert string to number
  tags: z.string().transform((str) => str.split(',')), // "tag1,tag2" → ["tag1", "tag2"]
  acceptTerms: z.enum(['on', 'true', '1']).transform(() => true), // Checkbox → boolean
});
```

### Nested Objects

```typescript
const addressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  postcode: z.string().regex(/^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i),
});

const orderSchema = z.object({
  customerName: z.string().min(1),
  email: z.string().email(),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'At least one item required'),
});
```

### Discriminated Unions

```typescript
const paymentSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('card'),
    cardNumber: z.string().regex(/^\d{16}$/),
    expiryDate: z.string().regex(/^\d{2}\/\d{2}$/),
    cvc: z.string().regex(/^\d{3,4}$/),
  }),
  z.object({
    method: z.literal('paypal'),
    paypalEmail: z.string().email(),
  }),
  z.object({
    method: z.literal('bank_transfer'),
    accountNumber: z.string(),
    sortCode: z.string().regex(/^\d{2}-\d{2}-\d{2}$/),
  }),
]);

// TypeScript knows which fields are available based on `method`
```

## Client-Side Validation (React)

### Basic Form with Errors

```typescript
'use client';

import { useState } from 'react';
import { contactSchema } from '@/lib/validation/schemas';

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    // Validate
    const result = contactSchema.safeParse(data);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }
    
    // Submit
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.data),
    });
    
    if (response.ok) {
      alert('Message sent!');
      e.currentTarget.reset();
    } else {
      const { errors } = await response.json();
      setErrors(errors);
    }
    
    setLoading(false);
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Name</label>
        <input type="text" name="name" className="border p-2 w-full" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      
      <div>
        <label>Email</label>
        <input type="email" name="email" className="border p-2 w-full" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      
      <div>
        <label>Message</label>
        <textarea name="message" rows={4} className="border p-2 w-full" />
        {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

### Real-Time Validation (onChange)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';

const emailSchema = z.string().email('Invalid email address');

export function EmailInput() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (email === '') {
      setError('');
      return;
    }
    
    const result = emailSchema.safeParse(email);
    setError(result.success ? '' : result.error.errors[0].message);
  }, [email]);
  
  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`border p-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
```

## Testing

### Unit Tests

```typescript
// __tests__/validation.test.ts
import { authSchemas } from '@/lib/validation/schemas';

describe('Login Schema', () => {
  it('validates correct input', () => {
    const result = authSchemas.login.safeParse({
      email: 'test@example.com',
      password: 'Password123',
    });
    
    expect(result.success).toBe(true);
  });
  
  it('rejects invalid email', () => {
    const result = authSchemas.login.safeParse({
      email: 'not-an-email',
      password: 'Password123',
    });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Invalid email');
    }
  });
  
  it('rejects short password', () => {
    const result = authSchemas.login.safeParse({
      email: 'test@example.com',
      password: '123',
    });
    
    expect(result.success).toBe(false);
  });
});
```

## Summary

- ✅ Use Zod for type-safe validation
- ✅ Define schemas once, use on client and server
- ✅ Use `validateRequest()` for API routes
- ✅ Use `validateQuery()` for query parameters
- ✅ Use `validateFormData()` for file uploads
- ✅ Use `createAction()` for Server Actions
- ✅ Always validate on server (client validation is for UX only)
- ✅ Export TypeScript types with `z.infer<>`

**Common Patterns:**
- Login/register forms → Email + password validation
- Contact forms → Required fields + email
- Search/filter → Optional fields with defaults
- Multi-step forms → Validate each step separately
- File uploads → FormData validation with File type
- Settings forms → Boolean fields with transforms

**Next Steps:**
1. Install Zod: `npm install zod`
2. Define schemas in `lib/validation/schemas.ts`
3. Add validation to API routes
4. Add client-side validation to forms
5. Write tests for critical schemas
