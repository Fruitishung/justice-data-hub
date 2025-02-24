
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Warrant {
  id: string;
  suspect_name: string;
  warrant_type: string;
  issue_date: string;
  status: string;
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
                className="p-4 border rounded-lg shadow-sm"
              >
                <p><strong>Subject:</strong> {warrant.suspect_name}</p>
                <p><strong>Type:</strong> {warrant.warrant_type}</p>
                <p><strong>Status:</strong> {warrant.status}</p>
                <p><strong>Issued:</strong> {new Date(warrant.issue_date).toLocaleDateString()}</p>
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
