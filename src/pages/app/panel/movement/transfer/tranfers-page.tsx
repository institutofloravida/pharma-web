import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

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

import { fetchTransfers } from "@/api/pharma/movement/transfer/fetch-transfer";
import { TransferTableRow } from "./transfer-tabel-row";

export function TransfersPage() {
  const { token, institutionId } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = z.coerce.number().parse(searchParams.get("page") ?? "1");

  const medicineId = searchParams.get("medicineId");
  const operatorId = searchParams.get("operatorId");
  const batch = searchParams.get("batch");
  const movementTypeId = searchParams.get("movementTypeId");
  const exitDate = searchParams.get("exitDate");

  const { data: transfersResult } = useQuery({
    queryKey: [
      "transfers",
      "data-on-institution",
      pageIndex,
      medicineId,
      operatorId,
      batch,
      movementTypeId,
      exitDate,
    ],
    queryFn: () =>
      fetchTransfers(
        {
          page: pageIndex,
          institutionId: institutionId ?? "",
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
      <Helmet title="Entradas de medicamentos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Transferências de Medicamentos
        </h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-8">
            {/* <MedicineExitTableFilters /> */}
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[64px]">Data</TableHead>
                  <TableHead className="">Origem</TableHead>
                  <TableHead className="">Destino</TableHead>
                  <TableHead className="">Operador</TableHead>
                  <TableHead>Status/confirmação</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfersResult &&
                  transfersResult.transfers.map((item) => {
                    return (
                      <TransferTableRow transfer={item} key={item.transferId} />
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          {transfersResult && (
            <Pagination
              pageIndex={transfersResult.meta.page}
              totalCount={transfersResult.meta.totalCount}
              perPage={10}
              onPageChange={handlePagination}
            />
          )}
        </div>
      </div>
    </>
  );
}
