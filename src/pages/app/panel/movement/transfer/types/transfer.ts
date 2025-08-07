export interface Transfer {
  id: string;
  date: string;
  originStock: string;
  originInstitution: string;
  destinationStock: string;
  destinationInstitution: string;
  responsible: string;
  status: "pendente" | "confirmado" | "cancelado";
  medications: Medication[];
  notes?: string;
}

export interface Medication {
  name: string;
  batch: string;
  quantity: number;
  expiry: string;
}

export interface TransferFilters {
  status: string;
  originInstitution: string;
  destinationInstitution: string;
  dateFrom: string;
  dateTo: string;
}
