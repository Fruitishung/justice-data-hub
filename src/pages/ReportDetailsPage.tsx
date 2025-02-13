
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ReportDetailsPage = () => {
  const { id } = useParams();

  const { data: report, isLoading } = useQuery({
    queryKey: ['report', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incident_reports')
        .select(`
          *,
          evidence_photos,
          suspect_fingerprints:fingerprint_scans(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: photos, isLoading: photosLoading } = useQuery({
    queryKey: ['report-photos', id],
    queryFn: async () => {
      if (!report?.evidence_photos) return [];

      const { data: filesData } = await supabase
        .storage
        .from('evidence_photos')
        .list(id as string);

      return filesData || [];
    },
    enabled: !!report
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Incident Information</h2>
          <div className="space-y-2">
            <p><strong>Date:</strong> {new Date(report.incident_date || '').toLocaleDateString()}</p>
            <p><strong>Description:</strong> {report.incident_description}</p>
            <p><strong>Location:</strong> {report.location_address}</p>
            <p><strong>Status:</strong> {report.report_status}</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Evidence</h2>
          <div className="space-y-2">
            <p><strong>Description:</strong> {report.evidence_description}</p>
            <p><strong>Location:</strong> {report.evidence_location}</p>
            {photosLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {photos?.map((photo) => (
                  <div key={photo.name} className="aspect-square bg-gray-100 rounded">
                    <img
                      src={`${supabase.storage.from('evidence_photos').getPublicUrl(photo.name).data.publicUrl}`}
                      alt="Evidence"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportDetailsPage;
