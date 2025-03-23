
import { Shield } from "lucide-react";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { Skeleton } from "@/components/ui/skeleton";

export const JurisdictionDisplay = () => {
  const { state, county, city, isLoading, error } = useJurisdiction();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <Shield className="h-4 w-4 text-muted-foreground" />
        <Skeleton className="h-4 w-40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-sm text-red-500">
        <Shield className="h-4 w-4" />
        <span>Unknown jurisdiction</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      <Shield className="h-4 w-4 text-primary" />
      <span className="font-medium">
        {city && county
          ? `${city}, ${county}, ${state}`
          : city
          ? `${city}, ${state}`
          : county
          ? `${county}, ${state}`
          : state || "Unknown jurisdiction"}
      </span>
    </div>
  );
};
