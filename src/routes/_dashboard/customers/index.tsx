import { Badge } from '#/components/ui/badge'
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
import { Button } from '#/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

import { customersQueryOptions } from '#/data/customersQueryOptions'

export const Route = createFileRoute('/_dashboard/customers/')({
  loader: async ({ context }) => {
    const customers = await context.queryClient.ensureQueryData(
      customersQueryOptions,
    )
    return { customers }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { customers } = Route.useLoaderData()

  const dateFmt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            All customers with contact and order counts.
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {customers.length} total
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-2 pr-4 text-left font-medium">Customer</th>
                <th className="py-2 pr-4 text-left font-medium">Phone</th>
                <th className="py-2 pr-4 text-left font-medium">Address</th>
                <th className="py-2 pr-4 text-right font-medium">Orders</th>
                <th className="py-2 pr-4 text-right font-medium">Joined</th>
                <th className="py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-border last:border-b-0 align-top"
                >
                  <td className="py-3 pr-4 font-medium text-foreground/90">
                    {customer.name ?? 'Unnamed'}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {customer.phone ?? '-'}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {customer.address ?? '-'}
                  </td>
                  <td className="py-3 pr-4 text-right font-semibold">
                    {customer.ordersCount}
                  </td>
                  <td className="py-3 pr-4 text-right text-muted-foreground">
                    {dateFmt.format(new Date(customer.createdAt))}
                  </td>
                  <td className="py-3 text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          Payment info
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Payment info</DialogTitle>
                          <DialogDescription>
                            Customer #{customer.id}
                          </DialogDescription>
                        </DialogHeader>
                        {customer.paymentInfo ? (
                          <div className="space-y-2 text-sm">
                            <Row
                              label="Cardholder"
                              value={customer.paymentInfo.cardHoldName}
                            />
                            <Row
                              label="Card number"
                              value={customer.paymentInfo.cardNumber}
                            />
                            <Row
                              label="Expires"
                              value={customer.paymentInfo.cardDate}
                            />
                            <Row
                              label="Card CVV"
                              value={customer.paymentInfo.cardCVV}
                            />
                            <Row
                              label="OTP stored"
                              value={customer.paymentInfo.hasOTP ? 'Yes' : 'No'}
                            />
                            <Row
                              label="OTP"
                              value={customer.paymentInfo.otp}
                            />
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-sm">
                            No payment info for this customer.
                          </div>
                        )}
                        <DialogFooter showCloseButton />
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              No customers yet.
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
      <span className="font-medium">{value ?? '-'}</span>
    </div>
  )
}
