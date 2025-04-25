import { supabase } from "@/lib/supabase";
import { ReportFormData } from "@/components/police-report/types";

export const createIncidentReport = async (reportData: ReportFormData) => {
  const { data, error } = await supabase
    .from('incident_reports')
    .insert({
      location_jurisdiction: reportData.locationJurisdiction,
    });

  if (error) {
    throw error;
  }

  return data;
};
