import { useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { Trash2, Loader2, AlertTriangle, ChevronLeft } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import type { ProductType } from '#/types/product'
import { useDeleteProduct } from '#/hooks/use-delete-product'
import { categoryLabels } from '#/types/category'
import { PriceBlock } from '../products-layout/price-block'

export function ProductDetails({ product }: { product: ProductType }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const deleteMutation = useDeleteProduct()
  const navigate = useNavigate()

  const categoryLabel = categoryLabels[product.category]

  const handleDelete = () => {
    deleteMutation.mutate(product.slug, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
      },
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-6 sm:py-12 min-h-[calc(100vh-64px)]">
      <div className="mb-8">
        <Button
          variant="outline"
          size="sm"
          className="text-muted-foreground hover:text-foreground gap-1.5 -ml-2"
          onClick={() => navigate({ to: '/products' })}
        >
          <ChevronLeft size={16} />
          back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left Side: Image */}
        <div className="w-full sticky top-20 aspect-4/5 md:aspect-square bg-muted/20 rounded-2xl overflow-hidden border border-border/40">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Details */}
        <div className="flex flex-col py-2 md:py-6">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Category Badge */}
          <div className="mb-6 inline-flex">
            <span className="inline-flex items-center px-2.5 py-1 rounded border border-border/50 text-[11px] font-medium text-muted-foreground">
              {categoryLabel}
            </span>
          </div>

          {/* Price */}
          <div className="mb-8">
            <PriceBlock product={product} size="md" />
          </div>

          {/* Description */}
          <div className="prose prose-sm dark:prose-invert whitespace-break-spaces mb-10 text-muted-foreground leading-relaxed">
            <p>{product.description || 'لا يوجد وصف متاح لهذا المنتج.'}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-auto pt-6 border-t border-border/40">
            <Link to="/products" className="flex-1">
              <Button className="w-full rounded-xl h-12 bg-foreground text-background hover:opacity-90 transition-opacity gap-2 font-medium">
                <ChevronLeft size={18} />
                Back
              </Button>
            </Link>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex-1 rounded-xl h-12 bg-muted/60 hover:bg-muted/80 text-foreground transition-colors gap-2 font-medium border border-border/50"
            >
              {deleteMutation.isPending ? (
                <Loader2
                  size={18}
                  className="animate-spin text-muted-foreground"
                />
              ) : (
                <Trash2 size={18} className="text-muted-foreground" />
              )}
              Delete
            </Button>
          </div>
        </div>
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
                هل أنت متأكد من حذف المنتج "{product.name}"؟ لا يمكن التراجع عن
                هذا الإجراء وسيتم مسح كافة البيانات المتعلقة به.
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
  )
}
