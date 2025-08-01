import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import type { text } from 'stream/consumers'

import { getDonationReportReport } from '@/api/pharma/reports/donation-report'
import { useAuth } from '@/contexts/authContext'

pdfMake.vfs = (pdfFonts as any).vfs

export function useDonationReportPdf() {
  const { token, me } = useAuth()

  async function downloadPdf(exitId: string) {
    if (!token) return

    const data = await getDonationReportReport({ exitId }, token)
    const { exit, movimentation } = data
    console.log('data', data)
    const formattedDate = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })

    const logoBase64 = await getBase64Image('/public/logo.png')
    const bg = await getBase64Image('/public/bg.jpg')
    const contentArr: any[] = [
      {
        text: [
          { text: 'De: ', bold: true },
          'Instituto Floravida\n',
          { text: 'Para: ', bold: true },
          `${exit.destinationInstitution}\n`,
          { text: 'Responsável: ', bold: true },
          `${exit.responsibleByInstitution}\n`,
          { text: 'Assunto: ', bold: true },
          'Doação de Medicamento\n',
        ],
        margin: [0, 115, 0, 10],
      },
      {
        text: 'O Instituto Floravida, mediante aos medicamentos doados pela Ache Laboratórios Farmacêuticos S.A entrega a medicação abaixo especificada a caráter de doação, para atendimento de demanda da solicitante, a ser destinada em conformidade pela instituição recebedora.',
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto'],
          body: [
            [
              { text: 'MEDICAMENTO', style: 'tableHeader' },
              { text: 'LOTE', style: 'tableHeader' },
              { text: 'QUANTIDADE', style: 'tableHeader' },
            ],
            ...movimentation.map((item) => [
              `${item.medicine} ${item.dosage}${item.unitMeasure} ${item.pharmaceuticalForm} ${item.complement ?? ''}`,
              item.batchCode,
              String(item.quantity).padStart(2, '0'),
            ]),
          ],
        },
        layout: {
          fillColor: (rowIndex: number) => null,
          hLineColor: () => '#b4b4b4',
          vLineColor: () => '#b4b4b4',
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 4,
          paddingBottom: () => 4,
        },
        margin: [0, 0, 0, 10],
      },
      {
        text: `Parnaíba-PI, ${formattedDate}.`,
        alignment: 'right',
        margin: [0, 10, 0, 10],
      },
      {
        text: 'Sem mais para o momento,\nAtenciosamente,',
        margin: [0, 0, 0, 20],
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 300, y2: 0, lineWidth: 1 }],
        alignment: 'center',
        margin: [0, 20, 0, 2],
      },
      {
        text: 'Responsável Técnico Instituto Floravida',
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },
      {
        text: 'O servidor abaixo declara que recebeu os itens acima especificados, de guarda e responsabilidade da unidade recebedora.',
        margin: [0, 0, 0, 20],
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 300, y2: 0, lineWidth: 1 }],
        alignment: 'center',
        margin: [0, 20, 0, 2],
      },
      {
        text: `Assinatura do responsável`,

        alignment: 'center',
        margin: [0, 0, 0, 10],
      },
    ]

    const docDefinition: TDocumentDefinitions = {
      pageOrientation: 'portrait',
      content: contentArr,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 100],
        },
        tableHeader: {
          color: 'black',
          bold: true,
          fontSize: 12,
        },
      },
      defaultStyle: {
        fontSize: 11,
      },
      background: function (currentPage: number) {
        return {
          image: 'bg',
          width: 595, // largura da página A4
          height: 842, // altura da página A4
          absolutePosition: { x: 0, y: 0 },
        }
      },
      images: {
        logo: logoBase64,
        bg,
      },
      // footer: function (currentPage: number, pageCount: number) {
      //   return [
      //     {
      //       columns: [
      //         {
      //           text: `Emitido por: ${me?.name ?? ''}`,
      //           fontSize: 9,
      //           margin: [14, 0, 0, 0],
      //         },
      //         {
      //           text: `Página ${currentPage} de ${pageCount}`,
      //           alignment: 'right',
      //           fontSize: 9,
      //           margin: [0, 0, 14, 0],
      //         },
      //       ],
      //     },
      //   ]
      // },
    }

    pdfMake.createPdf(docDefinition).download('Termo de Doação')
  }

  return { downloadPdf }
}

function getBase64Image(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = function () {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas context is null'))
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = url
  })
}
