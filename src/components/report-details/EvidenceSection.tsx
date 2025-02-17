
import React from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { type IncidentReport } from '@/types/reports';

interface EvidenceSectionProps {
  report: IncidentReport;
}

export const EvidenceSection = ({ report }: EvidenceSectionProps) => {
  return (
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
  );
};
