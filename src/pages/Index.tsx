
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
              Report Entry Fields
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Standard law enforcement report documentation sections
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {/* Incident Details Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="p-6 bg-white rounded-xl shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Clipboard className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-semibold">Incident Details</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Input
                        type="datetime-local"
                        placeholder="Incident Date & Time"
                        {...form.register("incidentDate")}
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Incident Description"
                        {...form.register("incidentDescription")}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Vehicle Information Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="p-6 bg-white rounded-xl shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Car className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-semibold">Vehicle Information</h3>
                  </div>
                  <div className="space-y-4">
                    <Input
                      placeholder="Vehicle Make"
                      {...form.register("vehicleMake")}
                    />
                    <Input
                      placeholder="Vehicle Model"
                      {...form.register("vehicleModel")}
                    />
                  </div>
                </motion.div>

                {/* Person Details Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="p-6 bg-white rounded-xl shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-semibold">Person Details</h3>
                  </div>
                  <div className="space-y-4">
                    <Input
                      placeholder="Person Name"
                      {...form.register("personName")}
                    />
                    <Textarea
                      placeholder="Person Description"
                      {...form.register("personDescription")}
                    />
                  </div>
                </motion.div>

                {/* Location Data Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="p-6 bg-white rounded-xl shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-semibold">Location Data</h3>
                  </div>
                  <div className="space-y-4">
                    <Input
                      placeholder="Address"
                      {...form.register("locationAddress")}
                    />
                    <Textarea
                      placeholder="Location Details"
                      {...form.register("locationDetails")}
                    />
                  </div>
                </motion.div>

                {/* Evidence Log Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="p-6 bg-white rounded-xl shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-semibold">Evidence Log</h3>
                  </div>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Evidence Description"
                      {...form.register("evidenceDescription")}
                    />
                    <Input
                      placeholder="Evidence Location"
                      {...form.register("evidenceLocation")}
                    />
                  </div>
                </motion.div>

                {/* Emergency Response Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="p-6 bg-white rounded-xl shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-semibold">Emergency Response</h3>
                  </div>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Response Details"
                      {...form.register("emergencyResponse")}
                    />
                    <Input
                      placeholder="Units Involved"
                      {...form.register("emergencyUnits")}
                    />
                  </div>
                </motion.div>
              </div>

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
