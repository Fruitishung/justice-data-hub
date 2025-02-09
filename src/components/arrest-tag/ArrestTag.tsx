
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const ArrestTag = () => {
  const { id } = useParams();

  const { data: arrestTag, isLoading } = useQuery({
    queryKey: ["arrest-tag", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("arrest_tags")
        .select("*, incident_reports(*)")
        .eq("incident_report_id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading arrest tag...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <Card className="max-w-3xl mx-auto p-8 bg-white print:shadow-none">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">Arrest Tag</h1>
          <Button 
            onClick={handlePrint}
            className="print:hidden"
            variant="outline"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print Tag
          </Button>
        </div>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <div className="text-4xl font-bold text-center text-primary">
              {arrestTag?.tag_number}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-600">Suspect Name</h3>
              <p className="text-xl">{arrestTag?.suspect_name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-600">Booking Date</h3>
              <p className="text-xl">
                {formatDate(arrestTag?.booking_date)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-600">Charges</h3>
            <p className="text-xl">{arrestTag?.charges}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-600">Arresting Officer</h3>
            <p className="text-xl">{arrestTag?.arresting_officer}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-600">Case Number</h3>
            <p className="text-xl">{arrestTag?.incident_reports?.case_number}</p>
          </div>

          <div className="mt-8">
            <div className="text-sm text-gray-500">
              Processing Status: {arrestTag?.processing_status}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ArrestTag;

