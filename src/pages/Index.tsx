
import { motion } from "framer-motion";
import { Hero } from "@/components/Hero";
import ReportForm from "@/components/police-report/ReportForm";

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
              Police Report Categories
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Select a category to enter report details
            </p>
          </div>
          
          <ReportForm />
        </div>
      </motion.section>
    </div>
  );
};

export default Index;
