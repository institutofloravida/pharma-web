import { apiPharma } from "@/lib/axios";

export interface FetchInventoryQuery {
  institutionId: string;
  page?: number | null;
  medicineName?: string | null;
  stockId?: string | null;
  isLowStock?: boolean | null;
  therapeuticClassesIds?: string[] | null;
}

export interface InventorySingle {
  medicineStockId: string;
  stockId: string;
  stock: string;
  medicineVariantId: string;
  medicine: string;
  pharmaceuticalForm: string;
  complement?: string;
  unitMeasure: string;
  dosage: string;
  quantity: {
    current: number;
    available: number;
    unavailable: number;
  };
  bacthesStocks: number;
  isLowStock: boolean;
  isZero: boolean;
}

export interface FetchInventoryResponse {
  inventory: InventorySingle[];
}

export async function fetchInventory(
  {
    institutionId,
    page,
    isLowStock,
    medicineName,
    stockId,
    therapeuticClassesIds,
  }: FetchInventoryQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchInventoryResponse>("/inventory", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      institutionId,
      isLowStock,
      medicineName,
      stockId,
      therapeuticClassesIds,
    },
  });

  return response.data;
}
