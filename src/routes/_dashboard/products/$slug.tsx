import { ProductDetails } from '#/components/product/project-details/project-page'
import { productsQueryOptions } from '#/data/productsQueryOptions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/products/$slug')({
  loader: async ({ context, params }) => {
    const products =
      await context.queryClient.ensureQueryData(productsQueryOptions)

    const product = products.find((p) => p.slug === params.slug)

    if (!product) {
      throw new Error(`Product not found`)
    }
    return product
  },
  component: ProductPage,

  errorComponent: () => (
    <div className="flex flex-col items-center justify-center py-32 px-6">
      <div className="h-16 w-16 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
        <span className="text-2xl">🍯</span>
      </div>
      <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
      <p className="text-muted-foreground">
        The product you are trying to view does not exist.
      </p>
    </div>
  ),
})

function ProductPage() {
  const product = Route.useLoaderData()

  return <ProductDetails product={product} />
}
