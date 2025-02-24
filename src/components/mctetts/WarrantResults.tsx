
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Warrant {
  id: string;
  suspect_name: string;
  warrant_type: string;
  issue_date: string;
  status: string;
  case_number: string;
  correlation_score: number;
}

interface WarrantResultsProps {
  warrants: Warrant[];
  isLoading: boolean;
  searchTerm: string;
}

export const WarrantResults = ({ warrants, isLoading, searchTerm }: WarrantResultsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Warrant Search Results</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : warrants?.length ? (
          <div className="space-y-4">
            {warrants.map((warrant) => (
              <div
                key={warrant.id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-lg font-semibold">{warrant.suspect_name}</p>
                    <p className="text-sm text-muted-foreground">Case #{warrant.case_number}</p>
                  </div>
                  <Badge 
                    variant={warrant.status === 'Open' ? 'destructive' : 'secondary'}
                  >
                    {warrant.warrant_type}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p><strong>Status:</strong> {warrant.status}</p>
                    <p><strong>Issued:</strong> {new Date(warrant.issue_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p><strong>Match Score:</strong> {warrant.correlation_score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <p>No warrants found</p>
        ) : (
          <p>Enter a search term to find warrants</p>
        )}
      </CardContent>
    </Card>
  );
};
