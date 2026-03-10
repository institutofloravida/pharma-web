import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <span className="text-8xl font-bold text-muted-foreground/30">404</span>
      <h1 className="text-2xl font-semibold">Página não encontrada</h1>
      <p className="text-muted-foreground">
        O endereço que você tentou acessar não existe.
      </p>
      <Button onClick={() => navigate("/")}>Voltar ao início</Button>
    </div>
  );
}
