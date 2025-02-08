
import { supabase } from "@/integrations/supabase/client";
import { ReportFormData } from "@/components/police-report/types";

export const createIncidentReport = async (data: ReportFormData) => {
  const { data: report, error: reportError } = await supabase
    .from('incident_reports')
    .insert([
      {
        incident_date: data.incidentDate,
        incident_description: data.incidentDescription,
        vehicle_make: data.vehicleMake,
        vehicle_model: data.vehicleModel,
        location_address: data.locationAddress,
        location_details: data.locationDetails,
        evidence_description: data.evidenceDescription,
        evidence_location: data.evidenceLocation,
        evidence_photos: data.evidencePhotos,
        emergency_response: data.emergencyResponse,
        emergency_units: data.emergencyUnits,
        victim_details: {
          first_name: data.victimFirstName,
          last_name: data.victimLastName,
          dob: data.victimDOB,
          address: data.victimAddress,
          gender: data.victimGender,
          height: data.victimHeight,
          weight: data.victimWeight,
          hair: data.victimHair,
          eyes: data.victimEyes,
          clothing: data.victimClothing,
          identifying_marks: data.victimIdentifyingMarks,
          injuries: data.victimInjuries,
          cell_phone: data.victimCellPhone,
          home_phone: data.victimHomePhone,
          work_phone: data.victimWorkPhone
        },
        suspect_details: {
          first_name: data.suspectFirstName,
          last_name: data.suspectLastName,
          dob: data.suspectDOB,
          address: data.suspectAddress,
          age: data.suspectAge,
          gender: data.suspectGender,
          height: data.suspectHeight,
          weight: data.suspectWeight,
          hair: data.suspectHair,
          eyes: data.suspectEyes,
          clothing: data.suspectClothing,
          identifying_marks: data.suspectIdentifyingMarks,
          direction: data.suspectDirection,
          arrest_history: data.suspectArrestHistory,
          charges: data.suspectCharges,
          in_custody: data.suspectInCustody,
          cell_phone: data.suspectCellPhone,
          home_phone: data.suspectHomePhone,
          work_phone: data.suspectWorkPhone,
          weapon: data.suspectWeapon,
          strong_hand: data.suspectStrongHand,
          parole_officer: data.suspectParoleOfficer
        }
      }
    ])
    .select()
    .single();

  if (reportError) {
    console.error('Report insertion error:', reportError);
    throw reportError;
  }

  return report;
};

export const createNarrativeReport = async (reportId: string) => {
  const { error: narrativeError } = await supabase
    .from('narrative_reports')
    .insert([
      {
        incident_report_id: reportId,
        narrative_text: '',
        status: 'pending'
      }
    ]);

  if (narrativeError) {
    console.error('Narrative creation error:', narrativeError);
    throw narrativeError;
  }
};
