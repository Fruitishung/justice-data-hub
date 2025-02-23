
import { Database } from "@/integrations/supabase/types";

type ArrestTag = Database['public']['Tables']['arrest_tags']['Row'] & {
  incident_reports: Database['public']['Tables']['incident_reports']['Row'] | null;
};

interface ArrestTagDetailsProps {
  arrestTag: ArrestTag;
}

export const ArrestTagDetails = ({ arrestTag }: ArrestTagDetailsProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-gray-600">Suspect Name</h3>
          <p className="text-xl">{arrestTag?.suspect_name}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-600">Booking Date</h3>
          <p className="text-xl">
            {formatDate(arrestTag?.booking_date)}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-600">Charges</h3>
        <p className="text-xl">{arrestTag?.charges}</p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-600">Arresting Officer</h3>
        <p className="text-xl">{arrestTag?.arresting_officer}</p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-600">Case Number</h3>
        <p className="text-xl">{arrestTag?.incident_reports?.case_number}</p>
      </div>
    </div>
  );
};
