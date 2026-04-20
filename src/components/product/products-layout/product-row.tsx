import { Badge } from '#/components/ui/badge'
import { categoryLabels } from '#/types/category'
import type { ProductType } from '#/types/product'
import { PriceBlock } from './price-block'

import { Link } from '@tanstack/react-router'

export function ProductRow({
  product,
  index,
}: {
  product: ProductType
  index: number
}) {
  const categoryLabel = categoryLabels[product.category]

  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className={`group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 rounded-xl border px-3 sm:px-4 py-3.5 transition-all duration-150 cursor-pointer ${
        product.pending
          ? 'border-dashed border-primary/40 bg-muted/10 opacity-75'
          : 'border-border/40 bg-card hover:border-border hover:bg-muted/20'
      }`}
    >
      {/* Top Row */}
      <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
        {/* Index */}
        <span className="hidden sm:block text-[11px] font-medium text-muted-foreground/40 w-5 tabular-nums shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Thumbnail */}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted/30">
          {product.pending && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm z-10">
              <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
            </div>
          )}
          <img
            src={product.img}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Info */}
        <div className="flex flex-1 min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold leading-none tracking-tight truncate">
              {product.name}
            </span>
            {product.pending && (
              <span className="text-[10px] font-medium text-primary px-1.5 py-0.5 rounded-sm bg-primary/10">
                Saving...
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">
            {product.description}
          </p>

          <Badge variant="secondary" className="w-fit">
            {categoryLabel}
          </Badge>
        </div>
      </div>

      {/* Bottom Row for mobile */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
        {/* Price */}
        <div className="shrink-0 text-right">
          <PriceBlock product={product as any} size="sm" />
        </div>

        {/* Action */}
        <button className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-background transition-all duration-150 hover:border-foreground/30 hover:bg-muted/50 active:scale-95 sm:opacity-0 sm:group-hover:opacity-100">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1.5v9M1.5 6h9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </Link>
  )
}
