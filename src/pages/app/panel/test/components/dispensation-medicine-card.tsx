"use client";
import { Trash2, Package, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { useFormState } from "react-hook-form";
import type { Control } from "react-hook-form";
import type { DispensationFormSchema } from "../schemas/dispensation";
import type { DispensationMedicine } from "../types/dispensation";

interface DispensationMedicineCardProps {
  control: Control<DispensationFormSchema>;
  medicineIndex: number;
  medicine: DispensationMedicine;
  onRemove: () => void;
}

export function DispensationMedicineCard({
  control,
  medicineIndex,
  medicine,
  onRemove,
}: DispensationMedicineCardProps) {
  const { errors } = useFormState({ control });

  const totalDispensed = medicine.batches.reduce(
    (sum, batch) => sum + batch.quantity.toDispensation,
    0,
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <div>
              <CardTitle className="text-base">
                {medicine.medicine.medicine} •{" "}
                {medicine.medicine.pharmaceuticalForm} •{" "}
                {medicine.medicine.dosage}
                {medicine.medicine.unitMeasure}
                {medicine.medicine.complement &&
                medicine.medicine.complement.length > 0
                  ? ` • ${medicine.medicine.complement}`
                  : ""}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Solicitado: {medicine.quantityRequested} | Disponível:{" "}
                {medicine.medicine.quantity.available}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-2 py-1 text-xs">
              <Pill className="mr-1 h-3 w-3" />
              Total: {totalDispensed}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onRemove}
              className="h-7 w-7 bg-transparent text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pb-3 pt-0">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-medium text-muted-foreground">
            Lotes Sugeridos ({medicine.batches.length})
          </h4>
          {totalDispensed !== medicine.quantityRequested && (
            <Badge variant="outline" className="text-xs text-orange-600">
              Quantidade parcial
            </Badge>
          )}
        </div>
        <Separator />
        <div className="space-y-2">
          {/* Cabeçalho dos lotes */}
          <div className="grid grid-cols-12 gap-2 rounded bg-muted/50 px-2 py-1">
            <div className="col-span-3">
              <span className="text-xs font-medium text-muted-foreground">
                Lote / Fabricante
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-medium text-muted-foreground">
                Validade
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-medium text-muted-foreground">
                Estoque
              </span>
            </div>
            {/* <div className="col-span-2">
              <span className="text-xs font-medium text-muted-foreground">
                
              </span>
            </div> */}
            <div className="col-span-2">
              <span className="text-xs font-medium text-muted-foreground">
                Dispensar
              </span>
            </div>
            <div className="col-span-2">
              <span className="block text-center text-xs font-medium text-muted-foreground">
                Quant. Após Dispensa
              </span>
            </div>
          </div>

          {/* Lotes */}
          {medicine.batches.map((batch, batchIndex) => {
            const quantityError =
              errors?.medicines?.[medicineIndex]?.batchesStocks?.[batchIndex]
                ?.quantity?.message;

            return (
              <div key={batch.batchStockId} className="space-y-1">
                <div className="grid grid-cols-12 gap-2 rounded border bg-muted/30 p-2">
                  {/* Info do Lote */}
                  <div className="col-span-3">
                    <div className="font-mono text-sm font-medium">
                      {batch.code}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {batch.manufacturerName}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-sm">
                      {new Date(batch.expirationDate).toLocaleDateString(
                        "pt-BR",
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.ceil(
                        (new Date(batch.expirationDate).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      dias
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-sm font-medium">
                      {batch.quantity.totalCurrent}
                    </div>
                    <div className="text-xs text-green-600">disponível</div>
                  </div>

                  {/* Quantidade para dispensar */}
                  <div className="col-span-2">
                    <input
                      type="hidden"
                      name={`medicines.${medicineIndex}.batchesStocks.${batchIndex}.batchStockId`}
                      value={batch.batchStockId}
                    />
                    <FormField
                      control={control}
                      name={`medicines.${medicineIndex}.batchesStocks.${batchIndex}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="0"
                              disabled
                              min="0"
                              max={batch.quantity.totalCurrent}
                              className={`h-8 text-sm ${quantityError ? "border-2 border-red-500" : ""}`}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseInt(e.target.value) || 0,
                                )
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2 flex items-center justify-center">
                    {batch.quantity.totalCurrent -
                      batch.quantity.toDispensation >
                    0 ? (
                      <div className="text-sm font-medium text-green-600">
                        {batch.quantity.totalCurrent -
                          batch.quantity.toDispensation}
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-red-600">
                        {batch.quantity.toDispensation -
                          batch.quantity.totalCurrent}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  {/* <div className="col-span-1 flex items-center justify-center">
                    <div
                      className="h-2 w-2 rounded-full bg-green-500"
                      title="Lote válido"
                    />
                  </div> */}
                </div>

                {/* Mensagem de erro */}
                {quantityError && (
                  <div className="px-2">
                    <p className="text-xs font-medium text-red-500">
                      {quantityError}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Resumo
        <Card className="mt-3 rounded border">
          <CardContent className="flex items-center justify-between text-sm">
            <span className="font-medium">Resumo da Dispensação:</span>
            <div className="flex gap-4 text-xs">
              <span className="text-blue-600">
                Solicitado: <strong>{medicine.quantityRequested}</strong>
              </span>
              <span className="text-green-600">
                Será dispensado: <strong>{totalDispensed}</strong>
              </span>
              {totalDispensed < medicine.quantityRequested && (
                <span className="text-orange-600">
                  Faltante:{" "}
                  <strong>{medicine.quantityRequested - totalDispensed}</strong>
                </span>
              )}
            </div>
          </CardContent>
        </Card> */}
      </CardContent>
    </Card>
  );
}
