import { apiPharma } from "@/lib/axios";

export interface RegisterDispensationBody {
  patientId: string;
  stockId: string;
  medicines: {
    medicineStockId: string;
    batchesStocks: {
      batchStockId: string;
      quantity: number;
    }[];
  }[];
  dispensationDate: Date;
}

export async function registerDispensation(
  { dispensationDate, medicines, stockId, patientId }: RegisterDispensationBody,
  token: string,
) {
  await apiPharma.post(
    "/dispensation",
    {
      dispensationDate,
      patientId,
      stockId,
      medicines,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
