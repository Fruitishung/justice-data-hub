
import { Shield, MapPin, BarChart4 } from "lucide-react";
import { useJurisdiction, type Jurisdiction } from "@/hooks/useJurisdiction";
import { useCompStatData } from "@/hooks/useCompStatData";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CompStatDisplay } from "./CompStatDisplay";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const JurisdictionDisplay = () => {
  const { state, county, city, policeDistrict, isLoading, error } = useJurisdiction();
  const { compStatData, isLoading: isLoadingStats, error: statsError } = useCompStatData({ state, county, city });
  
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
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center space-x-2 text-sm cursor-pointer hover:text-primary-foreground/80">
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
          <BarChart4 className="h-4 w-4 text-primary" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-screen max-w-2xl p-0" align="end">
        <Tabs defaultValue="compstat">
          <TabsList className="w-full rounded-t-lg rounded-b-none border-b">
            <TabsTrigger value="jurisdiction">Jurisdiction</TabsTrigger>
            <TabsTrigger value="compstat">CompStat Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="jurisdiction" className="p-4 space-y-4">
            <div className="font-medium text-lg border-b pb-2">
              Jurisdiction Details
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">City:</span>
                <span className="font-medium">{city || "Unknown"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">County:</span>
                <span className="font-medium">{county || "Unknown"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">State:</span>
                <span className="font-medium">{state || "Unknown"}</span>
              </div>
            </div>

            {policeDistrict && (
              <div className="pt-2 border-t">
                <div className="font-medium mb-2">Police Department:</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{policeDistrict.name}</span>
                  </div>
                  {policeDistrict.area && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Area:</span>
                      <span className="font-medium">{policeDistrict.area}</span>
                    </div>
                  )}
                  {policeDistrict.zone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Zone:</span>
                      <span className="font-medium">{policeDistrict.zone}</span>
                    </div>
                  )}
                  {policeDistrict.precinct && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Precinct:</span>
                      <span className="font-medium">{policeDistrict.precinct}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="compstat" className="p-4">
            <CompStatDisplay 
              compStatData={compStatData} 
              isLoading={isLoadingStats} 
              error={statsError} 
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
