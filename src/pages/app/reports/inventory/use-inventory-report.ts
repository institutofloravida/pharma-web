import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'

import type { InventoryItem } from '@/api/pharma/reports/inventory-report'
import { useAuth } from '@/contexts/authContext'
import { BACKGROUND_PORTRAIT } from '@/lib/reports/bases-64'

pdfMake.vfs = (pdfFonts as any).vfs

export function useInventoryReportPdf() {
  const { me } = useAuth()
  return (
    inventory: InventoryItem[],
    filters?: {
      stock?: string
      medicineName?: string
      therapeuticClasses?: string[]
      isLowStock?: boolean
    },
  ) => {
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString('pt-BR')
    const formattedTime = currentDate.toLocaleTimeString('pt-BR')

    const filtros: string[] = []
    if (filters) {
      if (filters.stock) filtros.push(`Estoque: ${filters.stock}`)
      if (filters.medicineName)
        filtros.push(`Medicamento: ${filters.medicineName}`)
      if (filters.therapeuticClasses && filters.therapeuticClasses.length > 0) {
        filtros.push(`Classes Terapêuticas: ${filters.therapeuticClasses.join(', ')}`)
      }
      if (typeof filters.isLowStock === 'boolean') {
        filtros.push(`Apenas baixo estoque: ${filters.isLowStock ? 'Sim' : 'Não'}`)
      }
    }

    const contentArr: any[] = [
      {
        text: 'Relatório de Inventário',
        style: 'header',
        alignment: 'center',
        margin: [0, 115, 0, 10],
      },
      {
        text: 'Filtros',
        bold: true,
        alignment: 'left',
        margin: [0, 0, 0, 10],
      },
    ]

    if (filtros.length > 0) {
      contentArr.push({ ul: filtros, margin: [0, 0, 0, 10] })
    }

    const tableBody: any[] = [
      [
        { text: 'Medicamento', style: 'tableHeader' },
        { text: 'Estoque', style: 'tableHeader' },
        { text: 'Qtd Total', style: 'tableHeader' },
        { text: 'Disponível', style: 'tableHeader' },
        { text: 'Indisponível', style: 'tableHeader' },
        { text: 'Lotes', style: 'tableHeader' },
        { text: 'Baixo?', style: 'tableHeader' },
        { text: 'Zerado?', style: 'tableHeader' },
      ],
    ]

    for (const i of inventory) {
      const displayName =
        `${i.medicine} ${i.dosage}${i.unitMeasure} ${i.pharmaceuticalForm}` +
        (i.complement ? ` (${i.complement})` : '')
      tableBody.push([
        displayName.trim(),
        i.stock,
        i.quantity.current.toString(),
        i.quantity.available.toString(),
        i.quantity.unavailable.toString(),
        i.bacthesStocks.toString(),
        i.isLowStock ? 'Sim' : 'Não',
        i.isZero ? 'Sim' : 'Não',
      ])
    }

    if (!inventory || inventory.length === 0) {
      contentArr.push({
        text: 'Nenhum dado encontrado para os filtros selecionados.',
        margin: [0, 10, 0, 0],
        italics: true,
      })
    } else {
      contentArr.push({
        table: {
          headerRows: 1,
          widths: ['*', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: tableBody,
        },
        layout: {
          hLineColor: () => 'black',
          vLineColor: () => 'black',
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 4,
          paddingBottom: () => 4,
        },
      })
    }

    const docDefinition: TDocumentDefinitions = {
      content: contentArr,
      styles: {
        header: {
          fontSize: 16,
          bold: true,
        },
        tableHeader: {
          color: 'black',
          bold: true,
        },
      },
      background: function () {
        return {
          image: 'bg',
          width: 595,
          height: 842,
          absolutePosition: { x: 0, y: 0 },
        }
      },
      images: {
        bg: BACKGROUND_PORTRAIT,
      },
      footer: function (currentPage: number, pageCount: number) {
        return [
          {
            columns: [
              {
                text: `Emitido por: ${me?.name ?? ''} em ${formattedDate} às ${formattedTime}`,
                fontSize: 9,
                margin: [14, 0, 0, 0],
              },
              {
                text: `Página ${currentPage} de ${pageCount}`,
                alignment: 'right',
                fontSize: 9,
                margin: [0, 0, 14, 0],
              },
            ],
          },
        ]
      },
      defaultStyle: {
        fontSize: 9,
      },
    }

    pdfMake.createPdf(docDefinition).download('Relatorio inventario')
  }
}

useInventoryReportPdf.grouped = function () {
  const { me } = useAuth()
  return (
    stocks: Array<{
      stockId: string
      stock: string
      medicines: Array<{
        medicineId: string
        medicine: string
        medicineStocks: Array<{
          medicineStockId: string
          medicineVariantId: string
          pharmaceuticalForm: string
          unitMeasure: string
          dosage: string
          complement?: string
          minimumLevel: number
          quantity: { current: number; available: number; unavailable: number }
          batchesStocks?: Array<{
            id: string
            code: string
            currentQuantity: number
            manufacturer: string
            expirationDate: Date | string
            manufacturingDate: Date | string | null
            isCloseToExpiration: boolean
            isExpired: boolean
          }>
        }>
      }>
    }>,
    opts?: { includeBatches?: boolean },
  ) => {
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString('pt-BR')
    const formattedTime = currentDate.toLocaleTimeString('pt-BR')

    const contentArr: any[] = [
      {
        text: 'Relatório de Inventário (Agrupado)',
        style: 'header',
        alignment: 'center',
        margin: [0, 115, 0, 10],
      },
    ]

    if (!stocks || stocks.length === 0) {
      contentArr.push({
        text: 'Nenhum dado encontrado para os filtros selecionados.',
        margin: [0, 10, 0, 0],
        italics: true,
      })
    } else {
      for (const s of stocks) {
        contentArr.push({
          text: `Estoque: ${s.stock}`,
          bold: true,
          margin: [0, 10, 0, 6],
        })

        for (const med of s.medicines) {
          contentArr.push({
            text: `Medicamento: ${med.medicine}`,
            margin: [0, 2, 0, 4],
          })

          const tableBody: any[] = [
            [
              { text: 'Apresentação', style: 'tableHeader' },
              { text: 'Qtd Total', style: 'tableHeader' },
              { text: 'Disponível', style: 'tableHeader' },
              { text: 'Indisponível', style: 'tableHeader' },
            ],
          ]

          const batchTables: any[] = []

          for (const ms of med.medicineStocks) {
            const display =
              `${ms.dosage}${ms.unitMeasure} ${ms.pharmaceuticalForm}` +
              (ms.complement ? ` (${ms.complement})` : '')

            tableBody.push([
              display.trim(),
              ms.quantity.current.toString(),
              ms.quantity.available.toString(),
              ms.quantity.unavailable.toString(),
            ])

            if (opts?.includeBatches && ms.batchesStocks && ms.batchesStocks.length > 0) {
              // subtabela de lotes
              const batchTableBody: any[] = [
                [
                  { text: 'Lote', style: 'tableHeader' },
                  { text: 'Fabricante', style: 'tableHeader' },
                  { text: 'Qtd', style: 'tableHeader' },
                  { text: 'Fab.', style: 'tableHeader' },
                  { text: 'Val.', style: 'tableHeader' },
                  { text: 'Vencido?', style: 'tableHeader' },
                ],
              ]
              for (const b of ms.batchesStocks) {
                const manuf =
                  b.manufacturingDate
                    ? new Date(b.manufacturingDate).toLocaleDateString('pt-BR')
                    : '-'
                const exp = b.expirationDate
                  ? new Date(b.expirationDate).toLocaleDateString('pt-BR')
                  : '-'
                batchTableBody.push([
                  b.code,
                  b.manufacturer,
                  b.currentQuantity.toString(),
                  manuf,
                  exp,
                  b.isExpired ? 'Sim' : 'Não',
                ])
              }
              batchTables.push({
                table: {
                  headerRows: 1,
                  widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
                  body: batchTableBody,
                },
                layout: {
                  hLineColor: () => 'black',
                  vLineColor: () => 'black',
                  paddingLeft: () => 6,
                  paddingRight: () => 6,
                  paddingTop: () => 4,
                  paddingBottom: () => 4,
                },
                margin: [10, 0, 0, 6],
              })
            }
          }

          contentArr.push({
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto'],
              body: tableBody,
            },
            layout: {
              hLineColor: () => 'black',
              vLineColor: () => 'black',
              paddingLeft: () => 6,
              paddingRight: () => 6,
              paddingTop: () => 4,
              paddingBottom: () => 4,
            },
            margin: [0, 0, 0, 8],
          })

          if (batchTables.length > 0) {
            for (const bt of batchTables) {
              contentArr.push(bt)
            }
          }
        }
      }
    }

    const docDefinition: TDocumentDefinitions = {
      content: contentArr,
      styles: {
        header: {
          fontSize: 16,
          bold: true,
        },
        tableHeader: {
          color: 'black',
          bold: true,
        },
      },
      background: function () {
        return {
          image: 'bg',
          width: 595,
          height: 842,
          absolutePosition: { x: 0, y: 0 },
        }
      },
      images: {
        bg: BACKGROUND_PORTRAIT,
      },
      footer: function (currentPage: number, pageCount: number) {
        return [
          {
            columns: [
              {
                text: `Emitido por: ${me?.name ?? ''} em ${formattedDate} às ${formattedTime}`,
                fontSize: 9,
                margin: [14, 0, 0, 0],
              },
              {
                text: `Página ${currentPage} de ${pageCount}`,
                alignment: 'right',
                fontSize: 9,
                margin: [0, 0, 14, 0],
              },
            ],
          },
        ]
      },
      defaultStyle: {
        fontSize: 9,
      },
    }

    pdfMake.createPdf(docDefinition).download('Relatorio inventario agrupado')
  }
}


