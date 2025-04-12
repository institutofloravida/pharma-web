import { Package } from 'lucide-react'

import type { InventorySingle } from '@/api/pharma/inventory/fetch-inventory'

// Function to check if medication has low stock
export const hasLowStock = (medication: InventorySingle) => {
  return medication.isLowStock
}

// Function to check if any batch is near expiry
// export const hasNearExpiryBatch = (medication) => {
//   return medication.batches.some((batch) => {
//     const expiryDate = new Date(batch.expiringDate)
//     const today = new Date()
//     const ninetyDaysFromNow = new Date()
//     ninetyDaysFromNow.setDate(today.getDate() + 90)
//     return expiryDate <= ninetyDaysFromNow
//   })
// }

// Function to get background color based on category
export const getCategoryColor = (category) => {
  const colors = {
    Analgésico: 'bg-blue-50 dark:bg-blue-950',
    Antibiótico: 'bg-green-50 dark:bg-green-950',
    'Anti-histamínico': 'bg-purple-50 dark:bg-purple-950',
    Antiácido: 'bg-yellow-50 dark:bg-yellow-950',
    'Anti-inflamatório': 'bg-red-50 dark:bg-red-950',
    Antidepressivo: 'bg-indigo-50 dark:bg-indigo-950',
    Antiviral: 'bg-teal-50 dark:bg-teal-950',
    Vitamina: 'bg-orange-50 dark:bg-orange-950',
  }
  return colors[category] || 'bg-gray-50 dark:bg-gray-900'
}

// Function to get icon based on category
export const getCategoryIcon = (category) => {
  const getIconWrapper = (bgColor, textColor) => (
    <div className={`${bgColor} rounded-full p-2`}>
      <Package className={`h-5 w-5 ${textColor}`} />
    </div>
  )

  switch (category) {
    case 'Analgésico':
      return getIconWrapper(
        'bg-blue-100 dark:bg-blue-900',
        'text-blue-600 dark:text-blue-300',
      )
    case 'Antibiótico':
      return getIconWrapper(
        'bg-green-100 dark:bg-green-900',
        'text-green-600 dark:text-green-300',
      )
    case 'Anti-histamínico':
      return getIconWrapper(
        'bg-purple-100 dark:bg-purple-900',
        'text-purple-600 dark:text-purple-300',
      )
    case 'Antiácido':
      return getIconWrapper(
        'bg-yellow-100 dark:bg-yellow-900',
        'text-yellow-600 dark:text-yellow-300',
      )
    case 'Anti-inflamatório':
      return getIconWrapper(
        'bg-red-100 dark:bg-red-900',
        'text-red-600 dark:text-red-300',
      )
    default:
      return getIconWrapper(
        'bg-gray-100 dark:bg-gray-800',
        'text-gray-600 dark:text-gray-300',
      )
  }
}
