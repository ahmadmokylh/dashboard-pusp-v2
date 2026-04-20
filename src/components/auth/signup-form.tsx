import { authClient } from '#/lib/auth-client'
import { cn } from '#/lib/utils'
import { validateSignUp, type ValidateSignUp } from '#/validate/auth-validate'
import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../ui/field'
import { Input } from '../ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { Eye, EyeClosed } from 'lucide-react'
import { Button } from '../ui/button'

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const [isPending, startTransition] = useTransition()

  const defaultValues: ValidateSignUp = {
    name: '',
    email: '',
    password: '',
  }

  const form = useForm({
    defaultValues,
    validators: {
      onChange: validateSignUp,
      onSubmit: validateSignUp,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        await authClient.signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
          fetchOptions: {
            onSuccess: () => {
              toast.success(`${value.name} has been created successfully`)
              navigate({ to: '/', replace: true })
            },
            onError: ({ error }) => {
              toast.error(error.message)
            },
          },
        })
      })
    },
  })

  return (
    <form
      className={cn('flex flex-col gap-6 bg-background', className)}
      {...props}
      id="login-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center w-full">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            You need an account to get started
          </p>
        </div>

        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="text"
                  placeholder="Your Name"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="email"
                  placeholder="test@example.com"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                </div>
                <InputGroup>
                  <InputGroupInput
                    name={field.name}
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="off"
                  />
                  <InputGroupAddon
                    align="inline-end"
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeClosed className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </InputGroupAddon>
                </InputGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <Field>
          <Button disabled={isPending} type="submit" size="lg" className="h-10">
            {isPending ? 'Creating...' : 'Create Account'}
          </Button>
        </Field>

        {/* Don't have an account? */}
        <Field>
          <FieldDescription className="text-center">
            Already have an account?{' '}
            <Link to="/login" className="underline underline-offset-4">
              Login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
