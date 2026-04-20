import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { Package, ShoppingBag, Users } from 'lucide-react'

import { getDashboardStats } from '#/server/dashboard-stats'

export const Route = createFileRoute('/_dashboard/')({
  loader: async () => {
    const stats = await getDashboardStats()
    return { stats }
  },
  component: Dashboard,
})

function Dashboard() {
  const { stats } = Route.useLoaderData()
  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)

  const cards = [
    {
      title: 'Products',
      description: 'Total published products',
      value: formatNumber(stats.products),
      icon: Package,
    },
    {
      title: 'Customers',
      description: 'Unique customers',
      value: formatNumber(stats.customers),
      icon: Users,
    },
    {
      title: 'Orders',
      description: 'All orders placed',
      value: formatNumber(stats.orders),
      icon: ShoppingBag,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </div>
              <card.icon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tracking-tight">
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
