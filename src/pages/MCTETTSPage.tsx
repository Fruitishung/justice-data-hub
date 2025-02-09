
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MCTETTSPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("warrants");
  const navigate = useNavigate();

  const { data: warrants, isLoading: warrantsLoading } = useQuery({
    queryKey: ["warrants", searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("search_warrants", {
        search_term: searchTerm,
      });
      if (error) throw error;
      return data;
    },
    enabled: activeTab === "warrants" && searchTerm.length > 0,
  });

  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["vehicles", searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("search_vehicles", {
        search_term: searchTerm,
      });
      if (error) throw error;
      return data;
    },
    enabled: activeTab === "vehicles" && searchTerm.length > 0,
  });

  return (
    <div className="container mx-auto py-8 relative">
      <div className="absolute top-0 right-0">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <X className="h-6 w-6" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Exit MCTETTS System</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to exit the MCTETTS system? Any unsaved changes will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => navigate("/")}>
                Exit System
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="warrants">Warrants</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          </TabsList>

          <TabsContent value="warrants">
            <Card>
              <CardHeader>
                <CardTitle>Warrant Search Results</CardTitle>
              </CardHeader>
              <CardContent>
                {warrantsLoading ? (
                  <p>Loading...</p>
                ) : warrants?.length ? (
                  <div className="space-y-4">
                    {warrants.map((warrant) => (
                      <div
                        key={warrant.id}
                        className="p-4 border rounded-lg shadow-sm"
                      >
                        <p><strong>Warrant #:</strong> {warrant.warrant_number}</p>
                        <p><strong>Subject:</strong> {warrant.subject_name}</p>
                        <p><strong>Status:</strong> {warrant.status}</p>
                        <p><strong>Type:</strong> {warrant.warrant_type}</p>
                        <p><strong>Issued:</strong> {new Date(warrant.date_issued).toLocaleDateString()}</p>
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
          </TabsContent>

          <TabsContent value="vehicles">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Search Results</CardTitle>
              </CardHeader>
              <CardContent>
                {vehiclesLoading ? (
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MCTETTSPage;
