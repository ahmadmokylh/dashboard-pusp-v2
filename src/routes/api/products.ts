import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '#/db'
import { serializeProduct } from '#/server/product-api'

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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export const Route = createFileRoute('/api/products')({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        return new Response(null, {
          status: 204,
          headers: getCorsHeaders(request),
        })
      },
      GET: async ({ request }) => {
        const corsHeaders = getCorsHeaders(request)
        const products = await prisma.product.findMany({
          orderBy: { createdAt: 'desc' },
        })
        return Response.json(products.map(serializeProduct), {
          status: 200,
          headers: corsHeaders,
        })
      },
    },
  },
})
