
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, Database, Eye } from "lucide-react";
import GenerateMockDataButton from "@/components/GenerateMockDataButton";
import type { Database } from "@/types/reports";

type IncidentReportWithArrestTags = Database['public']['Tables']['incident_reports']['Row'] & {
  arrest_tags: Array<Database['public']['Tables']['arrest_tags']['Row']>;
};

const MockDataPage = () => {
  const { data: reports, isLoading } = useQuery({
    queryKey: ["mock-data-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incident_reports")
        .select(`
          *,
          arrest_tags(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as IncidentReportWithArrestTags[];
    },
  });

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Training Data Management</h1>
            <p className="text-muted-foreground">
              Generate and view mock incident reports for training purposes
            </p>
          </div>
          <GenerateMockDataButton />
        </div>

        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="p-8 text-center">Loading reports...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Arrest Tag</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports?.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      {report.case_number}
                    </TableCell>
                    <TableCell>
                      {report.penal_code === "187" ? "Homicide" : "Armed Robbery"}
                    </TableCell>
                    <TableCell>
                      {new Date(report.incident_date || '').toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        report.report_status === "Open"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {report.report_status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {report.arrest_tags?.[0]?.tag_number ? (
                        <Link 
                          to={`/arrest-tag/${report.arrest_tags[0].id}`}
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Database className="h-4 w-4" />
                          View Tag
                        </Link>
                      ) : (
                        <span className="text-gray-400">No arrest</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/report/${report.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockDataPage;
