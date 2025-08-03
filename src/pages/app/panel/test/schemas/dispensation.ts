import { z } from "zod";

export const batchDispensationSchema = z.object({
  batchStockId: z.string().min(1, "Lote é obrigatório"),
  quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
});

export const medicineDispensationSchema = z.object({
  medicineStockId: z.string().min(1, "Medicamento é obrigatório"),
  quantityRequested: z.number().min(1, "Quantidade deve ser maior que 0"),
  batchesStocks: z
    .array(batchDispensationSchema)
    .min(1, "Pelo menos um lote é obrigatório"),
});

export const dispensationFormSchema = z.object({
  patientId: z.string().min(1, "Paciente é obrigatório"),
  stockId: z.string().min(1, "Estoque é obrigatório"),
  medicines: z
    .array(medicineDispensationSchema)
    .min(1, "Pelo menos um medicamento é obrigatório"),
  dispensationDate: z.coerce.date({
    required_error: "Selecione a data de dispensa.",
  }),
});

export type DispensationFormSchema = z.infer<typeof dispensationFormSchema>;
export type MedicineDispensationSchema = z.infer<
  typeof medicineDispensationSchema
>;
export type BatchDispensationSchema = z.infer<typeof batchDispensationSchema>;
