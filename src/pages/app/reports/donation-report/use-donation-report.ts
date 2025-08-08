import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

import { getDonationReportReport } from "@/api/pharma/reports/donation-report";
import { useAuth } from "@/contexts/authContext";
import { BACKGROUND_PORTRAIT } from "@/lib/reports/bases-64";

pdfMake.vfs = (pdfFonts as any).vfs;

export function useDonationReportPdf() {
  const { token } = useAuth();

  async function downloadPdf(exitId: string) {
    if (!token) return;

    const data = await getDonationReportReport({ exitId }, token);
    const { exit, movimentation } = data;
    console.log("data", data);
    const formattedDate = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const contentArr: any[] = [
      {
        text: [
          { text: "De: ", bold: true },
          "Instituto Floravida\n",
          { text: "Para: ", bold: true },
          `${exit.destinationInstitution}\n`,
          { text: "Responsável: ", bold: true },
          `${exit.responsibleByInstitution}\n`,
          { text: "Assunto: ", bold: true },
          "Doação de Medicamento\n",
        ],
        margin: [0, 115, 0, 10],
      },
      {
        text: "O Instituto Floravida, mediante aos medicamentos doados pela Ache Laboratórios Farmacêuticos S.A entrega a medicação abaixo especificada a caráter de doação, para atendimento de demanda da solicitante, a ser destinada em conformidade pela instituição recebedora.",
        margin: [0, 0, 20, 10],
        fontSize: 12,
        leadingIndent: 20,
        lineHeight: 1.1,
        alignment: "justify",
      },

      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto"],
          body: [
            [
              { text: "MEDICAMENTO", style: "tableHeader" },
              { text: "LOTE", style: "tableHeader" },
              { text: "QUANTIDADE", style: "tableHeader" },
            ],
            ...movimentation.map((item) => [
              `${item.medicine} ${item.dosage}${item.unitMeasure} ${item.pharmaceuticalForm} ${item.complement ?? ""}`,
              item.batchCode,
              String(item.quantity).padStart(2, "0"),
            ]),
          ],
        },
        layout: {
          fillColor: (rowIndex: number) => null,
          hLineColor: () => "black",
          vLineColor: () => "black",
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 4,
          paddingBottom: () => 4,
        },
        margin: [0, 0, 0, 10],
      },
      {
        text: `Parnaíba-PI, ${formattedDate}.`,
        alignment: "right",
        margin: [0, 10, 0, 10],
      },
      {
        text: "Sem mais para o momento,\n\nAtenciosamente,",
        margin: [30, 0, 0, 30],
      },
      {
        canvas: [{ type: "line", x1: 0, y1: 0, x2: 300, y2: 0, lineWidth: 1 }],
        alignment: "center",
        margin: [0, 20, 0, 10],
      },
      {
        text: "Responsável Técnico Instituto Floravida",
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
      {
        text: "O servidor abaixo declara que recebeu os itens acima especificados, de guarda e responsabilidade da unidade recebedora.",

        margin: [0, 0, 0, 30],
      },
      {
        canvas: [{ type: "line", x1: 0, y1: 0, x2: 300, y2: 0, lineWidth: 1 }],
        alignment: "center",
        margin: [0, 20, 0, 10],
      },
      {
        text: `Assinatura do responsável`,

        alignment: "center",
        margin: [0, 0, 0, 10],
      },
    ];

    const docDefinition: TDocumentDefinitions = {
      pageOrientation: "portrait",
      content: contentArr,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 100],
        },
        tableHeader: {
          color: "black",
          bold: true,
          fontSize: 12,
        },
      },
      defaultStyle: {
        fontSize: 11,
        font: "Roboto",
      },
      background: function (currentPage: number) {
        return {
          image: "bg",
          width: 595, // largura da página A4
          height: 842, // altura da página A4
          absolutePosition: { x: 0, y: 0 },
        };
      },
      images: {
        bg: BACKGROUND_PORTRAIT,
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
    };

    pdfMake.createPdf(docDefinition).download("Termo de Doação");
  }

  return { downloadPdf };
}

function getBase64Image(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context is null"));
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = function (e) {
      reject(new Error(`Erro ao carregar imagem: ${url}`));
    };

    img.src = url;
  });
}
