import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { fetchMedicinesVariants } from "@/api/pharma/medicines-variants/fetch-medicines-variants";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/authContext";

import { MedicineVariantTableFilters } from "./medicine-variant-table-filters";
import { MedicineVariantTableRow } from "./medicine-variant-table-row";
import { NewMedicineVariantDialog } from "./new-medicine-variant-dialog";
import { useState } from "react";
import { TableSkeleton } from "@/components/skeletons/table";

export function MedicinesVariants() {
  const { token } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = z.coerce.number().parse(searchParams.get("page") ?? "1");

  const medicineId = searchParams.get("medicineId");
  const name = searchParams.get("name");

  const { data: medicinesVariants, isLoading } = useQuery({
    queryKey: ["medicines-variants", pageIndex, name, medicineId],
    queryFn: () =>
      fetchMedicinesVariants(
        { page: pageIndex, query: name, medicineId },
        token ?? "",
      ),
  });

  function handlePagination(pageIndex: number) {
    setSearchParams((state) => {
      state.set("page", pageIndex.toString());
      return state;
    });
  }

  return (
    <>
      <Helmet title="Variantes de Medicamentos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Variantes de Medicamentos
        </h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <MedicineVariantTableFilters />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="" variant={"default"}>
                  Nova Variante
                </Button>
              </DialogTrigger>
              <NewMedicineVariantDialog
                onSuccess={() => setIsDialogOpen(false)}
              />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Medicamento</TableHead>
                  <TableHead className="">Dosagem</TableHead>
                  <TableHead className="">Forma Farmacêutica</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableSkeleton />}
                {!isLoading &&
                  medicinesVariants?.medicines_variants?.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Nenhuma variante de medicamento encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                {!isLoading &&
                  medicinesVariants?.medicines_variants?.map((item) => (
                    <MedicineVariantTableRow
                      medicineVariant={item}
                      key={item.id}
                    />
                  ))}
              </TableBody>
            </Table>
          </div>

          {medicinesVariants && (
            <Pagination
              pageIndex={medicinesVariants.meta.page}
              totalCount={medicinesVariants.meta.totalCount}
              perPage={10}
              onPageChange={handlePagination}
            />
          )}
        </div>
      </div>
    </>
  );
}
