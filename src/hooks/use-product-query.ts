import { getProducts } from '#/server/get-products'
import { useQuery } from '@tanstack/react-query'

export type ProductListItem = {
  id: number | string
  slug: string
  name: string
  description: string
  imageURL: string
  price?: number
  offer?: string
  newPrice?: number
  category:
    | 'ALL'
    | 'OFFERS'
    | 'ORGANIC_HONEY'
    | 'HONEY_MIXES'
    | 'HIVE_PRODUCTS'
    | 'FARM_PRODUCTS'
  isPending?: boolean
}

export function useProductsQuery() {
  return useQuery<ProductListItem[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const data = await getProducts()
      return data as unknown as ProductListItem[]
    },
  })
}
