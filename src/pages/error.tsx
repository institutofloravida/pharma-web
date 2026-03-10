import { useNavigate, useRouteError } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function ErrorPage() {
  const error = useRouteError() as { message?: string; statusText?: string };
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <span className="text-8xl font-bold text-muted-foreground/30">Ops</span>
      <h1 className="text-2xl font-semibold">Algo deu errado</h1>
      <p className="text-muted-foreground">
        Ocorreu um erro inesperado. Tente novamente ou volte ao início.
      </p>
      {(error?.message || error?.statusText) && (
        <p className="rounded-md bg-muted px-4 py-2 font-mono text-sm text-muted-foreground">
          {error.message ?? error.statusText}
        </p>
      )}
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Voltar
        </Button>
        <Button onClick={() => navigate("/")}>Ir para o início</Button>
      </div>
    </div>
  );
}
