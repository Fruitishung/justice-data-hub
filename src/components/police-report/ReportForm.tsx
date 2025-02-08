
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import CategoryTabs from "./CategoryTabs";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { ReportFormData } from "./types";

import IncidentSection from "./form-sections/IncidentSection";
import VehicleSection from "./form-sections/VehicleSection";
import PersonSection from "./form-sections/PersonSection";
import LocationSection from "./form-sections/LocationSection";
import EvidenceSection from "./form-sections/EvidenceSection";
import EmergencySection from "./form-sections/EmergencySection";
import VictimSection from "./form-sections/VictimSection";
import SuspectSection from "./form-sections/SuspectSection";

const ReportForm = () => {
  const form = useForm<ReportFormData>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: ReportFormData) => {
    console.log('Form data being submitted:', data);
    
    try {
      // First, test the Supabase connection
      const { data: testData, error: testError } = await supabase
        .from('incident_reports')
        .select('*')
        .limit(1);
      
      console.log('Supabase connection test:', { testData, testError });

      if (testError) {
        console.error('Supabase connection test error:', testError);
        throw new Error('Failed to connect to database');
      }

      // Proceed with inserting the report
      const { data: report, error: reportError } = await supabase
        .from('incident_reports')
        .insert([
          {
            incident_date: data.incidentDate,
            incident_description: data.incidentDescription,
            vehicle_make: data.vehicleMake,
            vehicle_model: data.vehicleModel,
            person_name: data.personName,
            person_description: data.personDescription,
            location_address: data.locationAddress,
            location_details: data.locationDetails,
            evidence_description: data.evidenceDescription,
            evidence_location: data.evidenceLocation,
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

      console.log('Report insertion result:', { report, reportError });

      if (reportError) {
        console.error('Report insertion error:', reportError);
        throw reportError;
      }

      // Create narrative report
      const { error: narrativeError } = await supabase
        .from('narrative_reports')
        .insert([
          {
            incident_report_id: report.id,
            narrative_text: '',
            status: 'pending'
          }
        ]);

      console.log('Narrative creation result:', { narrativeError });

      if (narrativeError) {
        console.error('Narrative creation error:', narrativeError);
        throw narrativeError;
      }

      toast({
        title: "Report Submitted",
        description: "A new narrative report has been created and linked to this incident.",
      });

      navigate(`/narrative/${report.id}`);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CategoryTabs>
          <TabsContent value="incident" className="mt-6">
            <IncidentSection form={form} />
          </TabsContent>

          <TabsContent value="vehicle" className="mt-6">
            <VehicleSection form={form} />
          </TabsContent>

          <TabsContent value="person" className="mt-6">
            <PersonSection form={form} />
          </TabsContent>

          <TabsContent value="location" className="mt-6">
            <LocationSection form={form} />
          </TabsContent>

          <TabsContent value="evidence" className="mt-6">
            <EvidenceSection form={form} />
          </TabsContent>

          <TabsContent value="emergency" className="mt-6">
            <EmergencySection form={form} />
          </TabsContent>

          <TabsContent value="victim" className="mt-6">
            <VictimSection form={form} />
          </TabsContent>

          <TabsContent value="suspect" className="mt-6">
            <SuspectSection form={form} />
          </TabsContent>
        </CategoryTabs>

        <div className="flex justify-center mt-8">
          <Button 
            type="submit"
            className="bg-accent hover:bg-accent/90 text-white px-8"
          >
            Submit Report
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReportForm;
