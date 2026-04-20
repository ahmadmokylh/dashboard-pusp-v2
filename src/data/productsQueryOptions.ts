import { queryOptions } from '@tanstack/react-query'
import { getProducts } from '#/server/get-products'

export const productsQueryOptions = queryOptions({
  queryKey: ['products'],
  queryFn: async () => {
    return await getProducts()
  },
})
