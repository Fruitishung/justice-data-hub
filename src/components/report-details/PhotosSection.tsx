
import React from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { type IncidentReport } from '@/types/reports';

interface PhotosSectionProps {
  report: IncidentReport;
}

export const PhotosSection = ({ report }: PhotosSectionProps) => {
  return (
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
  );
};
