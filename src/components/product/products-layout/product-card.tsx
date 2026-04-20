import { categoryLabels } from '#/types/category'
import type { ProductType } from '#/types/product'
import { Link } from '@tanstack/react-router'
import { PriceBlock } from './price-block'
import { Badge } from '#/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { Button } from '#/components/ui/button'
import {
  AlertTriangle,
  EllipsisVertical,
  ExternalLink,
  Loader2,
  SquarePen,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { useDeleteProduct } from '#/hooks/use-delete-product'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'

export function ProductCard({ product }: { product: ProductType }) {
  const categoryLabel = categoryLabels[product.category]

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const deleteMutation = useDeleteProduct()

  const handleDelete = () => {
    deleteMutation.mutate(product.slug, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
      },
    })
  }

  return (
    <div
      className={`group flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-200 cursor-pointer ${
        product.pending
          ? 'border-dashed border-primary/40 opacity-75'
          : 'border-border/50 hover:border-border hover:shadow-sm'
      }`}
    >
      {/* Image */}
      <Link to="/products/$slug" params={{ slug: product.slug }}>
        <div className="relative h-52 overflow-hidden bg-muted/30">
          {product.pending && (
            <div className="absolute top-2 left-2 z-10 rounded-md bg-background/80 backdrop-blur-md px-2 py-1 text-[10px] font-medium text-foreground tracking-wide flex items-center gap-1.5 shadow-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Saving...
            </div>
          )}
          <img
            src={product.img}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Category bottom right */}
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary">{categoryLabel}</Badge>
          </div>
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 px-5 pt-4">
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold leading-snug tracking-tight line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {product.description}
            </p>
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <div className="mt-auto pt-2 flex items-end justify-between border-t border-border/40">
          <PriceBlock product={product as any} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="bg-foreground text-background hover:bg-foreground/80"
                size="icon-sm"
              >
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start" side="right">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link
                    to="/products/$slug"
                    params={{ slug: product.slug }}
                    className="flex items-center gap-2 w-full"
                  >
                    <ExternalLink size={16} className="text-muted-foreground" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SquarePen size={16} className="text-muted-foreground" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 size={16} className="text-muted-foreground" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-106.25 rounded-2xl">
            <DialogHeader className="flex flex-col items-center text-center gap-4 py-4">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle
                  className="text-red-600 dark:text-red-500"
                  size={24}
                />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-xl">تأكيد الحذف</DialogTitle>
                <DialogDescription>
                  هل أنت متأكد من حذف المنتج "{product.name}"؟ لا يمكن التراجع
                  عن هذا الإجراء وسيتم مسح كافة البيانات المتعلقة به.
                </DialogDescription>
              </div>
            </DialogHeader>
            <DialogFooter className="flex flex-row gap-3 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 rounded-xl h-11"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1 rounded-xl h-11 text-white bg-red-600 hover:bg-red-700"
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
              >
                {deleteMutation.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  'تأكيد الحذف'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
