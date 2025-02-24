
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Printer, FileImage } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ArrestTagFeedback } from "./ArrestTagFeedback";
import { ArrestTagMugshot } from "./ArrestTagMugshot";
import { ArrestTagDetails } from "./ArrestTagDetails";
import { type IncidentReport, type ArrestTag as ArrestTagType } from "@/types/reports";

type ArrestTagResponse = Database['public']['Tables']['arrest_tags']['Row'] & {
  incident_reports: Database['public']['Tables']['incident_reports']['Row'] | null;
};

const ArrestTag = () => {
  const { id } = useParams();
  const [isGeneratingMugshot, setIsGeneratingMugshot] = useState(false);
  const [isGeneratingCrimeScene, setIsGeneratingCrimeScene] = useState(false);

  const { data: arrestTag, isLoading, error, refetch } = useQuery({
    queryKey: ["arrest-tag", id],
    queryFn: async () => {
      if (!id) throw new Error("No ID provided");
      
      const { data, error } = await supabase
        .from("arrest_tags")
        .select(`
          *,
          incident_reports:incident_report_id (*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching arrest tag:", error);
        throw error;
      }
      
      if (!data) {
        console.log("No arrest tag found with ID:", id);
        throw new Error("Arrest tag not found");
      }
      
      return data as ArrestTagResponse;
    },
    enabled: !!id,
    retry: 1
  });

  const handlePrint = () => {
    window.print();
  };

  const generateMugshot = async () => {
    if (!arrestTag) return;
    
    console.log('Generating mugshot for arrest tag:', arrestTag.id);
    
    setIsGeneratingMugshot(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-mugshot", {
        body: {
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
      setIsGeneratingMugshot(false);
    }
  };

  const generateCrimeScene = async () => {
    if (!arrestTag?.incident_report_id) {
      toast.error("No incident report associated with this arrest tag");
      return;
    }

    setIsGeneratingCrimeScene(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-crime-scene", {
        body: {
          incident_report_id: arrestTag.incident_report_id,
        },
      });

      if (error) throw error;

      if (data?.success) {
        toast.success("Crime scene photo generated successfully");
        await refetch();
      }
    } catch (error) {
      console.error("Error generating crime scene photo:", error);
      toast.error("Failed to generate crime scene photo");
    } finally {
      setIsGeneratingCrimeScene(false);
    }
  };

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
            Arrest tag not found
          </h1>
          <p className="mt-2 text-gray-600">
            Please make sure the arrest tag ID is correct.
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
          <div className="space-x-2">
            <Button
              onClick={generateCrimeScene}
              disabled={isGeneratingCrimeScene || !arrestTag.incident_report_id}
              variant="outline"
              className="print:hidden"
            >
              <FileImage className="mr-2 h-4 w-4" />
              {isGeneratingCrimeScene ? "Generating..." : "Generate Crime Scene"}
            </Button>
            <Button 
              onClick={handlePrint}
              className="print:hidden"
              variant="outline"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Tag
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <div className="text-4xl font-bold text-center text-primary">
              {arrestTag?.tag_number}
            </div>
          </div>

          <div className="flex items-start gap-8">
            <ArrestTagDetails arrestTag={arrestTag} />
            <ArrestTagMugshot 
              arrestTag={arrestTag}
              isGenerating={isGeneratingMugshot}
              onGenerate={generateMugshot}
            />
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
