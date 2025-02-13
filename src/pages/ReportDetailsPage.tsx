
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Car, Fingerprint, Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReportDetailsPage = () => {
  const { id } = useParams();

  const { data: report, isLoading } = useQuery({
    queryKey: ["report-details", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incident_reports")
        .select(`
          *,
          arrest_tags(*),
          crime_scene_photos(*),
          fingerprint_scans(*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="min-h-screen bg-secondary p-8 flex items-center justify-center">Loading...</div>;
  }

  const getPublicUrl = (filePath: string) => {
    if (!filePath) return null;
    return `${supabase.storageClient.url}/object/public/evidence_photos/${filePath}`;
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/mock-data" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Reports
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Case Information */}
          <Card className="p-6 space-y-4 md:col-span-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Case #{report?.case_number}
            </h1>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-600">Type</h3>
                <p className="text-xl">
                  {report?.penal_code === "187" ? "Homicide" : "Armed Robbery"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Status</h3>
                <p className="text-xl">{report?.report_status}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Date</h3>
                <p className="text-xl">
                  {report?.incident_date && new Date(report.incident_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-600 mb-2">Description</h3>
              <p className="text-gray-700">{report?.incident_description}</p>
            </div>
          </Card>

          {/* Arrest Information */}
          {report?.arrest_tags?.[0] && (
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Arrest Information</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Tag #:</span> {report.arrest_tags[0].tag_number}</p>
                <p><span className="font-semibold">Suspect:</span> {report.arrest_tags[0].suspect_name}</p>
                <p><span className="font-semibold">Officer:</span> {report.arrest_tags[0].arresting_officer}</p>
                <Button variant="outline" asChild className="w-full mt-4">
                  <Link to={`/arrest-tag/${report.id}`}>View Full Arrest Tag</Link>
                </Button>
              </div>
            </Card>
          )}
        </div>

        <Tabs defaultValue="photos" className="w-full">
          <TabsList>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Crime Scene Photos
            </TabsTrigger>
            <TabsTrigger value="vehicle" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Vehicle Information
            </TabsTrigger>
            <TabsTrigger value="fingerprints" className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4" />
              Fingerprints
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photos" className="mt-4">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report?.crime_scene_photos?.map((photo) => (
                  <div key={photo.id} className="aspect-square relative rounded-lg overflow-hidden">
                    <img
                      src={getPublicUrl(photo.file_path)}
                      alt="Crime scene"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="vehicle" className="mt-4">
            <Card className="p-6">
              {report?.vehicle_make ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-600">Make</h3>
                    <p>{report.vehicle_make}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600">Model</h3>
                    <p>{report.vehicle_model}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600">Year</h3>
                    <p>{report.vehicle_year}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600">Color</h3>
                    <p>{report.vehicle_color}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600">Plate</h3>
                    <p>{report.vehicle_plate}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600">VIN</h3>
                    <p>{report.vehicle_vin}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No vehicle information available</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="fingerprints" className="mt-4">
            <Card className="p-6">
              {report?.fingerprint_scans?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {report.fingerprint_scans.map((scan) => (
                    <div key={scan.id} className="space-y-2">
                      <h3 className="font-semibold">{scan.finger_position}</h3>
                      <div className="aspect-square bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                        <Fingerprint className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">
                        Quality: {Math.round(scan.scan_quality)}%
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No fingerprint scans available</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportDetailsPage;
