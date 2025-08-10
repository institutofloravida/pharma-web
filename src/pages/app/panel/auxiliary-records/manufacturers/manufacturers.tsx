import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { fetchManufacturers } from "@/api/pharma/auxiliary-records/manufacturer/fetch-manufacturer";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/authContext";

import { ManufacturerTableFilters } from "./manufacturer-table-filters";
import { ManufacturerTableRow } from "./manufacturer-table-row";
import { NewManufacturerDialog } from "./new-manufacturer-dialog";
import { useState } from "react";

export function Manufacturers() {
  const { token } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const page = z.coerce.number().parse(searchParams.get("page") ?? "1");

  const query = searchParams.get("query") ?? "";
  const cnpj = searchParams.get("cnpj") ?? "";

  const { data: manufacturersResult } = useQuery({
    queryKey: ["manufacturers", page, query, cnpj],
    queryFn: () => fetchManufacturers({ page, query, cnpj }, token ?? ""),
  });

  function handlePagination(pageIndex: number) {
    setSearchParams((state) => {
      state.set("page", pageIndex.toString());
      return state;
    });
  }

  return (
    <>
      <Helmet title="Fabricantes" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Fabricantes</h1>
        <div className="space-y-2.5">
          <div className="mb-8 flex items-center justify-between">
            <ManufacturerTableFilters />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="" variant={"default"}>
                  Novo Fabricante
                </Button>
              </DialogTrigger>
              <NewManufacturerDialog onSuccess={() => setIsDialogOpen(false)} />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[180px]">CNPJ</TableHead>
                  <TableHead className="w-[550px]">Descrição</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manufacturersResult?.manufacturers &&
                  manufacturersResult?.manufacturers.map((item) => {
                    return (
                      <ManufacturerTableRow manufacturer={item} key={item.id} />
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          {manufacturersResult && (
            <Pagination
              pageIndex={manufacturersResult.meta.page}
              totalCount={manufacturersResult.meta.totalCount}
              perPage={10}
              onPageChange={handlePagination}
            />
          )}
        </div>
      </div>
    </>
  );
}
