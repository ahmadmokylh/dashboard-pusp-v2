import { prisma } from '#/db'
import { postProductValidate } from '#/validate/post-product-validate'
import { createServerFn } from '@tanstack/react-start'

export const postProduct = createServerFn({ method: 'POST' })
  .inputValidator((data) => postProductValidate.parse(data))
  .handler(async ({ data }) => {
    const product = await prisma.product.create({
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        category: data.category,
        offer: data.offer,
        img: data.imageURL,
        price: data.price,
        newPrice: data.newPrice,
      },
    })

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      category: product.category,
      offer: product.offer,
      img: product.img,
      price: product.price.toString(),
      newPrice: product.newPrice?.toString() ?? null,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }
  })
