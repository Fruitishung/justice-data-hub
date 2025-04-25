
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface Premise {
  id: string;
  address: string;
  last_incident_date: string;
  incident_count: number;
  recent_incidents: string[];
  correlation_score: number;
}

interface PremisesResultsProps {
  premises: Premise[];
  isLoading: boolean;
  searchTerm: string;
}

export const PremisesResults = ({ premises, isLoading, searchTerm }: PremisesResultsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Premises Search Results</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : premises?.length ? (
          <div className="space-y-4">
            {premises.map((premise) => (
              <div
                key={premise.id}
                className="p-4 border rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-lg font-semibold">{premise.address}</p>
                  <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                    {premise.incident_count} incidents
                  </span>
                </div>
                <p><strong>Last Incident:</strong> {format(new Date(premise.last_incident_date), 'PPpp')}</p>
                <div className="mt-2">
                  <p className="font-medium">Recent Incidents:</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    {premise.recent_incidents.map((incident, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{incident}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <p>No premises found</p>
        ) : (
          <p>Enter a search term to find premises history</p>
        )}
      </CardContent>
    </Card>
  );
};
