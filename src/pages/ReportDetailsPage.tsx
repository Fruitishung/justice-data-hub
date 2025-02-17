
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReportForm from '@/components/police-report/ReportForm';
import { type IncidentReport } from '@/types/reports';
import { FaceSheet } from '@/components/report-details/FaceSheet';
import { PhotosSection } from '@/components/report-details/PhotosSection';
import { EvidenceSection } from '@/components/report-details/EvidenceSection';

const ReportDetailsPage = () => {
  const { id } = useParams();

  // For new reports, initialize with empty data
  const emptyReport: IncidentReport = {
    id: '',
    case_number: 'NEW',
    incident_date: null,
    incident_description: '',
    report_status: 'Open',
    created_at: new Date().toISOString(),
    evidence_photos: [],
    ai_crime_scene_photos: [],
    suspect_fingerprints: [],
    suspect_details: {},
    location_address: '',
    location_details: '',
    evidence_description: '',
    evidence_location: '',
    emergency_response: '',
    emergency_units: '',
    conclusion_details: null,
    disposition_details: null,
    evidence_property: null,
    investigation_details: null,
    source_details: null,
    penal_code: null,
    resolution_date: null,
    vehicle_crime_involvement: null,
    vehicle_towing_authority: null,
    victim_details: null,
    report_priority: null,
    report_category: null,
    report_type: null,
    vehicle_year: null,
    vehicle_color: null,
    vehicle_plate: null,
    vehicle_vin: null,
    vehicle_model: null,
    vehicle_make: null,
    person_description: null,
    person_name: null,
    officer_name: null,
    officer_rank: null,
    officer_badge_number: null,
    report_resolution: null
  };

  const { data: report, isLoading } = useQuery<IncidentReport>({
    queryKey: ['report', id],
    queryFn: async () => {
      if (!id) throw new Error('No ID provided');
      if (id === 'new') return emptyReport;
      
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
        suspect_details: data.suspect_details as IncidentReport['suspect_details']
      };

      console.log('Fetched report:', parsedData);
      return parsedData;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Report...</h1>
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Special handling for new reports - don't show error
  if (id === 'new') {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Create New Report</h1>
        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Face Sheet</TabsTrigger>
            <TabsTrigger value="photos">Crime Scene Photos</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <FaceSheet report={emptyReport} />
          </TabsContent>

          <TabsContent value="photos">
            <PhotosSection report={emptyReport} />
          </TabsContent>

          <TabsContent value="evidence">
            <EvidenceSection report={emptyReport} />
          </TabsContent>
        </Tabs>
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
          <FaceSheet report={report} />
        </TabsContent>

        <TabsContent value="photos">
          <PhotosSection report={report} />
        </TabsContent>

        <TabsContent value="evidence">
          <EvidenceSection report={report} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDetailsPage;
