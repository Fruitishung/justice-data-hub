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
import { FileSearch, Database, AlertTriangle, BadgeAlert } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <div className="container mx-auto py-8 relative max-w-5xl">
        <div className="absolute top-4 right-4 z-10">
          <ExitButton />
        </div>
        
        {/* Classified banner */}
        <div className="bg-red-600 text-white py-1 px-4 text-center font-bold tracking-wider mb-6 animate-pulse rounded">
          RESTRICTED ACCESS - LAW ENFORCEMENT USE ONLY
        </div>

        <div className="flex items-center justify-center mb-8">
          <BadgeAlert className="h-8 w-8 mr-3 text-yellow-400" />
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            MCTETTS SECURE DATABASE
          </h1>
          <FileSearch className="h-8 w-8 ml-3 text-yellow-400" />
        </div>
        
        <div className="bg-slate-800/80 border border-slate-700 rounded-lg shadow-lg p-6 backdrop-blur-sm">
          <div className="flex gap-4 mb-6 items-center">
            <Database className="h-5 w-5 text-cyan-400" />
            <Input
              placeholder="Enter search term..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-slate-900 border-slate-700 text-white"
            />
            <Button 
              onClick={() => setSearchTerm("")} 
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              Clear
            </Button>
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5 bg-slate-900 p-1">
              <TabsTrigger 
                value="warrants" 
                className="data-[state=active]:bg-cyan-700 data-[state=active]:text-white"
              >
                Warrants
              </TabsTrigger>
              <TabsTrigger 
                value="vehicles"
                className="data-[state=active]:bg-cyan-700 data-[state=active]:text-white"
              >
                Vehicles
              </TabsTrigger>
              <TabsTrigger 
                value="missing_persons"
                className="data-[state=active]:bg-cyan-700 data-[state=active]:text-white"
              >
                Missing Persons
              </TabsTrigger>
              <TabsTrigger 
                value="premises"
                className="data-[state=active]:bg-cyan-700 data-[state=active]:text-white"
              >
                Premises
              </TabsTrigger>
              <TabsTrigger 
                value="property"
                className="data-[state=active]:bg-cyan-700 data-[state=active]:text-white"
              >
                Property
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 bg-slate-900/60 p-4 rounded-md border border-slate-700">
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
            </div>
          </Tabs>
          
          <div className="mt-6 text-xs text-slate-500 border-t border-slate-700 pt-4">
            <div className="flex justify-between items-center">
              <p>Terminal ID: MCT-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
              <p>Classification Level: CONFIDENTIAL</p>
              <p>Session: {new Date().toISOString()}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-yellow-400">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-sm">All searches are logged and audited</p>
        </div>
      </div>
    </div>
  );
};

export default MCTETTSPage;
