import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'

import { Dispensation } from '@/api/pharma/reports/dispenses-in-a-period-report'
import { useAuth } from '@/contexts/authContext'

pdfMake.vfs = (pdfFonts as any).vfs

export function useDispensesReportPdf() {
  const { me } = useAuth()
  return (
    dispenses: Dispensation[],
    filters?: {
      startDate: Date
      endDate: Date
      patientName?: string
      operatorName?: string
    },
  ) => {
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString('pt-BR')
    const formattedTime = currentDate.toLocaleTimeString('pt-BR')

    // Monta os filtros para exibir no PDF
    const filtros: string[] = []
    if (filters) {
      filtros.push(
        `Período: ${filters.startDate.toLocaleDateString('pt-BR')} até ${filters.endDate.toLocaleDateString('pt-BR')}`,
      )
      if (filters.patientName) {
        filtros.push(`Usuário: ${filters.patientName}`)
      }
      if (filters.operatorName) {
        filtros.push(`Operador: ${filters.operatorName}`)
      }
    }

    const contentArr: any[] = [
      {
        text: 'Sistema de Controle de Medicamentos - UBS',
        fontSize: 10,
        margin: [0, 0, 0, 10],
      },
      {
        text: 'Relatório de Dispensações',
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
        widths: ['auto', '*', '*', 'auto'],
        body: [
          ['Data', 'Paciente', 'Operador', 'Itens'],
          ...dispenses.map((d) => [
            new Date(d.dispensationDate).toLocaleDateString('pt-BR'),
            d.patient,
            d.operator,
            d.items.toString(),
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

    pdfMake.createPdf(docDefinition).download('Relatorio dispensas')
  }
}
