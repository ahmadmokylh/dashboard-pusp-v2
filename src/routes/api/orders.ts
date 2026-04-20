import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { prisma } from '#/db'

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
})

const customerSchema = z.object({
  name: z.string().trim().min(1).optional(),
  phone: z.string().trim().min(3).optional(),
  addressCountry: z.string().trim().optional(),
  addressCity: z.string().trim().optional(),
  addressDetail: z.string().trim().optional(),
})

const payloadSchema = z.object({
  customer: customerSchema,
  notes: z.string().trim().optional(),
  items: z.array(orderItemSchema).nonempty(),
})

const allowedOrigins = [
  'http://localhost:3000',
  'https://shop-pups-v2.ahmadmokylh.workers.dev/',
  'https://thnayan.com/'
]

function getCorsHeaders(request: Request) {
  const origin = request.headers.get('Origin') ?? ''

  return {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export const Route = createFileRoute('/api/orders')({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        return new Response(null, {
          status: 204,
          headers: getCorsHeaders(request),
        })
      },

      POST: async ({ request }) => {
        const corsHeaders = getCorsHeaders(request)

        const parseResult = payloadSchema.safeParse(await request.json())

        if (!parseResult.success) {
          return Response.json(
            { error: 'Invalid payload', issues: parseResult.error.flatten() },
            {
              status: 400,
              headers: corsHeaders,
            },
          )
        }

        const { customer, items, notes } = parseResult.data

        const productIds = [...new Set(items.map((i) => i.productId))]

        const products = await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, price: true },
        })

        if (products.length !== productIds.length) {
          return Response.json(
            { error: 'One or more products not found' },
            {
              status: 404,
              headers: corsHeaders,
            },
          )
        }

        const productPriceMap = Object.fromEntries(
          products.map((p) => [p.id, p.price.toNumber()]),
        )

        const itemsWithPricing = items.map((item) => {
          const unitPrice = productPriceMap[item.productId]
          const subtotal = unitPrice * item.quantity
          return { ...item, unitPrice, subtotal }
        })

        const totalPrice = itemsWithPricing.reduce(
          (sum, item) => sum + item.subtotal,
          0,
        )

        let customerRecord = null

        if (customer.phone) {
          customerRecord = await prisma.customer.findFirst({
            where: { phone: customer.phone },
          })
        }

        if (!customerRecord) {
          customerRecord = await prisma.customer.create({
            data: {
              name: customer.name ?? null,
              phone: customer.phone ?? null,
              addressCountry: customer.addressCountry ?? null,
              addressCity: customer.addressCity ?? null,
              addressDetail: customer.addressDetail ?? null,
            },
          })
        }

        const order = await prisma.order.create({
          data: {
            customerId: customerRecord.id,
            totalPrice,
            notes: notes ?? null,
            items: {
              create: itemsWithPricing.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                subtotal: item.subtotal,
              })),
            },
          },
          include: {
            items: true,
          },
        })

        return Response.json(
          {
            id: order.id,
            totalPrice: order.totalPrice.toNumber(),
            itemsCount: order.items.length,
            createdAt: order.createdAt.toISOString(),
          },
          {
            status: 201,
            headers: corsHeaders, // 🔥 أهم سطر
          },
        )
      },
    },
  },
})
