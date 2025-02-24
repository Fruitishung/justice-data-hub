
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"

const GenerateMockDataButton = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generateMockData = async () => {
    setIsGenerating(true)
    try {
      // Create a mock incident report
      const { data: report, error: reportError } = await supabase
        .from('incident_reports')
        .insert([{
          incident_date: new Date().toISOString(),
          incident_description: "Suspect forcibly entered premises through rear window. Multiple items reported missing. Fingerprints recovered from point of entry.",
          report_status: "Open",
          officer_name: "Detective Sarah Johnson",
          location_address: "742 Evergreen Terrace",
          location_details: "Single-story residential home, point of entry through kitchen window",
          evidence_description: "Fingerprints on window frame, muddy footprints on kitchen floor",
          evidence_location: "Kitchen window and surrounding area",
          emergency_response: "First responder units dispatched",
          emergency_units: "Unit 14, K-9 Unit 3",
          evidence_property: {
            type: "Electronics",
            description: "MacBook Pro laptop",
            serial_number: "C02E23RFHV2N",
            make: "Apple",
            color: "Space Gray",
            additional_details: "15-inch model, slight scratch on lid"
          },
          suspect_details: {
            first_name: "John",
            last_name: "Doe",
            aka: "Shadow",
            height: "6'2\"",
            weight: "185 lbs",
            hair: "Brown",
            eyes: "Blue",
            clothing: "Dark hoodie, jeans, black sneakers",
            identifying_marks: "Tattoo on right forearm - dragon design",
            direction: "Last seen heading north on foot",
            arrest_history: "Prior arrests for burglary in neighboring counties",
            charges: "Burglary, Criminal Trespassing",
            in_custody: false,
            cell_phone: "555-0123",
            weapon: "None observed",
            strong_hand: "Right"
          },
          victim_details: {
            first_name: "Alice",
            last_name: "Smith",
            dob: "1985-06-15",
            address: "742 Evergreen Terrace",
            phone: "555-0145",
            statement: "Returned home from work at approximately 18:30 to find back window broken"
          },
          penal_code: "459" // California Penal Code for Burglary
        }])
        .select()
        .single();

      if (reportError) throw reportError;
      
      // Generate fingerprint scan data
      if (report) {
        const { error: fingerprintError } = await supabase
          .from('fingerprint_scans')
          .insert([{
            incident_report_id: report.id,
            finger_position: "right_thumb",
            scan_quality: 85,
            scan_data: "MockFingerprint_" + Date.now(),
            scan_date: new Date().toISOString()
          }]);

        if (fingerprintError) throw fingerprintError;

        const { error: photoError } = await supabase
          .from('evidence_photos')
          .insert([{
            incident_report_id: report.id,
            file_path: "/mock/evidence/window_entry.jpg",
          }]);

        if (photoError) throw photoError;
      }

      toast({
        title: "Mock Data Generated",
        description: `Created incident report with ID: ${report.id}`,
      });

    } catch (error) {
      console.error('Error generating mock data:', error);
      toast({
        title: "Error",
        description: "Failed to generate mock data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={generateMockData}
      disabled={isGenerating}
      variant="outline"
      className="mt-4"
    >
      {isGenerating ? "Generating..." : "Generate Training Data"}
    </Button>
  );
};

export default GenerateMockDataButton;
