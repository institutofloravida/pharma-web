import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => {
        return (
          <TableRow key={`skeleton-${i}`} className="animate-pulse">
            <TableCell className="py-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-40 rounded" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-48 rounded" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-56 rounded" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-28 rounded" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-8 w-8 rounded" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-8 w-8 rounded" />
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
}
