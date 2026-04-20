import { ExpandableCard } from '#/components/ui/expandable-card'
import { STEPS } from '#/hooks/use-product-form'
import { cn } from '#/lib/utils'
import StepDot from './step-dot'

interface FormSidebarProps {
  currentStep: number
  preview: string | null
  // form values passed down from parent's form.Subscribe
  formValues: {
    name: string
    category: string
    price: number | string
    newPrice: number | string
    discountType: 'percentage' | 'fixed'
    description: string
  }
}

export function FormSidebar({
  currentStep,
  preview,
  formValues,
}: FormSidebarProps) {
  const { name, category, price, newPrice, discountType, description } =
    formValues
  const p = Number(price)
  const np = Number(newPrice)
  const final = discountType === 'percentage' ? p * (1 - np / 100) : np
  const saved = p > 0 && np > 0 ? p - final : 0

  return (
    <aside className="hidden lg:flex w-68  shrink-0 flex-col pr-3 border-r border-border/50">
      {/* Step navigation */}
      <nav className="flex flex-col px-3 py-4 gap-0.5">
        {STEPS.map((s, i) => {
          const state =
            currentStep > s.id
              ? 'done'
              : currentStep === s.id
                ? 'active'
                : 'idle'
          return (
            <button
              key={s.id}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150',
                state === 'active' && 'bg-muted',
                state !== 'active' && 'hover:bg-muted/50',
              )}
            >
              {i < STEPS.length - 1 && (
                <span
                  className={cn(
                    'absolute left-5.5 top-8.5 h-[calc(100%+1px)] w-px',
                    currentStep > s.id ? 'bg-foreground/20' : 'bg-border/50',
                  )}
                />
              )}
              <StepDot state={state} />
              <div className="min-w-0">
                <p
                  className={cn(
                    'text-sm leading-none font-medium',
                    state === 'active'
                      ? 'text-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  {s.label}
                </p>
                <p className="text-[11px] text-muted-foreground/50 mt-0.5">
                  {s.desc}
                </p>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Live product summary */}

      <div className="mx-auto mt-20">
        <ExpandableCard
          title={name}
          preview={preview}
          description={description}
          category={category}
          price={p}
          finalPrice={final}
          saved={saved}
          classNameExpanded="[&_h4]:text-black dark:[&_h4]:text-white [&_h4]:font-medium"
        >
          {description}
        </ExpandableCard>
      </div>
    </aside>
  )
}
