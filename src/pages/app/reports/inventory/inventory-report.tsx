import { Helmet } from "react-helmet-async";

import { InventoryReportForm } from "./inventory-report-form";

export function InventoryReport() {
  return (
    <>
      <Helmet title="Relatório de Inventário" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Relatório de Inventário
        </h1>
        <div className="space-y-2.5">
          <div className="flex max-w-[1000px] items-center justify-between">
            <InventoryReportForm />
          </div>
          <div className="rounded-md border"></div>
        </div>
      </div>
    </>
  );
}
