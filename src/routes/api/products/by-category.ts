import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '#/db'
import { resolveCategoryParam, serializeProduct } from '#/server/product-api'

const allowedOrigins = [
  'http://localhost:3000',
  'https://your-production-domain.com',
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

export const Route = createFileRoute('/api/products/by-category')({
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

        const categoryParam = url.searchParams.get('category')
        const category = resolveCategoryParam(categoryParam)

        const page = Number(url.searchParams.get('page') || 1)
        const limit = Number(url.searchParams.get('limit') || 10)

        const skip = (page - 1) * limit

        if (!categoryParam) {
          return Response.json(
            { error: 'category query parameter is required' },
            { status: 400, headers: corsHeaders },
          )
        }

        if (!category) {
          return Response.json(
            {
              error: 'Invalid category',
              received: categoryParam,
              supported: [
                'ALL',
                'OFFERS',
                'ORGANIC_HONEY',
                'HONEY_MIXES',
                'HIVE_PRODUCTS',
                'FARM_PRODUCTS',
                'كل التصنيفات',
                'العروض',
                'العسل العضوي',
                'خلطات العسل',
                'منتجات الخلية',
                'منتجات المزرعة',
              ],
            },
            { status: 400, headers: corsHeaders },
          )
        }

        const where = category === 'ALL' ? undefined : { category }

        const [products, total] = await Promise.all([
          prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
          }),
          prisma.product.count({ where }),
        ])

        return Response.json(
          {
            data: products.map(serializeProduct),
            pagination: {
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit),
            },
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
