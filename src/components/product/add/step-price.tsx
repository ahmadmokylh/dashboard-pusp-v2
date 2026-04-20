import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '#/components/ui/input-group'
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group'
import type { ProductFormApi } from '#/hooks/use-product-form'
import type { CreateProductType } from '#/schema/createProductSchema'
import { Check } from 'lucide-react'

type StepPriceProps = {
  form: ProductFormApi
  onBack: () => void
}

export function StepPrice({ form, onBack }: StepPriceProps) {
  return (
    <FieldGroup>
      <div className="mx-auto w-full max-w-lg px-8 py-12">
        <div className="space-y-7">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Product Pricing
            </h1>
            <p className="text-sm text-muted-foreground">
              Set the base price and configure an optional discount.
            </p>
          </div>

          <form.Field
            name="price"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value === ''
                          ? undefined
                          : parseFloat(e.target.value),
                      )
                    }
                    type="number"
                    aria-invalid={isInvalid}
                    placeholder="0.00"
                    autoComplete="off"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <form.Field
            name="discountType"
            children={(field) => (
              <Field>
                <FieldLabel>Discount Type</FieldLabel>
                <RadioGroup
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(
                      value as CreateProductType['discountType'],
                    )
                  }
                  className="grid grid-cols-2 gap-2"
                >
                  {(['percentage', 'fixed'] as const).map((v, i) => (
                    <FieldLabel htmlFor={v} key={i}>
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>
                            {v === 'percentage' ? 'Percentage' : 'Fixed'}
                          </FieldTitle>
                          <FieldDescription>
                            {v === 'percentage'
                              ? 'e.g. 20% off'
                              : 'e.g. $5 off'}
                          </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem
                          id={v === 'percentage' ? 'percentage' : 'fixed'}
                          value={v === 'percentage' ? 'percentage' : 'fixed'}
                        />
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </Field>
            )}
          />

          <form.Subscribe
            selector={(state) => ({
              dt: state.values.discountType,
              price: state.values.price,
            })}
            children={({ dt, price }) => (
              <form.Field
                name="newPrice"
                children={(field) => {
                  const p = price ?? 0
                  const v = field.state.value ?? 0
                  const final = dt === 'percentage' ? p * (1 - v / 100) : p - v
                  const showPreview = p > 0 && v > 0 && final > 0 && final < p

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Discount Price
                        {showPreview && (
                          <Badge variant="default" className="ml-auto">
                            final:$ {final.toFixed(2)}
                          </Badge>
                        )}
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? ''}
                          onBlur={field.handleBlur}
                          placeholder="0"
                          onChange={(e) =>
                            field.handleChange(
                              e.target.value === ''
                                ? undefined
                                : parseFloat(e.target.value),
                            )
                          }
                          type="number"
                          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          autoComplete="off"
                        />
                        <InputGroupAddon>
                          <InputGroupText>
                            {dt === 'percentage' ? '%' : '$'}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )
                }}
              />
            )}
          />

          <form.Subscribe
            selector={(s) => ({
              price: s.values.price,
              newPrice: s.values.newPrice,
              dt: s.values.discountType,
            })}
          >
            {({ price, newPrice, dt }) => {
              const p = Number(price),
                np = Number(newPrice)
              const final = dt === 'percentage' ? p * (1 - np / 100) : p - np
              const saved = p - final
              const pct = p > 0 ? Math.round((saved / p) * 100) : 0
              if (!(p > 0 && np > 0 && saved > 0)) return null

              return (
                <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/30 px-4 py-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Check className="text-green-500" size={15} />
                  </div>
                  <div className="flex flex-1 items-baseline justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">New price</p>
                      <p className="text-base font-semibold text-foreground">
                        ${final.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Customer saves
                      </p>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        ${saved.toFixed(2)} · {pct}%
                      </p>
                    </div>
                  </div>
                </div>
              )
            }}
          </form.Subscribe>

          <Field>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-10 flex-1"
                onClick={onBack}
              >
                Back
              </Button>
              <form.Subscribe
                selector={(s) => [s.isSubmitted, s.canSubmit]}
                children={([isSubmitted, canSubmit]) => (
                  <Button
                    type="submit"
                    size="lg"
                    className="h-10 flex-1"
                    disabled={isSubmitted || !canSubmit}
                  >
                    Submit
                  </Button>
                )}
              />
            </div>
          </Field>
        </div>
      </div>
    </FieldGroup>
  )
}
