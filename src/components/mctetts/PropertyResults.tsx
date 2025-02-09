
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyRecord {
  id: string;
  serial_number: string;
  property_type: string;
  make: string;
  model: string;
  description: string;
  owner_name: string;
  stolen_status: boolean;
  recovered_date: string | null;
  recovery_location: string | null;
}

interface PropertyResultsProps {
  property: PropertyRecord[] | undefined;
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
                <p><strong>Serial Number:</strong> {item.serial_number}</p>
                <p><strong>Type:</strong> {item.property_type}</p>
                <p><strong>Make/Model:</strong> {item.make} {item.model}</p>
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Owner:</strong> {item.owner_name}</p>
                <p><strong>Status:</strong> {item.stolen_status ? "⚠️ STOLEN" : "Clear"}</p>
                {item.recovered_date && (
                  <>
                    <p><strong>Recovered:</strong> {new Date(item.recovered_date).toLocaleDateString()}</p>
                    <p><strong>Recovery Location:</strong> {item.recovery_location}</p>
                  </>
                )}
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
