import z from 'zod'

export const contactSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, 'Full name must be at least 3 characters')
    .max(24, 'Full name must be at most 24 characters'),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
  subject: z.string().trim().min(1, 'Subject is required').max(100, 'Subject must be at most 100 characters'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be at most 1000 characters'),
  website: z.string().max(0, 'Bot detected').optional(),
  phone: z.string().max(0, 'Bot detected').optional(),
  turnstileToken: z.string().min(1, 'Please complete the verification'),
})
