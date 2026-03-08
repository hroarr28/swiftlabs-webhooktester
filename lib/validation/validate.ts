/**
 * Server-Side Validation Helpers
 * 
 * Utilities for validating request data in API routes.
 * 
 * @see FORM_VALIDATION_PATTERN.md for usage examples
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

/**
 * Validation result (success or error)
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> };

/**
 * Validate data against a Zod schema
 * 
 * @example
 * ```ts
 * const result = validate(loginSchema, { email: 'test@example.com', password: '123' });
 * if (!result.success) {
 *   console.log(result.errors); // { password: ['Password must be at least 8 characters'] }
 * }
 * ```
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string[]> = {};
      
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      
      return { success: false, errors };
    }
    
    throw error;
  }
}

/**
 * Validate request body and return response if invalid
 * 
 * @example
 * ```ts
 * export async function POST(req: NextRequest) {
 *   const body = await req.json();
 *   const result = await validateRequest(loginSchema, body);
 *   
 *   if (!result.success) {
 *     return result.error; // Returns 400 with error details
 *   }
 *   
 *   const { email, password } = result.data;
 *   // Continue with validated data...
 * }
 * ```
 */
export async function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<
  | { success: true; data: T }
  | { success: false; error: NextResponse }
> {
  const result = validate(schema, data);
  
  if (!result.success) {
    return {
      success: false,
      error: NextResponse.json(
        {
          error: 'Validation failed',
          details: result.errors,
        },
        { status: 400 }
      ),
    };
  }
  
  return { success: true, data: result.data };
}

/**
 * Validate query parameters
 * 
 * @example
 * ```ts
 * const querySchema = z.object({
 *   page: z.coerce.number().positive(),
 *   limit: z.coerce.number().min(1).max(100),
 * });
 * 
 * export async function GET(req: NextRequest) {
 *   const result = validateQuery(querySchema, req.nextUrl.searchParams);
 *   
 *   if (!result.success) {
 *     return NextResponse.json({ error: result.errors }, { status: 400 });
 *   }
 *   
 *   const { page, limit } = result.data;
 *   // Use validated params...
 * }
 * ```
 */
export function validateQuery<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams
): ValidationResult<T> {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return validate(schema, params);
}

/**
 * Format Zod errors for display
 * 
 * @example
 * ```ts
 * const errors = formatZodErrors(zodError);
 * // { email: 'Invalid email address', password: 'Password too short' }
 * ```
 */
export function formatZodErrors(
  error: ZodError
): Record<string, string> {
  const formatted: Record<string, string> = {};
  
  error.issues.forEach((err) => {
    const path = err.path.join('.');
    formatted[path] = err.message;
  });
  
  return formatted;
}

/**
 * Safe parse with default value
 * 
 * @example
 * ```ts
 * const data = safeParse(schema, input, { name: 'Guest', email: '' });
 * // Returns default if validation fails
 * ```
 */
export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  defaultValue: T
): T {
  const result = schema.safeParse(data);
  return result.success ? result.data : defaultValue;
}

/**
 * Validate FormData
 * 
 * @example
 * ```ts
 * export async function POST(req: NextRequest) {
 *   const formData = await req.formData();
 *   const result = validateFormData(contactSchema, formData);
 *   
 *   if (!result.success) {
 *     return NextResponse.json({ errors: result.errors }, { status: 400 });
 *   }
 *   
 *   const { name, email, message } = result.data;
 *   // Process form...
 * }
 * ```
 */
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): ValidationResult<T> {
  const data: Record<string, unknown> = {};
  
  formData.forEach((value, key) => {
    // Handle multiple values (e.g., checkboxes)
    if (data[key] !== undefined) {
      if (Array.isArray(data[key])) {
        (data[key] as unknown[]).push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  });
  
  return validate(schema, data);
}

/**
 * Create a validated action (for Server Actions)
 * 
 * @example
 * ```ts
 * 'use server';
 * 
 * const createPost = createAction(blogPostSchema, async (data) => {
 *   // Data is already validated
 *   const post = await db.posts.create({ data });
 *   return { success: true, post };
 * });
 * ```
 */
export function createAction<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  handler: (data: TInput) => Promise<TOutput>
) {
  return async (input: unknown): Promise<TOutput | { error: string; details?: Record<string, string[]> }> => {
    const result = validate(schema, input);
    
    if (!result.success) {
      return {
        error: 'Validation failed',
        details: result.errors,
      };
    }
    
    return handler(result.data);
  };
}
