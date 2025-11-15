import { apiPharma } from "@/lib/axios";

export interface GetInventoryReportQuery {
  institutionId: string;
  stockId?: string;
  medicineName?: string;
  therapeuticClassesIds?: string[];
  isLowStock?: boolean;
  group?: boolean;
  includeBatches?: boolean;
}

export interface InventoryItem {
  medicineStockId: string;
  stockId: string;
  stock: string;
  medicine: string;
  complement: string | null | undefined;
  medicineVariantId: string;
  pharmaceuticalForm: string;
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

export interface InventoryReportUngroupedResponse {
  inventory: InventoryItem[];
  meta: {
    totalCount: number;
  };
}

export interface InventoryReportGroupedResponse {
  stocks: Array<{
    stockId: string;
    stock: string;
    medicines: Array<{
      medicineId: string;
      medicine: string;
      medicineStocks: Array<{
        medicineStockId: string;
        medicineVariantId: string;
        pharmaceuticalForm: string;
        unitMeasure: string;
        dosage: string;
        complement?: string;
        minimumLevel: number;
        quantity: { current: number; available: number; unavailable: number };
        batchesStocks?: Array<{
          id: string;
          code: string;
          currentQuantity: number;
          manufacturer: string;
          expirationDate: Date | string;
          manufacturingDate: Date | string | null;
          isCloseToExpiration: boolean;
          isExpired: boolean;
        }>;
      }>;
    }>;
  }>;
  meta: {
    totalCount: number;
  };
}

type GetInventoryReportResponse =
  | InventoryReportUngroupedResponse
  | InventoryReportGroupedResponse;

export async function getInventoryReport(
  {
    institutionId,
    stockId,
    medicineName,
    isLowStock,
    therapeuticClassesIds,
    group,
    includeBatches,
  }: GetInventoryReportQuery,
  token: string,
) {
  const params: Record<string, unknown> = { institutionId };

  if (stockId && stockId.trim().length > 0) {
    params.stockId = stockId;
  }
  if (medicineName && medicineName.trim().length > 0) {
    params.medicineName = medicineName;
  }
  if (
    Array.isArray(therapeuticClassesIds) &&
    therapeuticClassesIds.length > 0
  ) {
    params.therapeuticClassesIds = therapeuticClassesIds;
  }
  if (typeof isLowStock === "boolean") {
    params.isLowStock = isLowStock;
  }
  if (typeof group === "boolean") {
    params.group = group;
  }
  if (typeof includeBatches === "boolean") {
    // incluir lotes só faz sentido quando agrupado
    params.group = true;
    params.includeBatches = includeBatches;
  }

  const response = await apiPharma.get<GetInventoryReportResponse>(
    "/reports/inventory",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    },
  );

  return response.data;
}
