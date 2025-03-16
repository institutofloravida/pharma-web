import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { signIn, SignInBody } from '@/api/pharma/auth/sign-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'

const SignInForm = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type SignInFormType = z.infer<typeof SignInForm>

export function SignIn() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormType>()

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: async (data: SignInBody) => {
      const response = await signIn(data)
      return response.data
    },
    onSuccess: (data) => {
      login(data.access_token)
      toast({
        title: 'Aproveite todas as funcionalidades do painel administrativo!',
      })
      navigate('/panel')
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        toast({
          title: 'Credenciais Inválidas',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro no login. Tente novamente.',
          variant: 'destructive',
        })
      }
    },
  })

  async function handleSignIn(data: SignInFormType) {
    await authenticate({ email: data.email, password: data.password })
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/panel')
    }
  }, [isAuthenticated, navigate])

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <Button variant="ghost" asChild className="absolute right-8 top-8">
          <Link to="/sign-up">Recuperar Senha</Link>
        </Button>
        <div className="flex w-[350px] flex-col justify-center gap-4">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar painel
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas operações pelo painel.
            </p>
          </div>
          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register('email')} />
              <Label htmlFor="password">Senha</Label>
              <Input type="password" id="password" {...register('password')} />
            </div>
            <Button disabled={isSubmitting} className="w-full" type="submit">
              Acessar Painel
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
