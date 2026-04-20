import { createServerFn } from '@tanstack/react-start'

import { prisma } from '#/db'

type DashboardStats = {
  products: number
  customers: number
  orders: number
}

export const getDashboardStats = createServerFn({ method: 'GET' }).handler(
  async (): Promise<DashboardStats> => {
    const [products, customers, orders] = await Promise.all([
      prisma.product.count(),
      prisma.customer.count(),
      prisma.order.count(),
    ])

    return { products, customers, orders }
  },
)
