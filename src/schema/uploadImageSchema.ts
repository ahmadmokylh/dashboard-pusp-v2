import * as z from 'zod'

export const uploadImageSchema = z.object({
  fileName: z.string().trim().min(1),
  fileType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
})
