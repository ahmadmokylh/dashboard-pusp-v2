import ProductForm from '#/components/product/add/product-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/add-product/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProductForm />
}
