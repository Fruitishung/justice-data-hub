
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MCTETTSTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const MCTETTSTabs = ({ activeTab, onTabChange }: MCTETTSTabsProps) => {
  return (
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
  );
};
