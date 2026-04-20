'use client'

import * as React from 'react'

import { NavMain } from '#/components/dashboard/nav-main'
import { NavUser } from '#/components/dashboard/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '#/components/ui/sidebar'
import { ShoppingCart, PackageSearch } from 'lucide-react'
import { NavHeader } from './nav-header'
import type { NavPrimaryProps } from '#/types/navPrimaryType'
import { linkOptions } from '@tanstack/react-router'
import { Route } from '#/routes/_dashboard/route'
import { NavQuick } from './nav-quick'

const navItems: NavPrimaryProps['items'] = [
  {
    title: 'Products',
    icon: PackageSearch,
  },

  {
    title: 'Orders',
    icon: ShoppingCart,
  },
]

const subNavItems: NavPrimaryProps['subItems'] = [
  ...linkOptions([
    {
      item: navItems[0],
      title: 'Add Products',
      to: '/add-product',
      activeOptions: { exact: false },
    },
    {
      item: navItems[0],
      title: 'Products',
      to: '/products',
      activeOptions: { exact: false },
    },

    {
      item: navItems[1],
      title: 'Order List',
      to: '/orders',

      activeOptions: { exact: false },
    },
    {
      item: navItems[1],
      title: 'Customer Info',
      to: '/customers',
      activeOptions: { exact: false },
    },
  ]),
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = Route.useLoaderData()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavQuick />
        <NavMain items={navItems} subItems={subNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
