import { authClient } from '#/lib/auth-client'
import { cn } from '#/lib/utils'
import { validateLogin, type ValidateLogin } from '#/validate/auth-validate'
import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useState, useTransition } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { Eye, EyeClosed } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { Link } from '@tanstack/react-router'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const [isPending, startTransition] = useTransition()

  const defaultValues: ValidateLogin = {
    email: '',
    password: '',
  }

  const form = useForm({
    defaultValues,
    validators: {
      onChange: validateLogin,
      onSubmit: validateLogin,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        await authClient.signIn.email({
          email: value.email,
          password: value.password,
          fetchOptions: {
            onSuccess: ({ data }) => {
              toast.success(`Hello ${data.user.name}, welcome back`)
              navigate({ to: '/' })
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
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

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
                placeholder="m@example.com"
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
          {isPending ? ' Logging in ...' : 'Login '}
        </Button>
      </Field>

      {/* Don't have an account? */}
      <Field>
        <FieldDescription className="text-center">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </FieldDescription>
      </Field>
    </form>
  )
}
