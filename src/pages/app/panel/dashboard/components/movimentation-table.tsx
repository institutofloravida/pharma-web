import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/authContext";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { fetchMovimentation } from "@/api/pharma/movement/fetch-movimentation";
import { Pagination } from "@/components/pagination";
import { MovimentationTableRow } from "./movimentation-table-row";

export function MovimentationTable() {
  const { token, institutionId } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageIndex = z.coerce.number().parse(searchParams.get("page") ?? "1");
  const REFRESH_INTERVAL_MS = 30_000;

  const { data: movimentationsResult } = useQuery({
    queryKey: ["movimentation", institutionId, pageIndex],
    queryFn: () =>
      fetchMovimentation(
        { page: pageIndex, institutionId: institutionId ?? "" },
        token ?? "",
      ),
    enabled: !!token && !!institutionId,
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  function handlePagination(pageIndex: number) {
    setSearchParams((state) => {
      state.set("page", pageIndex.toString());
      return state;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-md border p-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estoque</TableHead>
              <TableHead>Medicamento</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Direção</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Operador</TableHead>
              <TableHead>Data e hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movimentationsResult?.movimentation.map((movimentation) => (
              <MovimentationTableRow
                key={movimentation.id}
                movimentation={movimentation}
              />
            ))}
          </TableBody>
        </Table>
        {movimentationsResult && (
          <Pagination
            totalCount={movimentationsResult.meta.totalCount}
            pageIndex={pageIndex}
            perPage={10}
            onPageChange={handlePagination}
          />
        )}
      </Card>
    </div>
  );
}
