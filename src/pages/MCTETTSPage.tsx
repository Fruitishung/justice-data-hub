
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExitButton } from "@/components/mctetts/ExitButton";
import { WarrantResults } from "@/components/mctetts/WarrantResults";
import { VehicleResults } from "@/components/mctetts/VehicleResults";
import { PropertyResults } from "@/components/mctetts/PropertyResults";
import { MissingPersonsResults } from "@/components/mctetts/MissingPersonsResults";
import { PremisesResults } from "@/components/mctetts/PremisesResults";
import type { Warrant, Vehicle, PropertyRecord } from "@/types/reports";

const MCTETTSPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("warrants");

  const { data: warrants, isLoading: warrantsLoading } = useQuery({
    queryKey: ["warrants", searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('search_warrants', { search_term: searchTerm });
      if (error) throw error;
      return data as Warrant[];
    },
    enabled: activeTab === "warrants" && searchTerm.length > 0,
  });

  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["vehicles", searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('search_vehicles', { search_term: searchTerm });
      if (error) throw error;
      return data as Vehicle[];
    },
    enabled: activeTab === "vehicles" && searchTerm.length > 0,
  });

  const { data: missingPersons, isLoading: missingPersonsLoading } = useQuery({
    queryKey: ["missing_persons", searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('search_missing_persons', { search_term: searchTerm });
      if (error) throw error;
      return data;
    },
    enabled: activeTab === "missing_persons" && searchTerm.length > 0,
  });

  const { data: premises, isLoading: premisesLoading } = useQuery({
    queryKey: ["premises", searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('search_premises', { search_term: searchTerm });
      if (error) throw error;
      return data;
    },
    enabled: activeTab === "premises" && searchTerm.length > 0,
  });

  const { data: propertyData, isLoading: propertyLoading } = useQuery({
    queryKey: ["property", searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('search_property', { search_term: searchTerm });
      if (error) throw error;
      return data as PropertyRecord[];
    },
    enabled: activeTab === "property" && searchTerm.length > 0,
  });

  return (
    <div className="container mx-auto py-8 relative">
      <div className="absolute top-0 right-0">
        <ExitButton />
      </div>

      <h1 className="text-4xl font-bold text-center mb-8">
        Mock Career Technical Education Teletype Services (MCTETTS)
      </h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Enter search term..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button onClick={() => setSearchTerm("")}>Clear</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="warrants">Warrants</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="missing_persons">Missing Persons</TabsTrigger>
            <TabsTrigger value="premises">Premises</TabsTrigger>
            <TabsTrigger value="property">Property</TabsTrigger>
          </TabsList>

          <TabsContent value="warrants">
            <WarrantResults 
              warrants={warrants || []}
              isLoading={warrantsLoading}
              searchTerm={searchTerm}
            />
          </TabsContent>

          <TabsContent value="vehicles">
            <VehicleResults 
              vehicles={vehicles || []}
              isLoading={vehiclesLoading}
              searchTerm={searchTerm}
            />
          </TabsContent>

          <TabsContent value="missing_persons">
            <MissingPersonsResults 
              missingPersons={missingPersons || []}
              isLoading={missingPersonsLoading}
              searchTerm={searchTerm}
            />
          </TabsContent>

          <TabsContent value="premises">
            <PremisesResults 
              premises={premises || []}
              isLoading={premisesLoading}
              searchTerm={searchTerm}
            />
          </TabsContent>

          <TabsContent value="property">
            <PropertyResults 
              property={propertyData || []}
              isLoading={propertyLoading}
              searchTerm={searchTerm}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MCTETTSPage;
