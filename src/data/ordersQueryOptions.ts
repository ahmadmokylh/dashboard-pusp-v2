import { queryOptions } from '@tanstack/react-query'

import { getOrders } from '#/server/get-orders'

export const ordersQueryOptions = queryOptions({
  queryKey: ['orders'],
  queryFn: async () => {
    return await getOrders()
  },
})
