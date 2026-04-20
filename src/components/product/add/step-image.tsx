import { useRef, useState, useCallback } from 'react'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import type { ProductFormApi } from '#/hooks/use-product-form'
import { LoaderCircle, Upload } from 'lucide-react'
import { deleteFromR2, uploadToR2 } from '#/server/R2-server'
import { toast } from 'sonner'

type StepImageProps = {
  form: ProductFormApi
  preview: string | null
  setPreview: (preview: string | null) => void
  onNext: () => void
  onBack: () => void
  initialImageKey?: string
}

export default function StepImage({
  form,
  preview,
  setPreview,
  onNext,
  onBack,
  initialImageKey,
}: StepImageProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadedKeyRef = useRef<string | null>(initialImageKey ?? null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file || !file.type.startsWith('image/')) return

      setIsUploading(true)

      const localPreview = URL.createObjectURL(file)
      setPreview(localPreview)

      try {
        const res = await uploadToR2({
          data: {
            fileName: file.name,
            fileType: file.type,
          },
        })

        if (!res.uploadUrl) {
          throw new Error('Upload URL is missing')
        }

        if (!res.url) {
          throw new Error('Public URL is missing')
        }

        const uploadResponse = await fetch(res.uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        })

        if (!uploadResponse.ok) {
          throw new Error(
            `Direct upload failed with status ${uploadResponse.status}`,
          )
        }

        uploadedKeyRef.current = res.key
        setPreview(res.url)
        form.setFieldValue('imageURL', res.url)
        form.setFieldValue('imageKey', res.key)
        toast.success('تم رفع الصورة بنجاح')
      } catch (error) {
        console.error('Upload failed:', error)
        URL.revokeObjectURL(localPreview)
        setPreview(null)
        form.setFieldValue('imageURL', '')
        form.setFieldValue('imageKey', '')
      } finally {
        setIsUploading(false)
      }
    },
    [form, setPreview],
  )

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => setIsDragging(false)

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(null)
    form.setFieldValue('imageURL', '')
    form.setFieldValue('imageKey', '')

    if (uploadedKeyRef.current) {
      try {
        await deleteFromR2({ data: { key: uploadedKeyRef.current } })
        toast.success('الصورة القديمة تم حذفها بنجاح')
      } catch (error) {
        toast.error('فشل حذف الصورة القديمة')
      } finally {
        uploadedKeyRef.current = null
      }
    }

    await handleFile(file)
  }

  const handleRemove = async () => {
    setPreview(null)
    form.setFieldValue('imageURL', '')
    form.setFieldValue('imageKey', '')
    if (inputRef.current) inputRef.current.value = ''

    if (uploadedKeyRef.current) {
      try {
        await deleteFromR2({ data: { key: uploadedKeyRef.current } })
        toast.success('الصورة تم حذفها بنجاح')
        uploadedKeyRef.current = null
      } catch (error: any) {
        toast.error('فشل حذف الصورة')
      }
    }
  }

  return (
    <FieldGroup>
      <div className="mx-auto w-full max-w-lg px-8 py-12">
        <div className="space-y-7">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Product Image
            </h1>
            <p className="text-sm text-muted-foreground">
              Upload a clear image that represents your product.
            </p>
          </div>

          <form.Field
            name="imageURL"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Product Image</FieldLabel>

                  <input
                    ref={inputRef}
                    id={field.name}
                    name={field.name}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={onInputChange}
                    onBlur={field.handleBlur}
                  />

                  {preview ? (
                    <div className="group relative overflow-hidden rounded-xl border border-border">
                      <img
                        src={preview}
                        alt="Product preview"
                        className="h-70 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => inputRef.current?.click()}
                          className="rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-black transition hover:bg-white"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={handleRemove}
                          className="rounded-lg bg-red-500/90 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      role="button"
                      tabIndex={0}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      onClick={() => inputRef.current?.click()}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && inputRef.current?.click()
                      }
                      data-dragging={isDragging}
                      className={[
                        'flex h-70 w-full cursor-pointer flex-col items-center justify-center gap-3',
                        'rounded-xl border-2 border-dashed transition-colors duration-200 outline-none',
                        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        isDragging
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/60',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          'flex h-11 w-11 items-center justify-center rounded-full transition-colors',
                          isDragging
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground',
                        ].join(' ')}
                      >
                        {isUploading ? (
                          <LoaderCircle className="animate-spin" />
                        ) : (
                          <Upload />
                        )}
                      </div>

                      <div className="space-y-0.5 text-center">
                        <p className="text-sm font-medium text-foreground">
                          {isUploading
                            ? 'Uploading...'
                            : isDragging
                              ? 'Drop image here'
                              : 'Click or drag & drop'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, WEBP — max 10MB
                        </p>
                      </div>
                    </div>
                  )}

                  {isUploading ? (
                    <p className="text-sm text-muted-foreground">
                      Uploading...
                    </p>
                  ) : (
                    isInvalid && <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )
            }}
          />

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
                selector={(state) => state.values.imageURL}
                children={(imageURL) => (
                  <Button
                    type="button"
                    size="lg"
                    className="h-10 flex-1"
                    disabled={!imageURL}
                    onClick={onNext}
                  >
                    Next
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
