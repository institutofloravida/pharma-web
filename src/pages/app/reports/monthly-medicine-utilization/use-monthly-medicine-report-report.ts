import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'

import { UseMedicine } from '@/api/pharma/reports/monthly-medicine-utilization'
import { MONTHS } from '@/components/selects/select-month'
import { useAuth } from '@/contexts/authContext'

pdfMake.vfs = (pdfFonts as any).vfs
export function useMonthlyMedicineUtilizationReportPdf() {
  const { me } = useAuth()

  return (
    useMedicines: UseMedicine[],
    filters: {
      institutionId: string
      stock?: string
      year: string
      month: string
    },
  ) => {
    console.log('filters', filters)
    console.log('use', useMedicines)
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

    const monthDescription = MONTHS.find((item) => item.id === filters.month)
    filtersReport.push(formatLabelValue('Ano', filters.year))
    filtersReport.push(
      formatLabelValue(
        'Mês',
        monthDescription ? monthDescription.label : filters.month,
      ),
    )
    filtersReport.push(formatLabelValue('Estoque', filters.stock))

    const contentArr: any[] = [
      {
        text: 'Sistema de Controle de Medicamentos - UBS',
        fontSize: 10,
        margin: [0, 0, 0, 10],
      },
      {
        text: 'Relatório de Utilização de Medicamentos Mensal',
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

    if (useMedicines.length > 0) {
      contentArr.push({
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Medicamento', style: 'tableHeader' },
              { text: 'Saldo Anterior', style: 'tableHeader' },
              { text: 'Saldo Atual', style: 'tableHeader' },
              { text: 'Utilização', style: 'tableHeader' },
            ],
            ...useMedicines.map((useMedicine) => [
              // `${useMedicine.medicine ?? ''} ${useMedicine.dosage ?? ''}${useMedicine.unitMeasure ?? ''} ${useMedicine.pharmaceuticalForm ?? ''} ${useMedicine.complement ?? ''}`,
              `${useMedicine.medicine ?? ''} ${useMedicine.dosage}${useMedicine.unitMeasure} ${useMedicine.pharmaceuticalForm} ${useMedicine.complement ?? ''}`,
              Number(useMedicine.previousBalance ?? 0),
              Number(useMedicine.currentBalance ?? 0),
              Number(useMedicine.used ?? 0),
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
    } else {
      contentArr.push({
        text: 'Nenhum dado de utilização encontrado para os filtros selecionados.',
        italics: true,
        margin: [0, 10],
      })
    }

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
