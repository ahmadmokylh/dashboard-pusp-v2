'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import type { TabsItemProps } from '#/types/tabsItem'
import { Crosshair, Lock, User } from 'lucide-react'
import { TabProfile } from './tab-profile'
import { CardTitle } from '../ui/card'

// ─── Types ────────────────────────────────────────────────────────────────────

type Theme = 'light' | 'dark' | 'system'
type FontStyle = 'sans' | 'serif' | 'mono'
type Density = 'compact' | 'default' | 'comfortable'
type PasswordStrength = 0 | 1 | 2 | 3 | 4

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPasswordStrength(val: string): PasswordStrength {
  let score = 0
  if (val.length >= 8) score++
  if (/[A-Z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[^A-Za-z0-9]/.test(val)) score++
  return score as PasswordStrength
}

const STRENGTH_LABEL: Record<PasswordStrength, string> = {
  0: '',
  1: 'Weak',
  2: 'Fair',
  3: 'Good',
  4: 'Strong',
}
const STRENGTH_COLOR: Record<PasswordStrength, string> = {
  0: '',
  1: 'bg-red-500',
  2: 'bg-amber-500',
  3: 'bg-blue-500',
  4: 'bg-emerald-500',
}

// ─── Micro-components ─────────────────────────────────────────────────────────

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60 mb-4 mt-8">
      {children}
    </CardTitle>
  )
}

export function SettingCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      {children}
    </div>
  )
}

export function ToggleRow({
  label,
  description,
  defaultChecked = false,
  onToggle,
}: {
  label: string
  description: string
  defaultChecked?: boolean
  onToggle?: (checked: boolean) => void
}) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40 last:border-b-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {description}
        </p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={(v) => {
          setChecked(v)
          onToggle?.(v)
        }}
      />
    </div>
  )
}

export function FieldLabel({
  children,
  optional,
}: {
  children: React.ReactNode
  optional?: boolean
}) {
  return (
    <Label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
      {children}
      {optional && (
        <span className="ml-1.5 normal-case font-normal tracking-normal">
          — optional
        </span>
      )}
    </Label>
  )
}

// ─── Tabs  config ──────────────────────────────────────────────────────────────

const TABS_ITEMS: TabsItemProps[] = [
  {
    value: 'profile',
    title: 'Profile',
    icon: User,
  },
  {
    value: 'security',
    title: 'Security',
    icon: Lock,
  },
  {
    value: 'appearance',
    title: 'Appearance',
    icon: Crosshair,
  },
]

// ─── Tab: Security ────────────────────────────────────────────────────────────

