import type { LucideIcon } from 'lucide-react'

export interface DropdownMenuItem {
  id: string
  label: string
  icon: LucideIcon
  onClick?: () => void
}
