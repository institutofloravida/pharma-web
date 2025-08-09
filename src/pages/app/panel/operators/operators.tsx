import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { fetchOperators } from "@/api/pharma/operators/fetch-operators";
import { OperatorRole } from "@/api/pharma/operators/register-operator";
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

import { NewOperatorDialog } from "./new-operator-dialog";
import { OperatorTableFilters } from "./operator-table-filters";
import { OperatorTableRow } from "./operator-table-row";
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/skeletons/table";

export function Operators() {
  const { token } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = z.coerce.number().parse(searchParams.get("page") ?? "1");

  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const institutionId = searchParams.get("institutionId");
  const role = searchParams.get("role");

  const roleFilter =
    role && Object.values(OperatorRole).includes(role as OperatorRole)
      ? (role as OperatorRole)
      : undefined;
  const { data: operatorsResult, isLoading } = useQuery({
    queryKey: ["operators", page, name, email, institutionId, role],
    queryFn: () =>
      fetchOperators(
        { page, email, institutionId, name, role: roleFilter },
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
      <Helmet title="Operadores" />
      <div className="flex flex-col gap-4 rounded-xl p-4">
        <h1 className="text-3xl font-bold tracking-tight">Operadores</h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <OperatorTableFilters />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="" variant={"default"}>
                  Novo Operador
                </Button>
              </DialogTrigger>
              <NewOperatorDialog />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[180px]">Email</TableHead>
                  <TableHead className="w-[200px]">
                    {"Instituições associado(a)"}
                  </TableHead>
                  <TableHead className="w-[140px]">Tipo de usuário</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              {/* <TableBody>
                {operatorsResult?.operators &&
                  operatorsResult.operators.map((item) => {
                    return <OperatorTableRow operator={item} key={item.id} />;
                  })}
              </TableBody> */}
              <TableBody>
                {/* Skeletons enquanto carrega */}
                {isLoading && <TableSkeleton />}

                {/* Dados reais quando disponíveis */}
                {!isLoading &&
                  operatorsResult?.operators?.map((item) => {
                    return <OperatorTableRow operator={item} key={item.id} />;
                  })}
              </TableBody>
            </Table>
          </div>

          {operatorsResult && (
            <Pagination
              pageIndex={operatorsResult.meta.page}
              totalCount={operatorsResult.meta.totalCount}
              perPage={10}
              onPageChange={handlePagination}
            />
          )}
        </div>
      </div>
    </>
  );
}
