import { prisma } from '#/db'
import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'
import { deleteFromR2 } from './R2-server'

const deleteProductSchema = z.object({
  slug: z.string(),
})

export const deleteProduct = createServerFn({ method: 'POST' })
  .inputValidator((data) => deleteProductSchema.parse(data))
  .handler(async ({ data }) => {
    const product = await prisma.product.findUnique({
      where: { slug: data.slug },
    })

    if (!product) {
      throw new Error('Product not found')
    }

    await prisma.product.delete({
      where: { slug: data.slug },
    })

    // 3. Extract key from img URL and delete from R2
    const parts = product.img.split('/')
    if (parts.length >= 2) {
      const key = `${parts[parts.length - 2]}/${parts[parts.length - 1]}`
      if (key.startsWith('products/')) {
        try {
          await deleteFromR2({ data: { key } })
        } catch (e) {
          console.error('Failed to delete image from R2', e)
        }
      }
    } // Assuming the key is the last part of the URL

    return {
      message: 'Product deleted successfully',
    }
  })
