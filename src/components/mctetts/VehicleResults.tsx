
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Vehicle {
  id: string;
  plate_number: string;
  vin: string;
  make: string;
  model: string;
  year: number;  // Changed from string to number
  color: string;
  owner_name: string;
  stolen_status: boolean;
}

interface VehicleResultsProps {
  vehicles: Vehicle[] | undefined;
  isLoading: boolean;
  searchTerm: string;
}

export const VehicleResults = ({ vehicles, isLoading, searchTerm }: VehicleResultsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Search Results</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : vehicles?.length ? (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="p-4 border rounded-lg shadow-sm"
              >
                <p><strong>Plate:</strong> {vehicle.plate_number}</p>
                <p><strong>VIN:</strong> {vehicle.vin}</p>
                <p><strong>Make/Model:</strong> {vehicle.make} {vehicle.model}</p>
                <p><strong>Year:</strong> {vehicle.year}</p>
                <p><strong>Color:</strong> {vehicle.color}</p>
                <p><strong>Owner:</strong> {vehicle.owner_name}</p>
                <p><strong>Status:</strong> {vehicle.stolen_status ? "⚠️ STOLEN" : "Clear"}</p>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <p>No vehicles found</p>
        ) : (
          <p>Enter a search term to find vehicles</p>
        )}
      </CardContent>
    </Card>
  );
};

