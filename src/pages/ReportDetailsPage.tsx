
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
        suspect_details: data.suspect_details as IncidentReport['suspect_details']
      };

      console.log('Fetched report:', parsedData);
      return parsedData;
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
