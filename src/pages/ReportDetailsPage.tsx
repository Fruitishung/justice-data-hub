
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReportForm from '@/components/police-report/ReportForm';
import { Database } from '@/integrations/supabase/types';
import { Separator } from '@/components/ui/separator';

type SuspectDetails = {
  first_name?: string;
  last_name?: string;
  dob?: string;
  address?: string;
  gender?: string;
  height?: string;
  weight?: string;
  hair?: string;
  eyes?: string;
  clothing?: string;
  identifying_marks?: string;
  direction?: string;
  arrest_history?: string;
  charges?: string;
  in_custody?: boolean;
  cell_phone?: string;
  home_phone?: string;
  work_phone?: string;
  weapon?: string;
  strong_hand?: string;
  parole_officer?: string;
};

type IncidentReport = Database['public']['Tables']['incident_reports']['Row'] & {
  evidence_photos: { id: string; file_path: string; }[];
  ai_crime_scene_photos: { id: string; image_path: string; }[];
  suspect_fingerprints: {
    id: string;
    finger_position: string;
    scan_data: string;
    scan_quality: number | null;
    scan_date: string | null;
  }[];
  suspect_details: SuspectDetails;
};

const ReportDetailsPage = () => {
  const { id } = useParams();

  const { data: report, isLoading } = useQuery<IncidentReport>({
    queryKey: ['report', id],
    queryFn: async () => {
      if (!id) throw new Error('No ID provided');
      
      console.log('Fetching report details for ID:', id);
      
      const { data, error } = await supabase
        .from('incident_reports')
        .select(`
          *,
          evidence_photos (
            id,
            file_path
          ),
          ai_crime_scene_photos (
            id,
            image_path
          ),
          suspect_fingerprints:fingerprint_scans (
            id,
            finger_position,
            scan_data,
            scan_quality,
            scan_date
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching report:', error);
        throw error;
      }
      if (!data) {
        console.error('No report found for ID:', id);
        throw new Error('Report not found');
      }

      // Parse the JSON fields
      const parsedData = {
        ...data,
        suspect_details: data.suspect_details as SuspectDetails
      };

      console.log('Fetched report:', parsedData);
      return parsedData as IncidentReport;
    },
    enabled: !!id && id !== 'new'
  });

  if (id === 'new') {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Create New Report</h1>
        <Card className="p-6">
          <ReportForm />
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Report...</h1>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">Report not found</h1>
      </div>
    );
  }

  // Debug log for photos
  console.log('AI Crime Scene Photos:', report.ai_crime_scene_photos);
  console.log('Evidence Photos:', report.evidence_photos);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Report Details - {report.case_number}
      </h1>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Face Sheet</TabsTrigger>
          <TabsTrigger value="photos">Crime Scene Photos</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Face Sheet</h2>
                <Separator className="my-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Case Information</h3>
                  <div className="space-y-2">
                    <p><strong>Case Number:</strong> {report.case_number}</p>
                    <p><strong>Date:</strong> {new Date(report.incident_date || '').toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {report.report_status}</p>
                    <p><strong>Priority:</strong> {report.report_priority}</p>
                    <p><strong>Category:</strong> {report.report_category}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Location Details</h3>
                  <div className="space-y-2">
                    <p><strong>Address:</strong> {report.location_address}</p>
                    <p><strong>Details:</strong> {report.location_details}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="text-lg font-semibold mb-2">Incident Description</h3>
                <p className="whitespace-pre-wrap">{report.incident_description}</p>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Officer Information</h3>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {report.officer_name}</p>
                    <p><strong>Rank:</strong> {report.officer_rank}</p>
                    <p><strong>Badge Number:</strong> {report.officer_badge_number}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Emergency Response</h3>
                  <div className="space-y-2">
                    <p><strong>Response Type:</strong> {report.emergency_response}</p>
                    <p><strong>Units Involved:</strong> {report.emergency_units}</p>
                  </div>
                </div>
              </div>

              {report.suspect_details && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Suspect Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>Name:</strong> {`${report.suspect_details.first_name || ''} ${report.suspect_details.last_name || ''}`}</p>
                        <p><strong>DOB:</strong> {report.suspect_details.dob}</p>
                        <p><strong>Gender:</strong> {report.suspect_details.gender}</p>
                        <p><strong>Height:</strong> {report.suspect_details.height}</p>
                        <p><strong>Weight:</strong> {report.suspect_details.weight}</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>Hair:</strong> {report.suspect_details.hair}</p>
                        <p><strong>Eyes:</strong> {report.suspect_details.eyes}</p>
                        <p><strong>Identifying Marks:</strong> {report.suspect_details.identifying_marks}</p>
                        <p><strong>In Custody:</strong> {report.suspect_details.in_custody ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Crime Scene Photos</h2>
            {report.ai_crime_scene_photos && report.ai_crime_scene_photos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {report.ai_crime_scene_photos.map((photo) => {
                  const imageUrl = supabase.storage
                    .from('ai_crime_scene_photos')
                    .getPublicUrl(photo.image_path).data.publicUrl;
                  
                  console.log('Crime Scene Photo URL:', imageUrl);
                  
                  return (
                    <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={`Crime scene photo for case ${report.case_number}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Error loading crime scene image:', e);
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No crime scene photos available for this case.</p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="evidence">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Evidence Photos</h2>
            <div className="space-y-2 mb-4">
              <p><strong>Description:</strong> {report.evidence_description}</p>
              <p><strong>Location:</strong> {report.evidence_location}</p>
            </div>
            {report.evidence_photos && report.evidence_photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {report.evidence_photos.map((photo) => {
                  const imageUrl = supabase.storage
                    .from('evidence_photos')
                    .getPublicUrl(photo.file_path).data.publicUrl;
                  
                  console.log('Evidence Photo URL:', imageUrl);
                  
                  return (
                    <div key={photo.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt="Evidence"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Error loading evidence image:', e);
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No evidence photos available for this case.</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDetailsPage;
