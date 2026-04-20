import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Textarea } from '#/components/ui/textarea'
import { type ProductFormApi } from '#/hooks/use-product-form'
import type { CreateProductType } from '#/schema/createProductSchema'
import { categoryOptions } from '#/types/category'

interface StepDetailsProps {
  form: ProductFormApi
  onNext: () => void
}

export default function StepDetails({ form, onNext }: StepDetailsProps) {
  return (
    <FieldGroup>
      <div className="mx-auto w-full max-w-lg px-8 py-12">
        {/* ── Step 1: Identity ──────────────────────────────────── */}
        <div className="space-y-7">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Product Details
            </h1>
            <p className="text-sm text-muted-foreground">
              What are you listing and where does it belong?
            </p>
          </div>

          {/* ── Step 1: Product Name ────────────────────────────────────  */}
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Produn Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="text"
                    aria-invalid={isInvalid}
                    placeholder="منتج عسل "
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* ── Step 1: Product Description ────────────────────────────────────  */}

          <form.Field
            name="description"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>

                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="منتج طبيعي 100%"
                    autoComplete="off"
                    className="h-40"
                  />
                </Field>
              )
            }}
          />

          {/* ── Step 1: Product Categorys ────────────────────────────────────  */}

          <form.Field
            name="category"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as CreateProductType['category'])
                    }
                  >
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categoryOptions.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <Field>
            <form.Subscribe
              selector={(state) => {
                const name = state.values.name

                return { isStepValid: !!name && name.length >= 3 }
              }}
              children={({ isStepValid }) => (
                <Button
                  type="submit"
                  size="lg"
                  className="h-10"
                  disabled={!isStepValid}
                  onClick={onNext}
                >
                  Next
                </Button>
              )}
            />
          </Field>
        </div>
      </div>
    </FieldGroup>
  )
}
