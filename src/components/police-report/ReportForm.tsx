import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import CategoryTabs from "./CategoryTabs";
import ReportSection from "./ReportSection";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { 
  Clipboard, 
  Car, 
  User, 
  MapPin, 
  AlertCircle,
  FileText,
  Users,
  UserX,
  Link
} from "lucide-react";

interface ReportFormData {
  incidentDate: string;
  incidentDescription: string;
  vehicleMake: string;
  vehicleModel: string;
  personName: string;
  personDescription: string;
  locationAddress: string;
  locationDetails: string;
  evidenceDescription: string;
  evidenceLocation: string;
  emergencyResponse: string;
  emergencyUnits: string;

  victimName: string;
  victimAge: string;
  victimGender: string;
  victimAddress: string;
  victimPhone: string;
  victimInjuries: string;

  suspectName: string;
  suspectAge: string;
  suspectGender: string;
  suspectHeight: string;
  suspectWeight: string;
  suspectHair: string;
  suspectEyes: string;
  suspectClothing: string;
  suspectIdentifyingMarks: string;
  suspectDirection: string;
}

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
            <ReportSection icon={Clipboard} title="Incident Details">
              <Input
                type="datetime-local"
                placeholder="Incident Date & Time"
                {...form.register("incidentDate")}
              />
              <div className="space-y-2">
                <Textarea
                  placeholder="Incident Description"
                  {...form.register("incidentDescription")}
                />
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  A detailed narrative report will be linked after submission
                </p>
              </div>
            </ReportSection>
          </TabsContent>

          <TabsContent value="vehicle" className="mt-6">
            <ReportSection icon={Car} title="Vehicle Information">
              <Input
                placeholder="Vehicle Make"
                {...form.register("vehicleMake")}
              />
              <Input
                placeholder="Vehicle Model"
                {...form.register("vehicleModel")}
              />
            </ReportSection>
          </TabsContent>

          <TabsContent value="person" className="mt-6">
            <ReportSection icon={User} title="Person Details">
              <Input
                placeholder="Person Name"
                {...form.register("personName")}
              />
              <Textarea
                placeholder="Person Description"
                {...form.register("personDescription")}
              />
            </ReportSection>
          </TabsContent>

          <TabsContent value="location" className="mt-6">
            <ReportSection icon={MapPin} title="Location Data">
              <Input
                placeholder="Address"
                {...form.register("locationAddress")}
              />
              <Textarea
                placeholder="Location Details"
                {...form.register("locationDetails")}
              />
            </ReportSection>
          </TabsContent>

          <TabsContent value="evidence" className="mt-6">
            <ReportSection icon={FileText} title="Evidence Log">
              <Textarea
                placeholder="Evidence Description"
                {...form.register("evidenceDescription")}
              />
              <Input
                placeholder="Evidence Location"
                {...form.register("evidenceLocation")}
              />
            </ReportSection>
          </TabsContent>

          <TabsContent value="emergency" className="mt-6">
            <ReportSection icon={AlertCircle} title="Emergency Response">
              <Textarea
                placeholder="Response Details"
                {...form.register("emergencyResponse")}
              />
              <Input
                placeholder="Units Involved"
                {...form.register("emergencyUnits")}
              />
            </ReportSection>
          </TabsContent>

          <TabsContent value="victim" className="mt-6">
            <ReportSection icon={Users} title="Victim Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Full Name"
                  {...form.register("victimName")}
                />
                <Input
                  placeholder="Age"
                  type="number"
                  {...form.register("victimAge")}
                />
                <Input
                  placeholder="Gender"
                  {...form.register("victimGender")}
                />
                <Input
                  placeholder="Phone Number"
                  type="tel"
                  {...form.register("victimPhone")}
                />
              </div>
              <Input
                placeholder="Address"
                {...form.register("victimAddress")}
              />
              <Textarea
                placeholder="Injuries/Condition"
                {...form.register("victimInjuries")}
              />
            </ReportSection>
          </TabsContent>

          <TabsContent value="suspect" className="mt-6">
            <ReportSection icon={UserX} title="Suspect Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Full Name (if known)"
                  {...form.register("suspectName")}
                />
                <Input
                  placeholder="Approximate Age"
                  {...form.register("suspectAge")}
                />
                <Input
                  placeholder="Gender"
                  {...form.register("suspectGender")}
                />
                <Input
                  placeholder="Height"
                  {...form.register("suspectHeight")}
                />
                <Input
                  placeholder="Weight"
                  {...form.register("suspectWeight")}
                />
                <Input
                  placeholder="Hair Color"
                  {...form.register("suspectHair")}
                />
                <Input
                  placeholder="Eye Color"
                  {...form.register("suspectEyes")}
                />
              </div>
              <Textarea
                placeholder="Clothing Description"
                {...form.register("suspectClothing")}
              />
              <Textarea
                placeholder="Identifying Marks (tattoos, scars, etc.)"
                {...form.register("suspectIdentifyingMarks")}
              />
              <Input
                placeholder="Direction of Travel/Last Seen"
                {...form.register("suspectDirection")}
              />
            </ReportSection>
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
