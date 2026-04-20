import type { CreateProductType } from '#/schema/createProductSchema'

type Category = CreateProductType['category']

export interface ProductType {
  id: number
  name: string
  slug: string
  description: string | null
  img: string
  offer: string | null
  category: Category
  price: number
  newPrice: number | null
  createdAt: string
  updatedAt: string
  pending?: boolean
}

export type ProductSType = {
  id: number
  slug: string
  name: string
  description: string | null
  img: string
  price: string
  newPrice: string | null
  offer: string | null
  category: Category
  createdAt: string
  updatedAt: string
}
