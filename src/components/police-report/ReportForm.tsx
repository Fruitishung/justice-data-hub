
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import CategoryTabs from "./CategoryTabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ReportFormData } from "./types";
import { createIncidentReport, createNarrativeReport } from "@/services/incidentReport";
import { createArrestTag } from "@/services/arrestTag";
import { createAnalysisEntry } from "@/services/dataAnalysis";

import IncidentSection from "./form-sections/IncidentSection";
import VehicleSection from "./form-sections/VehicleSection";
import LocationSection from "./form-sections/LocationSection";
import EvidenceSection from "./form-sections/EvidenceSection";
import EmergencySection from "./form-sections/EmergencySection";
import VictimSection from "./form-sections/VictimSection";
import SuspectSection from "./form-sections/SuspectSection";
import PhotosSection from "./form-sections/PhotosSection";
import { type IncidentReport } from '@/types/reports';

interface ReportFormProps {
  data?: IncidentReport;
}

const ReportForm = ({ data }: ReportFormProps) => {
  const form = useForm<ReportFormData>({
    defaultValues: {
      evidencePhotos: []
    }
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (formData: ReportFormData) => {
    console.log('Form data being submitted:', formData);
    
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

      // Create incident report
      const report = await createIncidentReport(formData);

      if (!report) {
        throw new Error('Failed to create incident report');
      }

      // Link evidence photos to the incident report
      if (formData.evidencePhotos && formData.evidencePhotos.length > 0) {
        const photoRecords = formData.evidencePhotos.map(photo => ({
          incident_report_id: report.id,
          file_path: photo.path,
          uploaded_at: new Date().toISOString()
        }));

        const { error: photoError } = await supabase
          .from('evidence_photos')
          .insert(photoRecords);

        if (photoError) {
          console.error('Error linking photos:', photoError);
          // Continue despite photo linking error
        }
      }

      // Create arrest tag if suspect is in custody
      if (formData.suspectInCustody) {
        const arrestTag = await createArrestTag(report.id, formData, report.officer_name);
        
        if (!arrestTag) {
          throw new Error('Failed to create arrest tag');
        }

        // Create data analysis entry for the arrest
        await createAnalysisEntry(
          report.id, 
          report.suspect_details, 
          arrestTag, 
          report.incident_description
        );

        toast({
          title: "Report Submitted",
          description: "An arrest tag has been generated and queued for analysis.",
        });

        navigate(`/arrest-tag/${arrestTag.id}`);
        return;
      }

      // Create narrative report if no arrest
      const narrativeReport = await createNarrativeReport(report.id);

      if (!narrativeReport) {
        throw new Error('Failed to create narrative report');
      }

      toast({
        title: "Report Submitted",
        description: "A new narrative report has been created and linked to this incident.",
      });

      navigate(`/report/${report.id}`);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit report. Please try again.",
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

          <TabsContent value="photos" className="mt-6">
            <PhotosSection form={form} />
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
