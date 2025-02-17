
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, AlertCircle, Car, FileText, Link, MapPin, UserX, Users } from "lucide-react";

const CategoryTabs = ({ children }: { children: React.ReactNode }) => {
  return (
    <Tabs defaultValue="emergency" className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <TabsTrigger value="emergency" className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Emergency
        </TabsTrigger>
        <TabsTrigger value="incident" className="flex items-center gap-2">
          <Link className="h-4 w-4" />
          Incident
        </TabsTrigger>
        <TabsTrigger value="vehicle" className="flex items-center gap-2">
          <Car className="h-4 w-4" />
          Vehicle
        </TabsTrigger>
        <TabsTrigger value="location" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Location
        </TabsTrigger>
        <TabsTrigger value="evidence" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Evidence
        </TabsTrigger>
        <TabsTrigger value="victim" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Victim
        </TabsTrigger>
        <TabsTrigger value="suspect" className="flex items-center gap-2">
          <UserX className="h-4 w-4" />
          Suspect
        </TabsTrigger>
        <TabsTrigger value="photos" className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Photos
        </TabsTrigger>
      </TabsList>
      <div className="mt-4">
        {children}
      </div>
    </Tabs>
  );
};

export default CategoryTabs;
