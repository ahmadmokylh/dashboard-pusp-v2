import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '#/db'
import { serializeProduct } from '#/server/product-api'

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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export const Route = createFileRoute('/api/products/by-id')({
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
        const url = new URL(request.url)

        const idsParam = url.searchParams.get('ids')

        if (!idsParam) {
          return Response.json(
            { error: 'ids query parameter is required' },
            { status: 400, headers: corsHeaders },
          )
        }

        const ids = idsParam
          .split(',')
          .map((id) => Number(id.trim()))
          .filter((id) => !Number.isNaN(id))

        if (!ids.length) {
          return Response.json(
            { error: 'Invalid ids', received: idsParam },
            { status: 400, headers: corsHeaders },
          )
        }

        const products = await prisma.product.findMany({
          where: {
            id: {
              in: ids,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return Response.json(
          {
            data: products.map(serializeProduct),
            total: products.length,
          },
          {
            status: 200,
            headers: corsHeaders,
          },
        )
      },
    },
  },
})
