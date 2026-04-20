import { cn } from '#/lib/utils'
import type { ProductType } from '#/types/product'
import { computePrice } from './compute-price'

export function PriceBlock({
  product,
  size = 'md',
}: {
  product: ProductType
  size?: 'sm' | 'md'
}) {
  const { final, pct } = computePrice(product)
  const large = size === 'md'
  const originalPrice = Number(product.price) || 0

  return (
    <div className="flex items-baseline gap-2">
      <span
        className={cn(
          'font-semibold tabular-nums',
          large ? 'text-xl' : 'text-base',
        )}
      >
        ${final.toFixed(2)}
      </span>
      {pct > 0 && (
        <>
          <span
            className={cn(
              'text-muted-foreground line-through tabular-nums',
              large ? 'text-sm' : 'text-xs',
            )}
          >
            ${originalPrice.toFixed(2)}
          </span>
          <span
            className={cn(
              'font-medium text-emerald-600 dark:text-emerald-400',
              large ? 'text-xs' : 'text-[10px]',
            )}
          >
            -{pct}%
          </span>
        </>
      )}
    </div>
  )
}
