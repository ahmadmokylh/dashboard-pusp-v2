import { useMemo } from 'react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { Separator } from '#/components/ui/separator'
import { cn } from '#/lib/utils'
import { Bell, CheckCheck, CheckCircle2, Info, XCircle } from 'lucide-react'

export type NotificationItem = {
  id: string
  title: string
  description?: string
  createdAt: string
  type: 'success' | 'info' | 'default'
  event: string
  read: boolean
}

type NotificationDropdownProps = {
  notifications: NotificationItem[]
  onClearAll: () => void
  onOpen: () => void
}

export function NotificationDropdown({
  notifications,
  onClearAll,
  onOpen,
}: NotificationDropdownProps) {
  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  )

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)

    return new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      minute: '2-digit',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const emptyState = (
    <div className="flex flex-col items-center justify-center px-4 py-6 text-center text-sm text-muted-foreground">
      <Bell className="mb-2 size-5 text-muted-foreground" />
      <p>No notifications yet.</p>
      <p className="text-xs">Live updates from Socket.IO will appear here.</p>
    </div>
  )

  const badgeContent = unreadCount > 9 ? '9+' : unreadCount

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) onOpen()
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Open notifications"
        >
          <Bell className="size-5" />
          {unreadCount > 0 ? (
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full px-1 text-[11px]">
              {badgeContent}
            </Badge>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-96 p-0 shadow-lg"
        sideOffset={12}
      >
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">
            Activity
          </DropdownMenuLabel>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={onClearAll}
              disabled={notifications.length === 0}
            >
              Clear
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0
            ? emptyState
            : notifications.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  className="cursor-default px-3 py-3 focus:bg-muted/70"
                >
                  <div className="flex w-full items-start gap-3">
                    <div
                      className={cn(
                        'mt-1 rounded-full p-1.5',
                        item.type === 'success' && 'bg-emerald-50 text-emerald-600',
                        item.type === 'info' && 'bg-sky-50 text-sky-600',
                        item.type === 'default' && 'bg-amber-50 text-amber-600',
                      )}
                    >
                      {item.type === 'success' && (
                        <CheckCircle2 className="size-4" aria-hidden />
                      )}
                      {item.type === 'info' && <Info className="size-4" aria-hidden />}
                      {item.type === 'default' && (
                        <XCircle className="size-4" aria-hidden />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{item.title}</p>
                        <span className="text-[11px] text-muted-foreground">
                          {formatTime(item.createdAt)}
                        </span>
                      </div>
                      {item.description ? (
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      ) : null}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {item.event.replace(':', ' · ')}
                        </Badge>
                        {!item.read ? (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        ) : (
                          <CheckCheck className="size-3 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
        </div>
        <Separator />
        <div className="px-3 py-2 text-xs text-muted-foreground">
          Live feed from Socket.IO; newest appears first.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
