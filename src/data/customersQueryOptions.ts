import { queryOptions } from '@tanstack/react-query'

import { getCustomers } from '#/server/get-customers'

export const customersQueryOptions = queryOptions({
  queryKey: ['customers'],
  queryFn: async () => {
    return await getCustomers()
  },
})
