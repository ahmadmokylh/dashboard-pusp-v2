import { deleteProduct } from '#/server/delete-product-server'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ProductListItem } from './use-product-query'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

export function useDeleteProduct() {
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (slug: string) => {
      return await deleteProduct({ data: { slug } })
    },

    onMutate: async (deletedSlug) => {
      await queryClient.cancelQueries({ queryKey: ['products'] })

      const previousProducts =
        queryClient.getQueryData<ProductListItem[]>(['products']) ?? []

      queryClient.setQueryData<ProductListItem[]>(['products'], (old = []) =>
        old.filter((product) => product.slug !== deletedSlug),
      )

      return { previousProducts }
    },

    onError: (_error, _deletedSlug, context) => {
      queryClient.setQueryData(['products'], context?.previousProducts ?? [])
      toast.error('فشل حذف المنتج. حاول مرة أخرى.')
    },

    onSuccess: () => {
      toast.success('تم حذف المنتج بنجاح')
      navigate({ to: '/products' })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