function TabSecurity() {
  const [password, setPassword] = useState('')
  const strength = getPasswordStrength(password)

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-xl font-semibold tracking-tight">Security</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your password, sessions, and two-factor authentication.
        </p>
      </div>

      <SectionTitle>Password</SectionTitle>
      <SettingCard>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <FieldLabel>Current password</FieldLabel>
            <Input
              type="password"
              placeholder="Enter current password"
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel>New password</FieldLabel>
            <Input
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-9 text-sm"
            />
            <div className="flex items-center gap-1.5 mt-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'h-[3px] flex-1 rounded-full transition-colors duration-300',
                    password.length > 0 && i <= strength
                      ? STRENGTH_COLOR[strength]
                      : 'bg-border',
                  )}
                />
              ))}
              {password.length > 0 && (
                <span
                  className={cn(
                    'text-[10px] font-medium ml-1 min-w-[36px]',
                    strength === 1 && 'text-red-500',
                    strength === 2 && 'text-amber-500',
                    strength === 3 && 'text-blue-500',
                    strength === 4 && 'text-emerald-500',
                  )}
                >
                  {STRENGTH_LABEL[strength]}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <FieldLabel>Confirm new password</FieldLabel>
            <Input
              type="password"
              placeholder="Repeat new password"
              className="h-9 text-sm"
            />
          </div>
        </div>
        <div className="px-5 py-3 border-t border-border/40 flex justify-end">
          <Button
            size="sm"
            className="text-xs h-8"
            onClick={() => toast.success('Password updated')}
          >
            Update password
          </Button>
        </div>
      </SettingCard>

      <SectionTitle>Two-factor authentication</SectionTitle>
      <SettingCard>
        <ToggleRow
          label="Authenticator app"
          description="Use an app like Google Authenticator or Authy"
          onToggle={(v) =>
            toast.success(`Authenticator app ${v ? 'enabled' : 'disabled'}`)
          }
        />
        <ToggleRow
          label="SMS verification"
          description="Receive a code via text message"
          defaultChecked
          onToggle={(v) =>
            toast.success(`SMS verification ${v ? 'enabled' : 'disabled'}`)
          }
        />
      </SettingCard>

      <SectionTitle>Active sessions</SectionTitle>
      <SettingCard>
        {[
          {
            device: 'Chrome on macOS',
            location: 'Irbid, Jordan',
            time: 'Current session',
            isCurrent: true,
            icon: 'desktop',
          },
          {
            device: 'Safari on iPhone',
            location: 'Amman, Jordan',
            time: '2 days ago',
            isCurrent: false,
            icon: 'mobile',
          },
        ].map((session) => (
          <div
            key={session.device}
            className="flex items-center gap-3 px-5 py-3.5 border-b border-border/40 last:border-b-0"
          >
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              {session.icon === 'desktop' ? (
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="1.5"
                    y="3"
                    width="13"
                    height="9"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M5 14h6M8 12v2"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="4.5"
                    y="1"
                    width="7"
                    height="14"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <circle cx="8" cy="12" r=".8" fill="currentColor" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{session.device}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                <span
                  className={cn(
                    'inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle',
                    session.isCurrent ? 'bg-emerald-500' : 'bg-amber-500',
                  )}
                />
                {session.time} · {session.location}
              </p>
            </div>
            {session.isCurrent ? (
              <span className="text-[11px] text-muted-foreground border border-border/50 px-2 py-0.5 rounded-md">
                This device
              </span>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 text-destructive hover:text-destructive"
                onClick={() => toast.success('Session revoked')}
              >
                Revoke
              </Button>
            )}
          </div>
        ))}
      </SettingCard>

      <SectionTitle>Danger zone</SectionTitle>
      <SettingCard>
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-sm font-medium">Revoke all sessions</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Sign out from all devices except this one.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="text-xs h-8"
            onClick={() => toast.success('All other sessions revoked')}
          >
            Revoke all
          </Button>
        </div>
      </SettingCard>
    </div>
  )
}

// ─── Tab: Appearance ──────────────────────────────────────────────────────────

function TabAppearance() {
  const [theme, setTheme] = useState<Theme>('light')
  const [font, setFont] = useState<FontStyle>('sans')
  const [density, setDensity] = useState<Density>('default')

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-xl font-semibold tracking-tight">Appearance</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize how the interface looks and feels.
        </p>
      </div>

      <SectionTitle>Theme</SectionTitle>
      <div className="grid grid-cols-3 gap-2.5">
        {[
          {
            id: 'light' as Theme,
            label: 'Light',
            bg: '#f7f6f3',
            bar1: '#e8e6e2',
            bar2: '#e0ded9',
          },
          {
            id: 'dark' as Theme,
            label: 'Dark',
            bg: '#111110',
            bar1: '#2a2926',
            bar2: '#232220',
          },
          {
            id: 'system' as Theme,
            label: 'System',
            bg: 'split',
            bar1: '#e8e6e2',
            bar2: '#2a2926',
          },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTheme(t.id)
              toast.success(`Theme set to ${t.label}`)
            }}
            className={cn(
              'relative rounded-xl border overflow-hidden cursor-pointer transition-all text-left',
              theme === t.id
                ? 'border-foreground'
                : 'border-border/50 hover:border-border',
            )}
            style={{ borderWidth: theme === t.id ? '1.5px' : '1px' }}
          >
            {theme === t.id && (
              <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-foreground flex items-center justify-center z-10">
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5l2.5 2.5L8 3"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
            <div
              className="h-16 flex gap-1.5 p-2.5"
              style={{
                background:
                  t.bg === 'split'
                    ? 'linear-gradient(135deg, #f7f6f3 50%, #111110 50%)'
                    : t.bg,
              }}
            >
              <div className="flex flex-col gap-1.5 flex-1">
                <div
                  className="h-2 rounded-sm w-3/5"
                  style={{ background: t.bar1 }}
                />
                <div
                  className="h-1.5 rounded-sm w-4/5"
                  style={{ background: t.bar2 }}
                />
                <div
                  className="h-1.5 rounded-sm w-1/2"
                  style={{ background: t.bar2 }}
                />
              </div>
            </div>
            <div
              className={cn(
                'text-[11px] font-medium px-2.5 py-2 border-t border-border/40 text-center',
                theme === t.id ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {t.label}
            </div>
          </button>
        ))}
      </div>

      <SectionTitle>Font style</SectionTitle>
      <div className="grid grid-cols-3 gap-2.5">
        {[
          {
            id: 'sans' as FontStyle,
            label: 'Sans',
            family: '-apple-system, sans-serif',
          },
          {
            id: 'serif' as FontStyle,
            label: 'Serif',
            family: 'Georgia, serif',
          },
          {
            id: 'mono' as FontStyle,
            label: 'Mono',
            family: "'Courier New', monospace",
          },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setFont(f.id)
              toast.success(`Font set to ${f.label}`)
            }}
            className={cn(
              'rounded-xl border px-4 py-3.5 text-center cursor-pointer transition-all',
              font === f.id
                ? 'border-foreground'
                : 'border-border/50 hover:border-border',
            )}
            style={{ borderWidth: font === f.id ? '1.5px' : '1px' }}
          >
            <p
              style={{ fontFamily: f.family }}
              className="text-2xl text-foreground mb-1 leading-none"
            >
              Aa
            </p>
            <p
              className={cn(
                'text-[10px] font-medium uppercase tracking-[.05em]',
                font === f.id ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {f.label}
            </p>
          </button>
        ))}
      </div>

      <SectionTitle>Density</SectionTitle>
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { id: 'compact' as Density, label: 'Compact', gap: 0 },
          { id: 'default' as Density, label: 'Default', gap: 4 },
          { id: 'comfortable' as Density, label: 'Comfortable', gap: 8 },
        ].map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setDensity(d.id)
              toast.success(`Density set to ${d.label}`)
            }}
            className={cn(
              'rounded-xl border px-3 py-3.5 text-center cursor-pointer transition-all',
              density === d.id
                ? 'border-foreground'
                : 'border-border/50 hover:border-border',
            )}
            style={{ borderWidth: density === d.id ? '1.5px' : '1px' }}
          >
            <div
              className="flex flex-col items-center mb-2.5"
              style={{ gap: d.gap }}
            >
              {[80, 60, 75].map((w, i) => (
                <div
                  key={i}
                  className="h-[3px] rounded-full bg-border"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
            <p
              className={cn(
                'text-[10px] font-medium uppercase tracking-[.05em]',
                density === d.id ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {d.label}
            </p>
          </button>
        ))}
      </div>

      <SectionTitle>Interface preferences</SectionTitle>
      <SettingCard>
        <ToggleRow
          label="Reduce motion"
          description="Minimize animations throughout the interface"
          onToggle={(v) => toast.success(`Reduce motion ${v ? 'on' : 'off'}`)}
        />
        <ToggleRow
          label="Show keyboard shortcuts"
          description="Display shortcut hints on hover"
          defaultChecked
          onToggle={(v) =>
            toast.success(`Keyboard shortcuts ${v ? 'on' : 'off'}`)
          }
        />
        <ToggleRow
          label="Compact sidebar"
          description="Show icons only in the sidebar navigation"
          onToggle={(v) => toast.success(`Compact sidebar ${v ? 'on' : 'off'}`)}
        />
      </SettingCard>

      <div className="flex justify-end gap-2 mt-5">
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-8"
          onClick={() => toast.success('Preferences reset')}
        >
          Reset to default
        </Button>
        <Button
          size="sm"
          className="text-xs h-8"
          onClick={() => toast.success('Appearance saved')}
        >
          Save preferences
        </Button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountPage() {
  return (
    <div className="w-full">
      <Tabs
        defaultValue="profile"
        orientation="vertical"
        className="grid min-h-[calc(100vh-6rem)] w-full grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]"
      >
        <aside className="rounded-2xl border bg-card p-3 shadow-sm">
          <div className="mb-3 px-3 py-2">
            <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
            <p className="text-sm text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>

          <TabsList className="flex h-auto w-full flex-col items-stretch gap-1 bg-transparent p-0">
            {TABS_ITEMS.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="inline-flex w-full items-center justify-start gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </aside>

        <TabsContent value="profile" className="mt-0">
          <TabProfile />
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <TabSecurity />
        </TabsContent>

        <TabsContent value="appearance" className="mt-0">
          <TabAppearance />
        </TabsContent>
      </Tabs>
    </div>
  )
}
