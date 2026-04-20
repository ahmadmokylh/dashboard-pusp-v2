import type { ProductType } from '#/types/product'

export function computePrice(product: ProductType) {
  const price = Number(product.price) || 0

  if (!product.newPrice) {
    return { final: price, saved: 0, pct: 0 }
  }

  const final = Number(product.newPrice)
  const saved = price - final
  const pct = price > 0 ? Math.round((saved / price) * 100) : 0

  return { final, saved, pct }
}
