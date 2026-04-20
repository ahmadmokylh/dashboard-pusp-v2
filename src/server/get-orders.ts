import { createServerFn } from '@tanstack/react-start'

import { prisma } from '#/db'

export type OrderListItem = {
  id: number
  totalPrice: number
  notes: string | null
  createdAt: string
  customer: {
    name: string | null
    phone: string | null
    addressCountry: string | null
    addressCity: string | null
    addressDetail: string | null
  }
  items: Array<{
    productName: string
    quantity: number
    unitPrice: number
    subtotal: number
  }>
}

export const getOrders = createServerFn({ method: 'GET' }).handler(
  async (): Promise<OrderListItem[]> => {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            name: true,
            phone: true,
            addressCountry: true,
            addressCity: true,
            addressDetail: true,
          },
        },
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
    })

    return orders.map((order) => ({
      id: order.id,
      totalPrice: order.totalPrice.toNumber(),
      notes: order.notes,
      createdAt: order.createdAt.toISOString(),
      customer: {
        name: order.customer?.name ?? null,
        phone: order.customer?.phone ?? null,
        addressCountry: order.customer?.addressCountry ?? null,
        addressCity: order.customer?.addressCity ?? null,
        addressDetail: order.customer?.addressDetail ?? null,
      },
      items: order.items.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toNumber(),
        subtotal: item.subtotal.toNumber(),
      })),
    }))
  },
)
