import { inventoryMedicineDetails } from '@/api/pharma/inventory/inventory-medicine-details'

interface DynamicBreadcrumbResolver {
  match: (pathname: string) => boolean
  queryKey: (id: string) => string[]
  queryFn: (id: string, token: string) => Promise<string>
}

export const dynamicBreadcrumbResolvers: DynamicBreadcrumbResolver[] = [
  {
    match: (pathname) => /^\/inventory\/[^/]+$/.test(pathname),
    queryKey: (id) => ['medicine-stock', id],
    queryFn: async (id, token) => {
      const data = await inventoryMedicineDetails(
        { medicineStockId: id },
        token,
      )
      return data?.medicine ?? 'Detalhes'
    },
  },
]
