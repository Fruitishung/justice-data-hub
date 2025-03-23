
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Jurisdiction {
  state: string;
  county: string;
  city: string;
  isLoading: boolean;
  error: string | null;
}

export const useJurisdiction = () => {
  const { toast } = useToast();
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>({
    state: "",
    county: "",
    city: "",
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const determineJurisdiction = async () => {
      try {
        if (!navigator.geolocation) {
          throw new Error("Geolocation is not supported by your browser");
        }

        // Get current position
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              
              // Use reverse geocoding to get location details
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
              );
              
              if (!response.ok) {
                throw new Error("Failed to fetch location data");
              }
              
              const data = await response.json();
              
              setJurisdiction({
                state: data.address.state || "",
                county: data.address.county || "",
                city: data.address.city || data.address.town || data.address.village || "",
                isLoading: false,
                error: null,
              });
              
              toast({
                title: "Jurisdiction detected",
                description: `${data.address.city || data.address.town || data.address.village || "Unknown city"}, ${data.address.state || "Unknown state"}`,
              });
            } catch (error) {
              console.error("Error getting location details:", error);
              setJurisdiction(prev => ({
                ...prev,
                isLoading: false,
                error: "Failed to determine jurisdiction. Please enter manually."
              }));
              
              toast({
                variant: "destructive",
                title: "Location detection failed",
                description: "Unable to determine your jurisdiction automatically. Please enter it manually.",
              });
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setJurisdiction(prev => ({
              ...prev,
              isLoading: false,
              error: "Failed to access your location. Please enter jurisdiction manually."
            }));
            
            toast({
              variant: "destructive",
              title: "Location access denied",
              description: "Please enable location access or enter jurisdiction manually.",
            });
          }
        );
      } catch (error) {
        console.error("Error in jurisdiction detection:", error);
        setJurisdiction(prev => ({
          ...prev,
          isLoading: false,
          error: "Location services unavailable. Please enter jurisdiction manually."
        }));
        
        toast({
          variant: "destructive",
          title: "Location services error",
          description: "Unable to detect location. Please enter jurisdiction manually.",
        });
      }
    };

    determineJurisdiction();
  }, [toast]);

  return jurisdiction;
};
