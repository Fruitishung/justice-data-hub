
import { motion } from "framer-motion";
import TrainingActions from "./TrainingActions";
import ReportForm from "../police-report/ReportForm";

const ReportCategories = () => {
  return (
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
          <TrainingActions />
        </div>
        
        <ReportForm />
      </div>
    </motion.section>
  );
};

export default ReportCategories;
