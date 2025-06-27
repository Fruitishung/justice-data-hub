import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Car, UserSearch, Shield, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface VehicleResult {
  id: string;
  make: string;
  model: string;
  year: string;
  vin: string;
  plate: string;
  owner: string;
}

interface WarrantResult {
  id: string;
  suspect_name: string;
  warrant_type: string;
  issue_date: string;
  status: string;
  case_number: string;
  correlation_score: number;
}

interface SuspectResult {
  id: string;
  tag_number: string;
  suspect_name: string;
  charges: string;
  booking_date: string;
  arresting_officer: string;
}

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [vehicleResults, setVehicleResults] = useState<VehicleResult[]>([]);
  const [warrantResults, setWarrantResults] = useState<WarrantResult[]>([]);
  const [suspectResults, setSuspectResults] = useState<SuspectResult[]>([]);
  const { toast } = useToast();

  // Focus search input on mount
  React.useEffect(() => {
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      // Search vehicles directly from incident_reports (RPC functions have bugs)
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('incident_reports')
        .select('id, vehicle_make, vehicle_model, vehicle_year, vehicle_vin, vehicle_plate, suspect_details')
        .or(`vehicle_make.ilike.%${searchTerm}%,vehicle_model.ilike.%${searchTerm}%,vehicle_plate.ilike.%${searchTerm}%,vehicle_vin.ilike.%${searchTerm}%`)
        .not('vehicle_make', 'is', null)
        .order('created_at', { ascending: false });
      
      if (vehicleError) {
        console.error('Vehicle search error:', vehicleError);
      }
      
      // Transform vehicle data to match expected format
      const vehicles: VehicleResult[] = (vehicleData || []).map(item => ({
        id: item.id,
        make: item.vehicle_make || '',
        model: item.vehicle_model || '',
        year: item.vehicle_year || '',
        vin: item.vehicle_vin || '',
        plate: item.vehicle_plate || '',
        owner: item.suspect_details ? 
          `${item.suspect_details.first_name || ''} ${item.suspect_details.last_name || ''}`.trim() || 'Unknown' 
          : 'Unknown'
      }));
      setVehicleResults(vehicles);

      // Search warrants (using arrest_tags as warrant source since RPC has bugs)
      const { data: warrantData, error: warrantError } = await supabase
        .from('arrest_tags')
        .select('*')
        .or(`suspect_name.ilike.%${searchTerm}%,charges.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });
      
      if (warrantError) {
        console.error('Warrant search error:', warrantError);
      }

      // Transform warrant data to match expected format
      const warrants: WarrantResult[] = (warrantData || []).map(item => ({
        id: item.id,
        suspect_name: item.suspect_name || 'Unknown',
        warrant_type: 'Arrest Warrant',
        issue_date: item.booking_date ? format(new Date(item.booking_date), 'yyyy-MM-dd') : '',
        status: item.processing_status || 'pending',
        case_number: item.tag_number || '',
        correlation_score: 1.0
      }));
      setWarrantResults(warrants);

      // Search suspects in arrest_tags
      const { data: suspects, error: suspectError } = await supabase
        .from('arrest_tags')
        .select('*')
        .or(`suspect_name.ilike.%${searchTerm}%,tag_number.ilike.%${searchTerm}%,charges.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });
      
      if (suspectError) throw suspectError;
      setSuspectResults(suspects || []);

      // Auto-switch to appropriate tab based on results
      if (vehicles?.length && !warrants?.length && !suspects?.length) {
        setActiveTab("vehicles");
      } else if (warrants?.length && !vehicles?.length && !suspects?.length) {
        setActiveTab("warrants");
      } else if (suspects?.length && !vehicles?.length && !warrants?.length) {
        setActiveTab("suspects");
      } else {
        setActiveTab("all");
      }

      const totalResults = vehicles.length + warrants.length + (suspects?.length || 0);
      toast({
        title: "Search Complete", 
        description: `Found ${totalResults} results`,
      });
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getTotalResults = () => {
    return vehicleResults.length + warrantResults.length + suspectResults.length;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Unified Search</h1>
          <p className="text-muted-foreground">
            Search for vehicles, warrants, and suspects across the entire database
          </p>
        </div>

        <Card className="p-6">
          <div className="flex gap-4">
            <Input
              placeholder="Enter name, plate number, VIN, case number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="min-w-[120px]"
            >
              <Search className="mr-2 h-4 w-4" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </Card>

        {getTotalResults() > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All ({getTotalResults()})
              </TabsTrigger>
              <TabsTrigger value="vehicles">
                <Car className="mr-2 h-4 w-4" />
                Vehicles ({vehicleResults.length})
              </TabsTrigger>
              <TabsTrigger value="warrants">
                <Shield className="mr-2 h-4 w-4" />
                Warrants ({warrantResults.length})
              </TabsTrigger>
              <TabsTrigger value="suspects">
                <UserSearch className="mr-2 h-4 w-4" />
                Suspects ({suspectResults.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {vehicleResults.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Car className="mr-2 h-5 w-5" />
                    Vehicles
                  </h3>
                  <div className="space-y-2">
                    {vehicleResults.slice(0, 3).map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                    {vehicleResults.length > 3 && (
                      <Button
                        variant="ghost"
                        onClick={() => setActiveTab("vehicles")}
                        className="w-full"
                      >
                        View all {vehicleResults.length} vehicles
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {warrantResults.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Warrants
                  </h3>
                  <div className="space-y-2">
                    {warrantResults.slice(0, 3).map((warrant) => (
                      <WarrantCard key={warrant.id} warrant={warrant} />
                    ))}
                    {warrantResults.length > 3 && (
                      <Button
                        variant="ghost"
                        onClick={() => setActiveTab("warrants")}
                        className="w-full"
                      >
                        View all {warrantResults.length} warrants
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {suspectResults.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <UserSearch className="mr-2 h-5 w-5" />
                    Suspects
                  </h3>
                  <div className="space-y-2">
                    {suspectResults.slice(0, 3).map((suspect) => (
                      <SuspectCard key={suspect.id} suspect={suspect} />
                    ))}
                    {suspectResults.length > 3 && (
                      <Button
                        variant="ghost"
                        onClick={() => setActiveTab("suspects")}
                        className="w-full"
                      >
                        View all {suspectResults.length} suspects
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="vehicles" className="mt-6">
              <div className="space-y-2">
                {vehicleResults.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="warrants" className="mt-6">
              <div className="space-y-2">
                {warrantResults.map((warrant) => (
                  <WarrantCard key={warrant.id} warrant={warrant} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="suspects" className="mt-6">
              <div className="space-y-2">
                {suspectResults.map((suspect) => (
                  <SuspectCard key={suspect.id} suspect={suspect} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!isSearching && getTotalResults() === 0 && searchTerm && (
          <Card className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No results found for "{searchTerm}"
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

const VehicleCard = ({ vehicle }: { vehicle: VehicleResult }) => (
  <Card className="p-4 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-semibold">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </p>
        <p className="text-sm text-muted-foreground">
          Plate: <span className="font-mono">{vehicle.plate}</span> | 
          VIN: <span className="font-mono">{vehicle.vin}</span>
        </p>
        <p className="text-sm mt-1">
          Owner: {vehicle.owner}
        </p>
      </div>
      <Car className="h-5 w-5 text-muted-foreground" />
    </div>
  </Card>
);

const WarrantCard = ({ warrant }: { warrant: WarrantResult }) => (
  <Card className="p-4 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{warrant.suspect_name}</p>
          {warrant.warrant_type === 'ACTIVE WARRANT' && (
            <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
              ACTIVE
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Case #: {warrant.case_number} | Status: {warrant.status}
        </p>
        <p className="text-sm">
          Issued: {format(new Date(warrant.issue_date), 'MM/dd/yyyy')}
        </p>
        {warrant.correlation_score > 1 && (
          <p className="text-xs text-green-600 mt-1">
            High match confidence
          </p>
        )}
      </div>
      <Shield className="h-5 w-5 text-muted-foreground" />
    </div>
  </Card>
);

const SuspectCard = ({ suspect }: { suspect: SuspectResult }) => (
  <Card className="p-4 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="font-semibold">{suspect.suspect_name}</p>
        <p className="text-sm text-muted-foreground">
          Tag #: {suspect.tag_number} | Officer: {suspect.arresting_officer}
        </p>
        <p className="text-sm">
          Charges: {suspect.charges}
        </p>
        <p className="text-sm text-muted-foreground">
          Booked: {format(new Date(suspect.booking_date), 'MM/dd/yyyy HH:mm')}
        </p>
      </div>
      <UserSearch className="h-5 w-5 text-muted-foreground" />
    </div>
  </Card>
);

export default SearchPage;