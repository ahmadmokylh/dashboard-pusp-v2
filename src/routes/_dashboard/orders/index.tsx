import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { createFileRoute } from '@tanstack/react-router'

import { ordersQueryOptions } from '#/data/ordersQueryOptions'

export const Route = createFileRoute('/_dashboard/orders/')({
  loader: async ({ context }) => {
    const orders = await context.queryClient.ensureQueryData(ordersQueryOptions)
    return { orders }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { orders } = Route.useLoaderData()

  const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  })

  const dateFmt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Recent orders with customer and line items.
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {orders.length} total
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-2 pr-4 text-left font-medium">Order #</th>
                <th className="py-2 pr-4 text-left font-medium">Customer</th>
                <th className="py-2 pr-4 text-left font-medium">Items</th>
                <th className="py-2 pr-4 text-left font-medium">Notes</th>
                <th className="py-2 pr-4 text-right font-medium">Total</th>
                <th className="py-2 pr-4 text-right font-medium">Date</th>
                <th className="py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-b-0 align-top"
                >
                  <td className="py-3 pr-4 font-medium text-foreground/90">
                    #{order.id}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-medium">
                      {order.customer.name ?? 'Unnamed'}
                    </div>
                    <div className="text-muted-foreground">
                      {order.customer.phone ?? '—'}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <ul className="space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex items-center justify-between gap-2">
                          <div className="truncate">
                            {item.productName} × {item.quantity}
                          </div>
                          <div className="text-muted-foreground">
                            {currency.format(item.subtotal)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {order.notes ?? '—'}
                  </td>
                  <td className="py-3 pr-4 text-right font-semibold">
                    {currency.format(order.totalPrice)}
                  </td>
                  <td className="py-3 pr-4 text-right text-muted-foreground">
                    {dateFmt.format(new Date(order.createdAt))}
                  </td>
                  <td className="py-3 text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          View customer
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Customer info</DialogTitle>
                          <DialogDescription>
                            Order #{order.id}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 text-sm">
                          <Row label="Name" value={order.customer.name} />
                          <Row label="Phone" value={order.customer.phone} />
                          <Row
                            label="Address"
                            value={formatAddress(order.customer)}
                          />
                        </div>
                        <DialogFooter showCloseButton />
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              No orders yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value ?? '—'}</span>
    </div>
  )
}

function formatAddress(customer: {
  addressCountry: string | null
  addressCity: string | null
  addressDetail: string | null
}) {
  const parts = [
    customer.addressCountry,
    customer.addressCity,
    customer.addressDetail,
  ].filter(Boolean)
  return parts.length ? parts.join(' · ') : null
}
