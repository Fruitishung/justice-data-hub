
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

const ReportDetailsPage = () => {
  const { id } = useParams();

  const { data: report, isLoading } = useQuery({
    queryKey: ["report-details", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incident_reports")
        .select(`
          *,
          arrest_tags(*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="min-h-screen bg-secondary p-8 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/mock-data" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Reports
          </Link>
        </Button>

        <Card className="p-6 space-y-6">
          <h1 className="text-3xl font-bold">Report Details</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-600">Case Number</h3>
              <p className="text-xl">{report?.case_number}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-600">Type</h3>
              <p className="text-xl">
                {report?.penal_code === "187" ? "Homicide" : "Armed Robbery"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-600">Date</h3>
              <p className="text-xl">
                {report?.incident_date && new Date(report.incident_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-600">Status</h3>
              <p className="text-xl">{report?.report_status}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-600 mb-2">Description</h3>
            <p className="text-gray-700">{report?.incident_description}</p>
          </div>

          {report?.arrest_tags?.[0] && (
            <div>
              <h3 className="font-semibold text-gray-600 mb-2">Arrest Information</h3>
              <Button variant="outline" asChild>
                <Link to={`/arrest-tag/${report.id}`}>View Arrest Tag</Link>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ReportDetailsPage;
