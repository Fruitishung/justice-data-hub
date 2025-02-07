
import { motion } from "framer-motion";
import { 
  Clipboard, 
  Car, 
  User, 
  MapPin, 
  AlertCircle,
  FileText
} from "lucide-react";
import { Hero } from "@/components/Hero";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReportFormData {
  incidentDate: string;
  incidentDescription: string;
  vehicleMake: string;
  vehicleModel: string;
  personName: string;
  personDescription: string;
  locationAddress: string;
  locationDetails: string;
  evidenceDescription: string;
  evidenceLocation: string;
  emergencyResponse: string;
  emergencyUnits: string;
}

const Index = () => {
  const form = useForm<ReportFormData>();

  const onSubmit = (data: ReportFormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Hero />
      
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-20 px-6 lg:px-8"
        id="categories"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Police Report Categories
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Select a category to enter report details
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="incident" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                  <TabsTrigger value="incident" className="flex items-center gap-2">
                    <Clipboard className="w-4 h-4" />
                    <span className="hidden sm:inline">Incident</span>
                  </TabsTrigger>
                  <TabsTrigger value="vehicle" className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    <span className="hidden sm:inline">Vehicle</span>
                  </TabsTrigger>
                  <TabsTrigger value="person" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Person</span>
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
                </TabsList>

                <TabsContent value="incident" className="mt-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Clipboard className="w-6 h-6 text-accent" />
                      <h3 className="text-xl font-semibold">Incident Details</h3>
                    </div>
                    <Input
                      type="datetime-local"
                      placeholder="Incident Date & Time"
                      {...form.register("incidentDate")}
                    />
                    <Textarea
                      placeholder="Incident Description"
                      {...form.register("incidentDescription")}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="vehicle" className="mt-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Car className="w-6 h-6 text-accent" />
                      <h3 className="text-xl font-semibold">Vehicle Information</h3>
                    </div>
                    <Input
                      placeholder="Vehicle Make"
                      {...form.register("vehicleMake")}
                    />
                    <Input
                      placeholder="Vehicle Model"
                      {...form.register("vehicleModel")}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="person" className="mt-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-6 h-6 text-accent" />
                      <h3 className="text-xl font-semibold">Person Details</h3>
                    </div>
                    <Input
                      placeholder="Person Name"
                      {...form.register("personName")}
                    />
                    <Textarea
                      placeholder="Person Description"
                      {...form.register("personDescription")}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="location" className="mt-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-6 h-6 text-accent" />
                      <h3 className="text-xl font-semibold">Location Data</h3>
                    </div>
                    <Input
                      placeholder="Address"
                      {...form.register("locationAddress")}
                    />
                    <Textarea
                      placeholder="Location Details"
                      {...form.register("locationDetails")}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="evidence" className="mt-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-6 h-6 text-accent" />
                      <h3 className="text-xl font-semibold">Evidence Log</h3>
                    </div>
                    <Textarea
                      placeholder="Evidence Description"
                      {...form.register("evidenceDescription")}
                    />
                    <Input
                      placeholder="Evidence Location"
                      {...form.register("evidenceLocation")}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="emergency" className="mt-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-6 h-6 text-accent" />
                      <h3 className="text-xl font-semibold">Emergency Response</h3>
                    </div>
                    <Textarea
                      placeholder="Response Details"
                      {...form.register("emergencyResponse")}
                    />
                    <Input
                      placeholder="Units Involved"
                      {...form.register("emergencyUnits")}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-center mt-8">
                <Button 
                  type="submit"
                  className="bg-accent hover:bg-accent/90 text-white px-8"
                >
                  Submit Report
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </motion.section>
    </div>
  );
};

export default Index;
