import { CATEGORY } from '#/generated/prisma/enums'
import * as z from 'zod'

export const createProductSchema = z
  .object({
    slug: z.string(),
    name: z
      .string('الاسم مطلوب')
      .min(3, 'الاسم يجب أن يكون حرفين على الأقل')
      .max(100),
    description: z.string().optional(),
    imageURL: z.string().min(1, 'الصورة مطلوبة'),
    imageKey: z.string().min(1, 'مفتاح الصورة مطلوب'),
    price: z
      .number('السعر مطلوب')
      .positive('السعر يجب أن يكون أكبر من صفر')
      .multipleOf(0.01)
      .optional(),
    discountType: z.enum(['percentage', 'fixed']).optional(),
    newPrice: z
      .number()
      .positive('السعر الجديد يجب أن يكون أكبر من صفر')
      .multipleOf(0.01)
      .optional(),
    offer: z.string().max(100).optional(),
    category: z.enum(CATEGORY),
  })
  .refine(
    (data) =>
      data.newPrice === undefined ||
      data.price === undefined ||
      data.newPrice < data.price,
    {
      message: 'السعر الجديد يجب أن يكون أقل من السعر الأصلي',
      path: ['newPrice'],
    },
  )

export type CreateProductType = z.infer<typeof createProductSchema>
