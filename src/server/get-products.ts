import { prisma } from '#/db'
import { createServerFn } from '@tanstack/react-start'
import { serializeProduct } from './product-api'

export const getProducts = createServerFn({ method: 'GET' }).handler(
  async () => {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return products.map(serializeProduct)
  },
)
