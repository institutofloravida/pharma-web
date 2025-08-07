import type { TransferStatus } from "@/api/pharma/movement/transfer/fetch-transfer";

const transferStatusTranslations: Record<TransferStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  CANCELED: "Cancelado",
};

export function getTransferStatusTranslation(
  transferStatusDirection: TransferStatus,
): string {
  return transferStatusTranslations[transferStatusDirection] || "Desconhecido";
}
