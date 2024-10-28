import { Pill } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Separator } from './ui/separator'

export function LoginForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-center text-2xl">
          <Pill />
          <Separator className="mx-3 h-5" orientation="vertical" />
          Instituto Flora Vida
        </CardTitle>
        <CardDescription>
          Entre com seu email para fazer login em sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Senha</Label>
            </div>
            <Input id="password" type="password" required />
            <Link to="#" className="ml-auto inline-block text-sm underline">
              Esqueceu sua senha?
            </Link>
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Não tem uma conta?{' '}
          <Link to="#" className="underline">
            Solicitar
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
