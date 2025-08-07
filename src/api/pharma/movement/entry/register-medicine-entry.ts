import { apiPharma } from "@/lib/axios";

export enum EntryType {
  MOVEMENT_TYPE = "MOVEMENT_TYPE",
  TRANSFER = "TRANSFER",
}

export interface RegisterMedicineEntryBodyAndParams {
  movementTypeId: string;
  medicines: {
    medicineVariantId: string;
    batches: Array<{
      code: string;
      expirationDate: Date;
      manufacturerId: string;
      manufacturingDate?: Date;
      quantityToEntry: number;
    }>;
  }[];
  entryDate: Date;
  entryType: EntryType;
  stockId: string;
  nfNumber: string;
}

export async function registerMedicineEntry(
  {
    entryDate,
    movementTypeId,
    medicines,
    stockId,
    nfNumber,
    entryType,
  }: RegisterMedicineEntryBodyAndParams,
  token: string,
) {
  await apiPharma.post(
    `/medicine-entry`,
    { entryDate, movementTypeId, stockId, medicines, nfNumber, entryType },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
