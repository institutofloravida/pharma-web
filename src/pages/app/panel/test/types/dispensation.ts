import type { MedicineStockDetails } from "@/api/pharma/stock/medicine-stock/fetch-medicines-stock";

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
}

export interface MedicineStock {
  id: string;
  medicine: string;
  pharmaceuticalForm: string;
  dosage: string;
  unitMeasure: string;
  quantity: {
    available: number;
    unavailable: number;
  };
}

export interface BatchPreview {
  batchStockId: string;
  code: string;
  quantity: {
    toDispensation: number;
    totalCurrent: number;
  };
  expirationDate: Date;
  manufacturerName: string;
}

export interface Stock {
  id: string;
  name: string;
  status: boolean;
}

export interface DispensationMedicine {
  id: string;
  medicineStockId: string;
  medicine: MedicineStockDetails;
  quantityRequested: number;
  batches: BatchPreview[];
}

// Interface para a API
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
