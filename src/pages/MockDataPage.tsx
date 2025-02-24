
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, Database, Eye } from "lucide-react";
import GenerateMockDataButton from "@/components/GenerateMockDataButton";
import type { ArrestTag, IncidentReport } from "@/types/reports";

type IncidentReportWithArrestTags = Omit<IncidentReport, 'evidence_photos' | 'ai_crime_scene_photos' | 'suspect_fingerprints'> & {
  arrest_tags: ArrestTag[];
};

const MockDataPage = () => {
  const { data: reports, isLoading, error } = useQuery({
    queryKey: ["mock-data-reports"],
    queryFn: async () => {
      console.log("Fetching reports...");
      const { data, error } = await supabase
        .from("incident_reports")
        .select(`
          *,
          arrest_tags(*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reports:", error);
        throw error;
      }

      console.log("Fetched reports:", data);
      return (data || []) as unknown as IncidentReportWithArrestTags[];
    },
    refetchInterval: 5000, // Refetch every 5 seconds to ensure we get updates
  });

  console.log("Current reports:", reports);
  console.log("Loading state:", isLoading);
  console.log("Error state:", error);

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
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              Error loading reports: {error.message}
            </div>
          ) : !reports || reports.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No reports available. Generate some training data to get started.
            </div>
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
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      {report.case_number || 'N/A'}
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
