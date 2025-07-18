import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'

import { ExitType } from '@/api/pharma/movement/exit/register-medicine-exit'
import { Movimentation } from '@/api/pharma/reports/movimentation-in-a-period-report'
import { useAuth } from '@/contexts/authContext'
import { MovementTypeDirection } from '@/lib/utils/movement-type'

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
      direction?: MovementTypeDirection
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
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString('pt-BR')
    const formattedTime = currentDate.toLocaleTimeString('pt-BR')

    const filtersReport: any[] = []

    const formatLabelValue = (
      label: string,
      value?: string | number | boolean,
    ) => {
      if (!value) return null
      return {
        text: [{ text: `${label}: `, bold: true }, { text: String(value) }],
        margin: [0, 2],
      }
    }

    filtersReport.push({
      text: [
        { text: 'Período: ', bold: true },
        {
          text: `${filters.startDate.toLocaleDateString('pt-BR')} até ${filters.endDate.toLocaleDateString('pt-BR')}`,
        },
      ],
      margin: [0, 2],
    })

    filtersReport.push(formatLabelValue('Operador', filters.operator))

    filtersReport.push(
      filters.direction && {
        text: [
          { text: 'Direção: ', bold: true },
          {
            text:
              filters.direction === MovementTypeDirection.ENTRY
                ? 'ENTRADA'
                : 'SAÍDA',
          },
        ],
        margin: [0, 2],
      },
    )

    filtersReport.push(formatLabelValue('Estoque', filters.stock))
    filtersReport.push(formatLabelValue('Medicamento', filters.medicine))
    filtersReport.push(formatLabelValue('Variante', filters.medicineVariant))
    filtersReport.push(
      formatLabelValue('Medicamento em Estoque', filters.medicineStock),
    )
    filtersReport.push(formatLabelValue('Lote', filters.batcheStock))
    filtersReport.push(formatLabelValue('Quantidade', filters.quantity))
    filtersReport.push(
      formatLabelValue('Tipo de Movimento', filters.movementType),
    )

    filtersReport.push(
      filters.exitType && {
        text: [
          { text: 'Tipo de Saída: ', bold: true },
          {
            text:
              filters.exitType === ExitType.MOVEMENT_TYPE
                ? 'Outro'
                : filters.exitType === ExitType.DISPENSATION
                  ? 'Dispensa'
                  : 'Vencimento',
          },
        ],
        margin: [0, 2],
      },
    )

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
        margin: [0, 0, 0, 6],
      },
    ]

    const filteredFilters = filtersReport.filter(Boolean)

    if (filteredFilters.length > 0) {
      contentArr.push({
        stack: filteredFilters,
        margin: [0, 0, 0, 10],
      })
    }

    contentArr.push({
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
        body: [
          [
            { text: 'Estoque', style: 'tableHeader' },
            { text: 'Medicamento', style: 'tableHeader' },
            { text: 'Lote', style: 'tableHeader' },
            { text: 'Quantidade', style: 'tableHeader' },
            { text: 'Data', style: 'tableHeader' },
            { text: 'Tipo de Movimentação', style: 'tableHeader' },
            { text: 'Movimento', style: 'tableHeader' },
            { text: 'Operador', style: 'tableHeader' },
          ],
          ...movimentation.map((mov) => [
            mov.stock,
            `${mov.medicine} - ${mov.dosage}${mov.unitMeasure} - ${mov.pharmaceuticalForm}`,
            mov.batchCode,
            mov.quantity,
            new Date(mov.movementDate).toLocaleDateString('pt-BR'),
            mov.movementType,
            mov.direction,
            mov.operator,
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
