import type { ExitType } from "@/api/pharma/movement/exit/register-medicine-exit";

const exitTypeTranslations: Record<ExitType, string> = {
  DISPENSATION: "Dispensa",
  DONATION: "Doação",
  EXPIRATION: "Vencimento",
  MOVEMENT_TYPE: "Tipo de Movimento",
  TRANSFER: "Transferência",
};

export function getExitTypeTranslation(exitTypeDirection: ExitType): string {
  return exitTypeTranslations[exitTypeDirection] || "Desconhecido";
}
