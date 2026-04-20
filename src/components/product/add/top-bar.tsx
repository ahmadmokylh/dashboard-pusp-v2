import { Button } from '#/components/ui/button'
import { STEPS } from '#/hooks/use-product-form'
import { cn } from '#/lib/utils'

interface TopBarProps {
  currentStep: number
  onReset: () => void
}

export default function TopBar({ currentStep, onReset }: TopBarProps) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border/50 px-8 py-4">
      <div className="flex items-center gap-3">
        {/* Mobile step dots */}
        <div className="flex lg:hidden gap-1.5">
          {STEPS.map((s) => (
            <span
              key={s.id}
              className={cn(
                'block rounded-full transition-all duration-300',
                currentStep === s.id
                  ? 'h-1.5 w-5 bg-foreground'
                  : currentStep > s.id
                    ? 'h-1.5 w-1.5 bg-foreground/40'
                    : 'h-1.5 w-1.5 bg-border',
              )}
            />
          ))}
        </div>
        <p className="hidden lg:block text-sm text-muted-foreground">
          {STEPS[currentStep - 1].label}
          <span className="mx-1.5 text-border">·</span>
          <span className="text-muted-foreground/50">
            currentStep {currentStep} / {STEPS.length}
          </span>
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs text-muted-foreground px-2"
        onClick={onReset}
      >
        Reset
      </Button>
    </header>
  )
}
