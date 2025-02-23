
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Database } from '@/integrations/supabase/types';

type ArrestTag = Database['public']['Tables']['arrest_tags']['Row'] & {
  incident_reports: Database['public']['Tables']['incident_reports']['Row'] | null;
};

const ArrestTag = () => {
  const { id } = useParams();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: arrestTag, isLoading, error, refetch } = useQuery({
    queryKey: ["arrest-tag", id],
    queryFn: async () => {
      if (!id) throw new Error("No ID provided");
      
      const { data, error } = await supabase
        .from("arrest_tags")
        .select("*, incident_reports(*)")
        .eq("incident_report_id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching arrest tag:", error);
        throw error;
      }
      
      if (!data) {
        console.log("No arrest tag found for incident report:", id);
        throw new Error("Arrest tag not found");
      }
      
      return data as ArrestTag;
    },
    enabled: !!id,
    retry: 1
  });

  const handlePrint = () => {
    window.print();
  };

  const generateMugshot = async () => {
    if (!arrestTag) return;
    
    console.log('Generating mugshot for:', {
      arrest_tag_id: arrestTag.id,
      suspect_name: arrestTag.suspect_name
    });
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-mugshot", {
        body: {
          suspect_name: arrestTag.suspect_name,
          arrest_tag_id: arrestTag.id,
        },
      });

      if (error) {
        console.error('Mugshot generation error:', error);
        throw error;
      }
      
      console.log('Mugshot generation response:', data);
      
      await refetch();
      toast.success("Mugshot generated successfully");
    } catch (error) {
      console.error("Error generating mugshot:", error);
      toast.error("Failed to generate mugshot");
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-secondary p-8">
        <Card className="max-w-3xl mx-auto p-8">
          <h1 className="text-2xl font-bold text-red-600">No arrest tag ID provided</h1>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary p-8">
        <Card className="max-w-3xl mx-auto p-8">
          <div>Loading arrest tag...</div>
        </Card>
      </div>
    );
  }

  if (error || !arrestTag) {
    return (
      <div className="min-h-screen bg-secondary p-8">
        <Card className="max-w-3xl mx-auto p-8">
          <h1 className="text-2xl font-bold text-red-600">
            Arrest tag not found for this incident report
          </h1>
          <p className="mt-2 text-gray-600">
            Please make sure the incident report has a suspect marked as in custody.
          </p>
        </Card>
      </div>
    );
  }

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

          <div className="flex items-start gap-8">
            <div className="flex-1 space-y-6">
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
            </div>

            <div className="w-64 space-y-4">
              {arrestTag?.mugshot_url ? (
                <img 
                  src={arrestTag.mugshot_url} 
                  alt="Suspect Mugshot" 
                  className="w-full rounded-lg shadow-md"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <Button
                    onClick={generateMugshot}
                    disabled={isGenerating}
                    variant="secondary"
                  >
                    {isGenerating ? "Generating..." : "Generate Mugshot"}
                  </Button>
                </div>
              )}
            </div>
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
