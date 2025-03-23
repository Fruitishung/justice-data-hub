
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Shield } from "lucide-react";
import { JurisdictionDisplay } from "@/components/JurisdictionDisplay";

const ReportsListPage = () => {
  const navigate = useNavigate();

  const { data: reports, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incident_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <div className="grid gap-4">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Incident Reports</h1>
        <div className="flex items-center gap-4">
          <JurisdictionDisplay />
          <Button onClick={() => navigate("/report/new")}>Create New Report</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {reports?.map((report) => (
          <Card
            key={report.id}
            className="p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/report/${report.id}`)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  Case #{report.case_number || "Pending"}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(report.incident_date || "").toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {report.incident_description?.slice(0, 100)}
                  {report.incident_description?.length > 100 ? "..." : ""}
                </p>
                {report.jurisdiction && (
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3 mr-1" />
                    {report.jurisdiction}
                  </div>
                )}
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  report.report_status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {report.report_status || "pending"}
              </span>
            </div>
          </Card>
        ))}

        {reports?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No reports found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsListPage;
