import { apiPharma } from "@/lib/axios";

export enum ExitType {
  DISPENSATION = "DISPENSATION",
  MOVEMENT_TYPE = "MOVEMENT_TYPE",
  EXPIRATION = "EXPIRATION",
  DONATION = "DONATION",
  TRANSFER = "TRANSFER",
}

export interface RegisterMedicineExitBodyAndParams {
  batches: {
    batcheStockId: string;
    quantity: number;
  }[];
  stockId: string;
  exitType: ExitType;
  movementTypeId?: string;
  destinationInstitutionId?: string;
  exitDate?: Date;
}

export async function registerMedicineExit(
  {
    exitDate,
    movementTypeId,
    exitType,
    batches,
    stockId,
    destinationInstitutionId,
  }: RegisterMedicineExitBodyAndParams,
  token: string,
) {
  await apiPharma.post(
    `/medicine/exit`,
    {
      exitDate,
      movementTypeId,
      batches,
      exitType,
      stockId,
      destinationInstitutionId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
