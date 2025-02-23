
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Database } from '@/integrations/supabase/types';
import { ArrestTagFeedback } from "./ArrestTagFeedback";
import { ArrestTagMugshot } from "./ArrestTagMugshot";
import { ArrestTagDetails } from "./ArrestTagDetails";

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
        .eq("id", id) // Changed from incident_report_id to id
        .maybeSingle();

      if (error) {
        console.error("Error fetching arrest tag:", error);
        throw error;
      }
      
      if (!data) {
        console.log("No arrest tag found with ID:", id);
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
          arrest_tag_id: arrestTag.id,
          suspect_name: arrestTag.suspect_name,
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

  // Show feedback states if needed
  const feedback = (
    <ArrestTagFeedback 
      isLoading={isLoading} 
      error={!!error} 
      id={id} 
    />
  );
  if (feedback) return feedback;

  if (!arrestTag) return null;

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
            <ArrestTagDetails arrestTag={arrestTag} />
            <ArrestTagMugshot 
              arrestTag={arrestTag}
              isGenerating={isGenerating}
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
