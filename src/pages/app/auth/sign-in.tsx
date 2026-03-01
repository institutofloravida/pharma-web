import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Pill, Mail, Lock } from "lucide-react";

import { signIn, SignInBody } from "@/api/pharma/auth/sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/authContext";
import { toast } from "@/hooks/use-toast";
import { ModeToggle } from "@/components/theme/mode-toggle";

const SignInForm = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SignInFormType = z.infer<typeof SignInForm>;

export function SignIn() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormType>();

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: async (data: SignInBody) => {
      const response = await signIn(data);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.access_token);
      toast({
        title: "Aproveite todas as funcionalidades do painel administrativo!",
      });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        toast({
          title: "Credenciais Inválidas",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro no login. Tente novamente.",
          variant: "destructive",
        });
      }
    },
  });

  async function handleSignIn(data: SignInFormType) {
    await authenticate({ email: data.email, password: data.password });
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Helmet title="Login" />
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="absolute right-8 top-8">
          <ModeToggle />
        </div>
        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <Pill className="h-10 w-10" />
            <h1 className="text-3xl font-bold tracking-tight">Farmavida</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas operações pelo painel.
            </p>
          </div>
          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-9"
                    {...register("email")}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    id="password"
                    placeholder="Sua Senha"
                    className="pl-9"
                    {...register("password")}
                  />
                </div>
              </div>
            </div>
            <Button disabled={isSubmitting} className="w-full" type="submit">
              {isSubmitting ? "Entrando..." : "Acessar Painel"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
