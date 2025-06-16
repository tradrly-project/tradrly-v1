"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useState, useMemo } from "react";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const totalPages = Math.ceil(data.length / pageSize);

  // ✅ Memoized paginated data
  const paginatedData = useMemo(() => {
    return data.slice((page - 1) * pageSize, page * pageSize);
  }, [data, page]);

  // ✅ Memoized table instance
  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-xl min-w-[900px] border border-zinc-700 px-4 py-2">
        <Table className="w-full table-fixed">
          <colgroup>
            <col className="w-[10%]" />
            <col className="w-[10%]" />
            <col className="w-[6%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
            <col className="w-[6%]" />
            <col className="w-[10%]" />
            <col className="w-[6%]" />
          </colgroup>

          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b border-zinc-700"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-1 py-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-transparent border-none"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-1 py-0.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center italic text-muted-foreground text-xs font-semibold py-4"
                >
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
        {/* Pagination */}
        <div className="w-full flex justify-end px-4 min-h-[56px]">
          <Pagination className="justify-end">
            <PaginationContent className="gap-2.5">
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="cursor-pointer hover:bg-transparent hover:text-zinc-400"
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`cursor-pointer border-0 ${page === i + 1 ? "bg-zinc-800 text-white" : "bg-transparent text-muted-foreground"
                      }`}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>

              ))}

              <PaginationItem>
                <PaginationNext onClick={() =>
                  setPage((prev) => (prev < totalPages ? prev + 1 : prev))
                }
                className="cursor-pointer hover:bg-transparent hover:text-zinc-400" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
    </div>
  );
}
