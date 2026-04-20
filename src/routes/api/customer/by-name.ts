import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '#/db'

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

export const Route = createFileRoute('/api/customer/by-name')({
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
        const name = url.searchParams.get('name')?.trim()

        if (!name) {
          return Response.json(
            { error: 'Name is required' },
            { status: 400, headers: corsHeaders },
          )
        }

        const customer = await prisma.customer.findFirst({
          where: {
            name: {
              equals: name,
              mode: 'insensitive',
            },
          },
          select: {
            id: true,
          },
        })

        if (!customer) {
          return Response.json(
            { error: 'Customer not found' },
            { status: 404, headers: corsHeaders },
          )
        }

        return Response.json(
          { id: customer.id },
          { status: 200, headers: corsHeaders },
        )
      },
    },
  },
})
