import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

interface MedicineWithBatches {
  name: string
  minimumStock: number
  batches: {
    batch: string
    quantity: number
    expiration: string
  }[]
}

const loggedUser = 'Carlos Andrade'

const generateMockData = (): MedicineWithBatches[] => {
  const meds: MedicineWithBatches[] = []

  const today = new Date()
  const msInDay = 1000 * 60 * 60 * 24

  for (let i = 1; i <= 20; i++) {
    const batches = Array.from({
      length: Math.floor(Math.random() * 5) + 1,
    }).map((_, j) => {
      const expirationOffset = Math.floor(Math.random() * 400) - 100
      const expiration = new Date(today.getTime() + expirationOffset * msInDay)
        .toISOString()
        .split('T')[0]
      return {
        batch: `L${i}${j}`,
        quantity: Math.floor(Math.random() * 50),
        expiration,
      }
    })

    meds.push({
      name: `Medicamento ${i}`,
      minimumStock: 10,
      batches,
    })
  }

  return meds
}

export const ReportTest = () => {
  const [loading, setLoading] = useState(false)

  const generatePDF = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 10))

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString('pt-BR')
    const formattedTime = currentDate.toLocaleTimeString('pt-BR')

    const inventory = generateMockData()

    let cursorY = 20

    doc.setFontSize(10)
    doc.text('Sistema de Controle de Medicamentos - UBS', 14, 10)

    doc.setFontSize(16)
    doc.text(
      'Relatório de Inventário de Medicamentos',
      pageWidth / 2,
      cursorY,
      {
        align: 'center',
      },
    )
    cursorY += 10

    const addFooter = () => {
      doc.setFontSize(9)
      doc.text(
        `Emitido por: ${loggedUser} em ${formattedDate} às ${formattedTime}`,
        14,
        pageHeight - 10,
      )
      doc.text(
        `Página ${doc.internal.getNumberOfPages()}`,
        pageWidth - 30,
        pageHeight - 10,
      )
    }

    inventory.forEach((med, index) => {
      if (cursorY + 40 > pageHeight) {
        addFooter()
        doc.addPage()
        cursorY = 20
      }

      doc.setFontSize(13)
      doc.setTextColor(33, 33, 33)
      doc.text(`${index + 1}. ${med.name}`, 14, cursorY)
      cursorY += 6 // espaçamento antes da tabela

      const tableData = med.batches.map((batch) => {
        const expDate = new Date(batch.expiration)
        const today = new Date()
        const diffDays = Math.floor(
          (expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        )

        let status = 'OK'
        let color = [52, 152, 219] // azul

        if (batch.quantity === 0) {
          status = 'Zerado'
          color = [66, 66, 66]
        } else if (batch.quantity < med.minimumStock) {
          status = 'Abaixo do estoque'
          color = [241, 196, 15]
        }

        if (diffDays < 0) {
          status = 'Vencido'
          color = [231, 76, 60]
        } else if (diffDays <= 30) {
          status = 'Próximo do vencimento'
          color = [243, 156, 18]
        }

        return {
          batch: batch.batch,
          quantity: batch.quantity.toString(),
          expiration: batch.expiration,
          status,
          color,
        }
      })

      autoTable(doc, {
        startY: cursorY,
        margin: { left: 14, right: 14 },
        head: [['Lote', 'Quantidade', 'Validade', 'Status']],
        body: tableData.map((row) => [
          row.batch,
          row.quantity,
          row.expiration,
          row.status,
        ]),
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineWidth: 0.1,
          lineColor: [180, 180, 180],
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 3) {
            const color = tableData[data.row.index].color
            data.cell.styles.textColor = [255, 255, 255]
            data.cell.styles.fillColor = color
          }
        },
        willDrawCell: (data) => {
          cursorY = data.cursor.y + 10
        },
      })

      cursorY += 8 // espaço entre medicamentos
    })

    addFooter()
    doc.save('relatorio_inventario.pdf')
    setLoading(false)
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">Relatório de Inventário</h1>
      <Button onClick={generatePDF} disabled={loading}>
        {loading ? 'Gerando relatório...' : 'Gerar PDF'}
      </Button>
    </div>
  )
}
