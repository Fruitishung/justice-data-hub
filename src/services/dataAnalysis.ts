
import { supabase } from "@/integrations/supabase/client";

export const createAnalysisEntry = async (reportId: string, suspectDetails: any, arrestTag: any, incidentDescription: string) => {
  const { error: analysisError } = await supabase
    .from('data_analysis_training')
    .insert([
      {
        incident_report_id: reportId,
        analysis_type: 'arrest_analysis',
        training_module: 'suspect_processing',
        analysis_metrics: {
          suspect_details: suspectDetails,
          arrest_tag: arrestTag,
          incident_type: incidentDescription
        }
      }
    ]);

  if (analysisError) {
    console.error('Analysis entry creation error:', analysisError);
    // Don't throw here as it's not critical to the main flow
  }
};
