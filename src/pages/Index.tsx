
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
import { CategoryCard } from "@/components/CategoryCard";

const reportFields = [
  {
    title: "Incident Details",
    description: "Date, time, location, and nature of incident reporting.",
    icon: <Clipboard className="w-6 h-6" />,
  },
  {
    title: "Vehicle Information",
    description: "Vehicle details, registration, and traffic-related data.",
    icon: <Car className="w-6 h-6" />,
  },
  {
    title: "Person Details",
    description: "Subject, victim, and witness information collection.",
    icon: <User className="w-6 h-6" />,
  },
  {
    title: "Location Data",
    description: "Precise location details and jurisdiction information.",
    icon: <MapPin className="w-6 h-6" />,
  },
  {
    title: "Evidence Log",
    description: "Documentation of collected evidence and property.",
    icon: <FileText className="w-6 h-6" />,
  },
  {
    title: "Emergency Response",
    description: "Response details and additional unit involvement.",
    icon: <AlertCircle className="w-6 h-6" />,
  },
];

const Index = () => {
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {reportFields.map((field, index) => (
              <motion.div
                key={field.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                <CategoryCard {...field} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Index;
