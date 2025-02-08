
import { 
  Clipboard, 
  Car, 
  MapPin, 
  AlertCircle,
  FileText,
  UserMinus,
  UserX,
  Camera
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CategoryTabs = ({ children }: { children: React.ReactNode }) => {
  return (
    <Tabs defaultValue="incident" className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
        <TabsTrigger value="incident" className="flex items-center gap-2">
          <Clipboard className="w-4 h-4" />
          <span className="hidden sm:inline">Incident</span>
        </TabsTrigger>
        <TabsTrigger value="vehicle" className="flex items-center gap-2">
          <Car className="w-4 h-4" />
          <span className="hidden sm:inline">Vehicle</span>
        </TabsTrigger>
        <TabsTrigger value="location" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">Location</span>
        </TabsTrigger>
        <TabsTrigger value="evidence" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Evidence</span>
        </TabsTrigger>
        <TabsTrigger value="emergency" className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Emergency</span>
        </TabsTrigger>
        <TabsTrigger value="victim" className="flex items-center gap-2">
          <UserMinus className="w-4 h-4" />
          <span className="hidden sm:inline">Victim</span>
        </TabsTrigger>
        <TabsTrigger value="suspect" className="flex items-center gap-2">
          <UserX className="w-4 h-4" />
          <span className="hidden sm:inline">Suspect</span>
        </TabsTrigger>
        <TabsTrigger value="photos" className="flex items-center gap-2">
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Photos</span>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default CategoryTabs;
