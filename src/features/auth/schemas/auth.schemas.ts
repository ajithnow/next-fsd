import { z } from 'zod';

/**
 * Login form validation schema using Zod
 */
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
