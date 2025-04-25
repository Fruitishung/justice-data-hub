
import { supabase } from "@/lib/supabase";
import { ReportFormData } from "@/components/police-report/types";

export const createIncidentReport = async (reportData: ReportFormData) => {
  const { data, error } = await supabase
    .from('incident_reports')
    .insert({
      location_address: reportData.locationAddress,
      location_details: reportData.locationDetails,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const createNarrativeReport = async (incidentReportId: string) => {
  const { data, error } = await supabase
    .from('narrative_reports')
    .insert({ incident_report_id: incidentReportId })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
