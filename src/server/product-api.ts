import { CATEGORY } from '#/generated/prisma/enums'

export const categoryParamMap: Record<string, CATEGORY> = {
  ALL: CATEGORY.ALL,
  OFFERS: CATEGORY.OFFERS,
  ORGANIC_HONEY: CATEGORY.ORGANIC_HONEY,
  HONEY_MIXES: CATEGORY.HONEY_MIXES,
  HIVE_PRODUCTS: CATEGORY.HIVE_PRODUCTS,
  FARM_PRODUCTS: CATEGORY.FARM_PRODUCTS,
  'كل التصنيفات': CATEGORY.ALL,
  العروض: CATEGORY.OFFERS,
  'العسل العضوي': CATEGORY.ORGANIC_HONEY,
  'خلطات العسل': CATEGORY.HONEY_MIXES,
  'منتجات الخلية': CATEGORY.HIVE_PRODUCTS,
  'منتجات المزرعة': CATEGORY.FARM_PRODUCTS,
}

export function resolveCategoryParam(category: string | null | undefined) {
  if (!category) return null

  return categoryParamMap[category.trim()] ?? null
}

export function serializeProduct(product: {
  id: number
  name: string
  slug: string
  description: string | null
  img: string
  offer: string | null
  category: CATEGORY
  price: { toNumber(): number }
  newPrice: { toNumber(): number } | null
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    img: product.img,
    offer: product.offer,
    category: product.category,
    price: product.price.toNumber(),
    newPrice: product.newPrice?.toNumber() ?? null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }
}
