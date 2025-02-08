
import { supabase } from "@/integrations/supabase/client";
import { ReportFormData } from "@/components/police-report/types";

export const createArrestTag = async (reportId: string, reportData: ReportFormData, officerName: string) => {
  const { data: arrestTag, error: arrestTagError } = await supabase
    .from('arrest_tags')
    .insert([
      {
        incident_report_id: reportId,
        suspect_name: `${reportData.suspectFirstName} ${reportData.suspectLastName}`.trim(),
        charges: reportData.suspectCharges,
        arresting_officer: officerName,
      }
    ])
    .select()
    .single();

  if (arrestTagError) {
    console.error('Arrest tag creation error:', arrestTagError);
    throw arrestTagError;
  }

  return arrestTag;
};
