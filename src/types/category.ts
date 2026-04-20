import { CATEGORY } from '#/generated/prisma/enums'

export const categoryOptions = [
  { value: CATEGORY.ALL, label: 'كل التصنيفات' },
  { value: CATEGORY.OFFERS, label: 'العروض' },
  { value: CATEGORY.ORGANIC_HONEY, label: 'العسل العضوي' },
  { value: CATEGORY.HONEY_MIXES, label: 'خلطات العسل' },
  { value: CATEGORY.HIVE_PRODUCTS, label: 'منتجات الخلية' },
  { value: CATEGORY.FARM_PRODUCTS, label: 'منتجات المزرعة' },
] as const

export const categoryLabels: Record<CATEGORY, string> = {
  ALL: 'كل التصنيفات',
  OFFERS: 'العروض',
  ORGANIC_HONEY: 'العسل العضوي',
  HONEY_MIXES: 'خلطات العسل',
  HIVE_PRODUCTS: 'منتجات الخلية',
  FARM_PRODUCTS: 'منتجات المزرعة',
}
