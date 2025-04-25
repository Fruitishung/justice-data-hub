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

export const ReportsListPage = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        return new Date(row.original.created_at).toLocaleDateString();
      },
    },
    {
      accessorKey: "locationJurisdiction",
      header: "Jurisdiction",
      cell: ({ row }) => {
        return row.original.location_jurisdiction || "N/A";
      },
    },
    {
      accessorKey: "incidentType",
      header: "Incident Type",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link to={`/reports/${row.original.id}`}>
          <Button size="sm">View</Button>
        </Link>
      ),
    },
  ];

  const table = useReactTable({
    data: reports,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-4">Incident Reports</h1>

        {isLoading ? (
          <p>Loading reports...</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
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
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};
