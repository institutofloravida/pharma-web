import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

import { fetchMedicinesExits } from "@/api/pharma/movement/exit/fetch-medicines-exits";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/authContext";

import { MedicineExitTableRow } from "./medicine-exit-table-row";
import { MedicineExitTableFilters } from "./medicine-exits-table-filters";
import type { ExitType } from "@/api/pharma/movement/exit/register-medicine-exit";

export function MedicinesExits() {
  const { token, institutionId } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = z.coerce.number().parse(searchParams.get("page") ?? "1");

  const operatorId = searchParams.get("operatorId");
  const exitType = searchParams.get("exitType");
  const exitDate = searchParams.get("exitDate");

  const { data: medicinesExitsResult } = useQuery({
    queryKey: [
      "medicines-exits",
      "data-on-institution",
      pageIndex,
      operatorId,
      exitType,
      exitDate,
    ],
    queryFn: () =>
      fetchMedicinesExits(
        {
          page: pageIndex,
          institutionId: institutionId ?? "",
          exitDate: exitDate ? new Date(exitDate) : undefined,
          exitType: exitType as ExitType | undefined,
          operatorId: operatorId ?? undefined,
        },
        token ?? "",
      ),
    enabled: Boolean(institutionId),
  });

  function handlePagination(pageIndex: number) {
    setSearchParams((state) => {
      state.set("page", pageIndex.toString());
      return state;
    });
  }

  return (
    <>
      <Helmet title="Saídas de medicamentos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Saídas de Medicamentos
        </h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-8">
            <MedicineExitTableFilters />
            <Button
              className=""
              variant={"default"}
              onClick={() => navigate("/movement/exits/new")}
            >
              Nova Saída
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="">Estoque</TableHead>
                  <TableHead className="">Operador</TableHead>
                  <TableHead className="w-[64px]">Items</TableHead>
                  <TableHead className="w-[180px]">Tipo</TableHead>
                  <TableHead className="w-[100px]">Data</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicinesExitsResult &&
                  medicinesExitsResult.medicines_exits.map((item) => {
                    return (
                      <MedicineExitTableRow medicineExit={item} key={item.id} />
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          {medicinesExitsResult && (
            <Pagination
              pageIndex={medicinesExitsResult.meta.page}
              totalCount={medicinesExitsResult.meta.totalCount}
              perPage={10}
              onPageChange={handlePagination}
            />
          )}
        </div>
      </div>
    </>
  );
}
