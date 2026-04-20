import { useState } from 'react'
import TopBar from './top-bar'
import { useProductForm } from '#/hooks/use-product-form'
import StepDetails from './step-details'
import StepImage from './step-image'
import { StepPrice } from './step-price'
import { FormSidebar } from './form-sidebar'
import { categoryLabels } from '#/types/category'

export default function ProductForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [step, setStep] = useState(1)
  const [preview, setPreview] = useState<string | null>(null)

  const form = useProductForm()

  const handleReset = () => {
    form.reset()
    setStep(1)
  }

  return (
    <div className="flex">
      <form.Subscribe
        selector={(state) => state.values}
        children={(values) => (
          <FormSidebar
            currentStep={step}
            preview={preview}
            formValues={{
              name: values.name,
              category: categoryLabels[values.category],
              price: values.price ?? '',
              newPrice: values.newPrice ?? '',
              discountType: values.discountType ?? 'percentage',
              description: values.description ?? '',
            }}
          />
        )}
      />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar currentStep={step} onReset={() => handleReset()} />

        <form
          id="add-product-form"
          className="flex-1 overflow-y-auto"
          {...props}
          onSubmit={async (e) => {
            e.preventDefault()
            e.stopPropagation()

            await form.handleSubmit()
          }}
        >
          {step === 1 && <StepDetails form={form} onNext={() => setStep(2)} />}
          {step === 2 && (
            <StepImage
              form={form}
              preview={preview}
              setPreview={setPreview}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && <StepPrice form={form} onBack={() => setStep(2)} />}
        </form>
      </div>
    </div>
  )
}
