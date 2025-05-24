
import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { ExitButton } from "@/components/mctetts/ExitButton";
import { MCTETTSHeader } from "@/components/mctetts/MCTETTSHeader";
import { MCTETTSSearchInput } from "@/components/mctetts/MCTETTSSearchInput";
import { MCTETTSTabs } from "@/components/mctetts/MCTETTSTabs";
import { MCTETTSTabContent } from "@/components/mctetts/MCTETTSTabContent";
import { MCTETTSFooter } from "@/components/mctetts/MCTETTSFooter";
import { useMCTETTSSearch } from "@/hooks/useMCTETTSSearch";

const MCTETTSPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("warrants");

  const {
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
  } = useMCTETTSSearch(searchTerm, activeTab);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <div className="container mx-auto py-8 relative max-w-5xl">
        <div className="absolute top-4 right-4 z-10">
          <ExitButton />
        </div>
        
        <MCTETTSHeader />
        
        <div className="bg-slate-800/80 border border-slate-700 rounded-lg shadow-lg p-6 backdrop-blur-sm">
          <MCTETTSSearchInput
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={handleClearSearch}
          />

          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <MCTETTSTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <MCTETTSTabContent
              warrants={warrants}
              vehicles={vehicles}
              missingPersons={missingPersons}
              premises={premises}
              propertyData={propertyData}
              warrantsLoading={warrantsLoading}
              vehiclesLoading={vehiclesLoading}
              missingPersonsLoading={missingPersonsLoading}
              premisesLoading={premisesLoading}
              propertyLoading={propertyLoading}
              searchTerm={searchTerm}
            />
          </Tabs>
          
          <MCTETTSFooter />
        </div>
      </div>
    </div>
  );
};

export default MCTETTSPage;
