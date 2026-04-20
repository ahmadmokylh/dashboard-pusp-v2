import * as z from 'zod'
export const validateLogin = z.object({
  email: z.email(),

  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export type ValidateLogin = z.infer<typeof validateLogin>

export const validateSignUp = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),

  email: z.email(),

  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export type ValidateSignUp = z.infer<typeof validateSignUp>
