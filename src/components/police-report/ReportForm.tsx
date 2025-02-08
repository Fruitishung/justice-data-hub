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
    try {
      const { data: report, error: reportError } = await supabase
        .from('incident_reports')
        .insert([
          {
            incident_date: data.incidentDate,
            incident_description: data.incidentDescription,
            // ... other fields from form data
          }
        ])
        .select()
        .single();

      if (reportError) throw reportError;

      const { error: narrativeError } = await supabase
        .from('narrative_reports')
        .insert([
          {
            incident_report_id: report.id,
            narrative_text: '',
            status: 'pending'
          }
        ]);

      if (narrativeError) throw narrativeError;

      toast({
        title: "Report Submitted",
        description: "A new narrative report has been created and linked to this incident.",
      });

      navigate(`/narrative/${report.id}`);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
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
