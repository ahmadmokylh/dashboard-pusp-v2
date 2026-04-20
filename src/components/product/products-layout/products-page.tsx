import { Input } from '#/components/ui/input'
import { useProductsQuery } from '#/hooks/use-product-query'
import { cn } from '#/lib/utils'
import { Link } from '@tanstack/react-router'
import { LayoutGrid, List, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { ProductCard } from './product-card'
import { ProductRow } from './product-row'

type ViewMode = 'card' | 'list'

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [search, setSearch] = useState('')

  const { data: products = [], isLoading } = useProductsQuery()

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase())) ||
      (p.description &&
        p.description.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-full px-6 py-12">
        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="mb-10 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 mb-1.5">
                Catalog
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Products
              </h1>
            </div>
            <Link
              to="/add-product"
              className="flex items-center gap-2 h-9 rounded-lg bg-foreground px-4 text-xs font-medium text-background transition-all duration-150 hover:opacity-90 active:scale-[0.98] shrink-0"
            >
              <Plus size={16} />
              Add product
            </Link>
          </div>

          {/* Controls bar */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                size={16}
              />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8 text-sm bg-muted/30 border-border/40 focus:border-border placeholder:text-muted-foreground/40"
              />
            </div>

            {/* Result count */}
            <span className="text-xs text-muted-foreground/60 hidden sm:block">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </span>

            {/* View toggle */}
            <div className="ml-auto flex items-center gap-0.5 rounded-lg border border-border/40 bg-muted/20 p-1">
              <button
                onClick={() => setViewMode('card')}
                className={cn(
                  'flex h-6 w-7 items-center justify-center rounded-md transition-all duration-150',
                  viewMode === 'card'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex h-6 w-7 items-center justify-center rounded-md transition-all duration-150',
                  viewMode === 'list'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Loading...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Search className="text-muted-foreground/30" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No products found
            </p>
            <p className="text-xs text-muted-foreground/50">
              Try adjusting your search
            </p>
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((product, i) => (
              <ProductRow
                key={product.slug}
                product={product as any}
                index={i}
              />
            ))}
          </div>
        )}

        {/* ── Footer summary ──────────────────────────────────────── */}
        {filtered.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border/30 flex items-center justify-between">
            <p className="text-xs text-muted-foreground/50">
              Showing {filtered.length} of {products.length} products
            </p>
            <div className="flex items-center gap-1">
              {[1].map((page) => (
                <button
                  key={page}
                  className="h-7 w-7 rounded-md bg-foreground text-background text-xs font-medium"
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
