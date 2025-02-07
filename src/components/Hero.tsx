
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-primary py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Law Enforcement Report System
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Standardized digital report writing system for law enforcement training and education
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#categories"
              className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 transition-colors duration-300"
            >
              Start New Report
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
