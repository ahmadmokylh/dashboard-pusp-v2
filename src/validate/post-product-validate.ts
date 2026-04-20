import { CATEGORY } from '#/generated/prisma/enums'
import * as z from 'zod'

export const postProductValidate = z.object({
  slug: z.string(),
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  category: z.enum(CATEGORY).default(CATEGORY.ALL),
  imageURL: z.string().min(1),
  price: z.number().positive(),
  offer: z.string().max(100).optional(),
  newPrice: z.number().positive().optional(),
})
