import { prisma } from '#/db'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

const productSlug = z.object({
  slug: z.string(),
})

export const getProductBySlug = createServerFn({ method: 'GET' })
  .inputValidator((data) => productSlug.parse(data))
  .handler(async ({ data }) => {
    const product = await prisma.product.findUnique({
      where: { slug: data.slug },
    })

    if (!product) return null

    return {
      ...product,
      price: product.price.toNumber(),
      newPrice: product.newPrice ? product.newPrice.toNumber() : null,
    }
  })
