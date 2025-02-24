
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyRecord {
  id: string;
  type: string;
  description: string;
  serial_number: string;
  owner: string;
  status: string;
}

interface PropertyResultsProps {
  property: PropertyRecord[];
  isLoading: boolean;
  searchTerm: string;
}

export const PropertyResults = ({ property, isLoading, searchTerm }: PropertyResultsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Search Results</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : property?.length ? (
          <div className="space-y-4">
            {property.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg shadow-sm"
              >
                <p><strong>Type:</strong> {item.type}</p>
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Serial Number:</strong> {item.serial_number}</p>
                <p><strong>Owner:</strong> {item.owner}</p>
                <p><strong>Status:</strong> {item.status}</p>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <p>No property records found</p>
        ) : (
          <p>Enter a search term to find property records</p>
        )}
      </CardContent>
    </Card>
  );
};
