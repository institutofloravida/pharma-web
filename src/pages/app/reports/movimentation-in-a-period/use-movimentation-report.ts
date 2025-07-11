import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'

import type { ExitType } from '@/api/pharma/movement/exit/register-medicine-exit'
import { Movimentation } from '@/api/pharma/reports/movimentation-in-a-period-report'
import { useAuth } from '@/contexts/authContext'

pdfMake.vfs = (pdfFonts as any).vfs

export function useMovimentationReportPdf() {
  const { me } = useAuth()
  return (
    movimentation: Movimentation[],
    filters: {
      institutionId: string
      startDate: Date
      endDate: Date
      operator?: string
      medicine?: string
      medicineVariant?: string
      stock?: string
      medicineStock?: string
      batcheStock?: string
      quantity?: number
      movementType?: string
      exitType?: ExitType
    },
  ) => {
    console.log('aqui $$$$$$$$$$$$$$$')

    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString('pt-BR')
    const formattedTime = currentDate.toLocaleTimeString('pt-BR')

    // Monta os filtros para exibir no PDF
    const filtros: string[] = []
    if (filters) {
      filtros.push(
        `Período: ${filters.startDate.toLocaleDateString('pt-BR')} até ${filters.endDate.toLocaleDateString('pt-BR')}`,
      )
      if (filters.operator) {
        filtros.push(`Operador: ${filters.operator}`)
      }
      if (filters.stock) {
        filtros.push(`Estoque: ${filters.stock}`)
      }
      if (filters.medicine) {
        filtros.push(`Medicamento: ${filters.medicine}`)
      }
      if (filters.medicineVariant) {
        filtros.push(`Variante: ${filters.medicineVariant}`)
      }
      if (filters.medicineStock) {
        filtros.push(`Medicamento em Estoque: ${filters.medicineStock}`)
      }
      if (filters.batcheStock) {
        filtros.push(`Lote: ${filters.batcheStock}`)
      }
      if (filters.quantity) {
        filtros.push(`Quantidade: ${filters.quantity}`)
      }
      if (filters.movementType) {
        filtros.push(`Tipo de Movimento: ${filters.movementType}`)
      }
      if (filters.exitType) {
        filtros.push(`Tipo de Saída: ${filters.exitType}`)
      }
    }

    const contentArr: any[] = [
      {
        text: 'Sistema de Controle de Medicamentos - UBS',
        fontSize: 10,
        margin: [0, 0, 0, 10],
      },
      {
        text: 'Relatório de Movimentação',
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 10],
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
    contentArr.push({
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
        body: [
          [
            'Estoque',
            'Medicamento',
            'Lote',
            'quantidade',
            'Data',
            'Tipo de Movimentação',
            'Movimento',
            'operador',
          ],
          ...movimentation.map((movimentation) => [
            movimentation.stock,
            `${movimentation.medicine} - ${movimentation.dosage}${movimentation.unitMeasure} - ${movimentation.pharmaceuticalForm}`,
            movimentation.batchCode,
            movimentation.quantity,
            new Date(movimentation.movementDate).toLocaleDateString('pt-BR'),
            movimentation.movementType,
            movimentation.direction,
            movimentation.operator,
          ]),
        ],
      },
      layout: {
        fillColor: (rowIndex: number) => (rowIndex === 0 ? '#2980b9' : null),
        hLineColor: () => '#b4b4b4',
        vLineColor: () => '#b4b4b4',
        paddingLeft: () => 6,
        paddingRight: () => 6,
        paddingTop: () => 4,
        paddingBottom: () => 4,
      },
    })
    const docDefinition: TDocumentDefinitions = {
      pageOrientation: 'landscape',
      content: contentArr,
      styles: {
        header: {
          fontSize: 16,
          bold: true,
        },
        tableHeader: {
          color: 'white',
          bold: true,
        },
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
    pdfMake.createPdf(docDefinition).download('Relatorio Movimentação')
  }
}
