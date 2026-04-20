import ProductsPage from '#/components/product/products-layout/products-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProductsPage />
}
