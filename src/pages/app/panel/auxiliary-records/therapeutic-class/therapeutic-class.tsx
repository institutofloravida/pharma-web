import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { fetchTherapeuticClasses } from "@/api/pharma/auxiliary-records/therapeutic-class/fetch-therapeutic-class";
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

import { NewTherapeuticClassDialog } from "./new-therapeutic-class-dialog";
import { TherapeuticClassTableFilters } from "./therapeutic-class-table-filters";
import { TherapeuticClassTableRow } from "./therapeutic-class-table-row";
import { useState } from "react";

export function TherapeuticClass() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const query = searchParams.get("query");

  const pageIndex = z.coerce.number().parse(searchParams.get("page") ?? "1");

  const { data: therapeuticClassesResult } = useQuery({
    queryKey: ["therapeutic-classes", pageIndex, query],
    queryFn: () =>
      fetchTherapeuticClasses({ page: pageIndex, query }, token ?? ""),
  });

  function handlePagination(pageIndex: number) {
    setSearchParams((state) => {
      state.set("page", pageIndex.toString());
      return state;
    });
  }

  return (
    <>
      <Helmet title="Terapêuticas" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Classes Terapêuticas
        </h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <TherapeuticClassTableFilters />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant={"default"}>Nova Classe Terapeutica</Button>
              </DialogTrigger>
              <NewTherapeuticClassDialog
                onSuccess={() => setIsDialogOpen(false)}
              />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[300px]">Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {therapeuticClassesResult ? (
                  therapeuticClassesResult.therapeutic_classes.map((item) => (
                    <TherapeuticClassTableRow
                      therapeuticClass={item ?? []}
                      key={item.id}
                    />
                  ))
                ) : (
                  <div>Nenhum estoque encontrado</div>
                )}
              </TableBody>
            </Table>
          </div>

          {therapeuticClassesResult && (
            <Pagination
              pageIndex={therapeuticClassesResult.meta.page}
              totalCount={therapeuticClassesResult.meta.totalCount}
              perPage={10}
              onPageChange={handlePagination}
            />
          )}
        </div>
      </div>
    </>
  );
}
