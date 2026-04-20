import type { CATEGORY } from '#/generated/prisma/enums'
import { ArSlug } from '#/lib/ar-slug'
import {
  createProductSchema,
  type CreateProductType,
} from '#/schema/createProductSchema'
import { postProduct } from '#/server/post-product-server'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
type ProductListItem = {
  id: number | string
  slug: string
  name: string
  description?: string
  imageURL: string
  price?: number
  offer?: string
  newPrice?: number
  category: CATEGORY
  isPending?: boolean
}

export function useProductForm() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const defaultValues: CreateProductType = {
    slug: '',
    name: '',
    description: '',
    imageURL: '',
    imageKey: '',
    price: undefined,
    discountType: 'percentage',
    offer: '',
    newPrice: undefined,
    category: 'ALL',
  }

  const createProductMutation = useMutation({
    mutationFn: async (product: Omit<ProductListItem, 'id' | 'isPending'>) => {
      return await postProduct({ data: product })
    },

    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ['products'] })

      const previousProducts =
        queryClient.getQueryData<ProductListItem[]>(['products']) ?? []

      const optimisticProduct: ProductListItem = {
        id: `temp-${Date.now()}`,
        ...newProduct,
        isPending: true,
      }

      queryClient.setQueryData<ProductListItem[]>(['products'], (old = []) => [
        optimisticProduct,
        ...old,
      ])

      return { previousProducts, optimisticId: optimisticProduct.id }
    },

    onError: (_error, _variables, context) => {
      queryClient.setQueryData(['products'], context?.previousProducts ?? [])
    },

    onSuccess: (savedProduct, _variables, context) => {
      queryClient.setQueryData<ProductListItem[]>(['products'], (old = []) =>
        old.map((item) =>
          item.id === context?.optimisticId
            ? {
                id: savedProduct.id,
                slug: savedProduct.slug,
                name: savedProduct.name,
                description: savedProduct.description ?? '',
                imageURL: savedProduct.img,
                price: Number(savedProduct.price),
                offer: savedProduct.offer ?? '',
                newPrice: savedProduct.newPrice
                  ? Number(savedProduct.newPrice)
                  : undefined,
                category: savedProduct.category,
              }
            : item,
        ),
      )
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return useForm({
    defaultValues,
    validators: {
      onSubmit: createProductSchema,
      onChange: createProductSchema,
    },

    onSubmit: async ({ value, formApi }) => {
      const finalPrice =
        value.discountType === 'percentage'
          ? value.price! * (1 - (value.newPrice ?? 0) / 100)
          : value.price! - (value.newPrice ?? 0)

      const offer =
        value.discountType === 'percentage' && value.newPrice
          ? `${value.newPrice}% off`
          : value.discountType === 'fixed' && value.newPrice
            ? `$${value.newPrice} off`
            : ''

      const data = {
        slug: ArSlug(value.name),
        name: value.name,
        description: value.description,
        category: value.category,
        imageURL: value.imageURL,
        price: value.price,
        offer,
        newPrice:
          finalPrice > 0 && finalPrice < value.price! ? finalPrice : undefined,
      }

      await createProductMutation.mutateAsync(data)
      toast.success('تم إضافة المنتج بنجاح')
      formApi.reset()
      navigate({ to: '/products' })
    },
  })
}
export const STEPS = [
  { id: 1, key: 'identity', label: 'Identity', desc: 'Name & category' },
  { id: 2, key: 'media', label: 'Media', desc: 'Product image' },
  { id: 3, key: 'pricing', label: 'Pricing', desc: 'Price & discount' },
] as const

export type ProductFormApi = ReturnType<typeof useProductForm>
