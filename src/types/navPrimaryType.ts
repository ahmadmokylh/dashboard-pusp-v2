import type { User } from 'better-auth'
import type { LucideIcon } from 'lucide-react'

export interface NavPrimaryProps {
  items: {
    title: string

    icon: LucideIcon
  }[]

  subItems: {
    item: NavPrimaryProps['items'][number]
    title: string
    to: string

    activeOptions: { exact: boolean }
  }[]
}

export interface NavUserProps {
  user: User
}
