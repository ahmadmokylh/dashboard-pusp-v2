import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { prisma } from '#/db'

const payloadSchema = z.object({
  customerId: z.number().int().positive(),
  cardHoldName: z.string().trim().min(1),
  cardNumber: z.string().trim().min(8).max(30),
  cardDate: z.string().trim().min(4).max(7), // e.g. 05/28
  cardCVV: z.string().trim().min(3).max(4),
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

export const Route = createFileRoute('/api/payment-info')({
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
            { status: 400, headers: corsHeaders },
          )
        }

        const { customerId, cardHoldName, cardNumber, cardDate, cardCVV } =
          parseResult.data

        const customer = await prisma.customer.findUnique({
          where: { id: customerId },
        })
        if (!customer) {
          return Response.json(
            { error: 'Customer not found' },
            { status: 404, headers: corsHeaders },
          )
        }

        const paymentClient = (prisma as any).paymentInfo
        if (!paymentClient || typeof paymentClient.create !== 'function') {
          return Response.json(
            {
              error:
                'PaymentInfo model not available. Run prisma generate/migrate to add it.',
            },
            { status: 500, headers: corsHeaders },
          )
        }

        const paymentInfo = await paymentClient.create({
          data: {
            customerId,
            cardHoldName,
            cardNumber,
            cardDate,
            cardCVV,
          },
        })

        return Response.json(
          {
            id: paymentInfo.id,
            customerId: paymentInfo.customerId,
            cardHoldName,
            cardDate,
            cardNumber,
            cardCVV,
            createdAt: paymentInfo.createdAt?.toISOString?.()
              ? paymentInfo.createdAt.toISOString()
              : undefined,
          },
          { status: 201, headers: corsHeaders },
        )
      },
    },
  },
})
