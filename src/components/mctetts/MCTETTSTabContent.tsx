
import { TabsContent } from "@/components/ui/tabs";
import { WarrantResults } from "./WarrantResults";
import { VehicleResults } from "./VehicleResults";
import { MissingPersonsResults } from "./MissingPersonsResults";
import { PremisesResults } from "./PremisesResults";
import { PropertyResults } from "./PropertyResults";
import type { Warrant, Vehicle, PropertyRecord } from "@/types/reports";

interface MCTETTSTabContentProps {
  warrants: Warrant[];
  vehicles: Vehicle[];
  missingPersons: any[];
  premises: any[];
  propertyData: PropertyRecord[];
  warrantsLoading: boolean;
  vehiclesLoading: boolean;
  missingPersonsLoading: boolean;
  premisesLoading: boolean;
  propertyLoading: boolean;
  searchTerm: string;
}

export const MCTETTSTabContent = ({
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
  searchTerm
}: MCTETTSTabContentProps) => {
  return (
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
  );
};
