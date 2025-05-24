
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Warrant, Vehicle, PropertyRecord } from "@/types/reports";

export const useMCTETTSSearch = (searchTerm: string, activeTab: string) => {
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

  return {
    warrants,
    vehicles,
    missingPersons,
    premises,
    propertyData,
    warrantsLoading,
    vehiclesLoading,
    missingPersonsLoading,
    premisesLoading,
    propertyLoading,
  };
};
