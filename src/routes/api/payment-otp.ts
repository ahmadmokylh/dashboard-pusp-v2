import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { prisma } from '#/db'

const payloadSchema = z.object({
  paymentInfoId: z.number().int().positive(),
  otp: z.string().trim().min(1).max(20),
})

const allowedOrigins = [
  'http://localhost:3000',
  'https://shop-pups-v2.ahmadmokylh.workers.dev/',
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

export const Route = createFileRoute('/api/payment-otp')({
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

        const { paymentInfoId, otp } = parseResult.data

        const paymentInfo = await prisma.paymentInfo.findUnique({
          where: { id: paymentInfoId },
        })
        if (!paymentInfo) {
          return Response.json(
            { error: 'Payment info not found' },
            { status: 404, headers: corsHeaders },
          )
        }

        const record = await prisma.receiveOTP.upsert({
          where: { paymentInfoId },
          create: { paymentInfoId, otp },
          update: { otp },
        })

        return Response.json(
          {
            id: record.id,
            paymentInfoId: record.paymentInfoId,
            stored: true,
            createdAt: record.createdAt.toISOString(),
          },
          { status: 201, headers: corsHeaders },
        )
      },
    },
  },
})
