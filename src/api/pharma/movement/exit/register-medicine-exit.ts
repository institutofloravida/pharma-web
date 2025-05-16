import { apiPharma } from "@/lib/axios";

export enum ExitType {
  DISPENSATION = "DISPENSATION",
  MOVEMENT_TYPE = "MOVEMENT_TYPE",
  EXPIRATION = "EXPIRATION",
}

export interface RegisterMedicineExitBodyAndParams {
  medicineStockId: string;
  batcheStockId: string;
  quantity: number;
  exitType: ExitType;
  movementTypeId?: string;
  exitDate?: Date;
}

export async function registerMedicineExit(
  {
    exitDate,
    movementTypeId,
    batcheStockId,
    exitType,
    medicineStockId,
    quantity,
  }: RegisterMedicineExitBodyAndParams,
  token: string,
) {
  await apiPharma.post(
    `/medicine/exit`,
    {
      exitDate,
      movementTypeId,
      batcheStockId,
      exitType,
      medicineStockId,
      quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
