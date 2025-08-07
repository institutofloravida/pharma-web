import type { Transfer } from "../../types/transfer";

export const mockTransfers: Transfer[] = [
  {
    id: "TRF001",
    date: "2024-01-15",
    originStock: "Estoque Central",
    originInstitution: "Hospital Central",
    destinationStock: "Farmácia Ambulatorial",
    destinationInstitution: "UBS Norte",
    responsible: "Dr. João Silva",
    status: "pendente",
    medications: [
      {
        name: "Paracetamol 500mg",
        batch: "LOT001",
        quantity: 100,
        expiry: "2025-06-15",
      },
      {
        name: "Ibuprofeno 400mg",
        batch: "LOT002",
        quantity: 50,
        expiry: "2025-08-20",
      },
    ],
    notes: "Transferência urgente para atendimento ambulatorial",
  },
  {
    id: "TRF002",
    date: "2024-01-14",
    originStock: "Farmácia Central",
    originInstitution: "UBS Sul",
    destinationStock: "Estoque Emergência",
    destinationInstitution: "Hospital Regional",
    responsible: "Enf. Maria Santos",
    status: "confirmado",
    medications: [
      {
        name: "Dipirona 500mg",
        batch: "LOT003",
        quantity: 200,
        expiry: "2025-12-10",
      },
    ],
    notes: "Reposição de estoque de emergência",
  },
  {
    id: "TRF003",
    date: "2024-01-13",
    originStock: "Almoxarifado",
    originInstitution: "Hospital Central",
    destinationStock: "Farmácia Pediátrica",
    destinationInstitution: "Hospital Infantil",
    responsible: "Farm. Ana Costa",
    status: "pendente",
    medications: [
      {
        name: "Amoxicilina Suspensão",
        batch: "LOT004",
        quantity: 30,
        expiry: "2025-04-30",
      },
      {
        name: "Paracetamol Gotas",
        batch: "LOT005",
        quantity: 25,
        expiry: "2025-07-15",
      },
    ],
    notes: "Medicamentos específicos para pediatria",
  },
  {
    id: "TRF004",
    date: "2024-01-12",
    originStock: "Estoque Geral",
    originInstitution: "UBS Centro",
    destinationStock: "Farmácia Básica",
    destinationInstitution: "UBS Oeste",
    responsible: "Dr. Carlos Oliveira",
    status: "cancelado",
    medications: [
      {
        name: "Losartana 50mg",
        batch: "LOT006",
        quantity: 150,
        expiry: "2025-09-25",
      },
    ],
    notes: "Cancelado por falta de disponibilidade no destino",
  },
];
