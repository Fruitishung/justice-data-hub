
import { useEffect, useState } from "react";
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
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export const ReportsListPage = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("incident_reports")
          .select("*");

        if (error) {
          console.error("Error fetching reports:", error);
        } else {
          setReports(data || []);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Responsive columns configuration
  const getColumns = (): ColumnDef<any>[] => {
    // Base columns for all devices
    const baseColumns: ColumnDef<any>[] = [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("id")}</div>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => {
          return new Date(row.original.created_at).toLocaleDateString();
        },
      }
    ];

    // Additional columns for desktop
    const desktopColumns: ColumnDef<any>[] = [
      {
        accessorKey: "locationJurisdiction",
        header: "Jurisdiction",
        cell: ({ row }) => {
          return (
            <div className="max-w-[200px] truncate">
              {row.original.location_jurisdiction || "N/A"}
            </div>
          );
        },
      },
      {
        accessorKey: "incidentType",
        header: "Incident Type",
        cell: ({ row }) => (
          <div className="max-w-[150px] truncate">
            {row.getValue("incidentType") || "N/A"}
          </div>
        ),
      }
    ];

    // Action column for all devices
    const actionColumn: ColumnDef<any> = {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => (
        <Link to={`/reports/${row.original.id}`}>
          <Button size="sm" className="whitespace-nowrap">
            {isMobile ? "View" : "View Report"}
          </Button>
        </Link>
      ),
    };

    // Return appropriate columns based on screen size
    return isMobile 
      ? [...baseColumns, actionColumn] 
      : [...baseColumns, ...desktopColumns, actionColumn];
  };

  const columns = getColumns();

  const table = useReactTable({
    data: reports,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="container py-6 md:py-10 px-2 md:px-6">
        <h1 className="text-xl md:text-3xl font-bold mb-4">Incident Reports</h1>

        {isLoading ? (
          <p>Loading reports...</p>
        ) : (
          <div className="w-full overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="whitespace-nowrap">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-2">
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
                      className="h-24 text-center"
                    >
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsListPage;
