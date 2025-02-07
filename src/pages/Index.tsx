
import { motion } from "framer-motion";
import { BookOpen, Scale, Shield, Users } from "lucide-react";
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";

const categories = [
  {
    title: "Criminal Law Fundamentals",
    description: "Essential principles and concepts of criminal law and justice system.",
    icon: <Scale className="w-6 h-6" />,
  },
  {
    title: "Law Enforcement",
    description: "Modern policing methods, procedures, and best practices.",
    icon: <Shield className="w-6 h-6" />,
  },
  {
    title: "Criminal Procedure",
    description: "Step-by-step guides to criminal justice procedures and protocols.",
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    title: "Community Policing",
    description: "Building strong relationships between law enforcement and communities.",
    icon: <Users className="w-6 h-6" />,
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
              Featured Categories
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore our comprehensive collection of criminal justice resources
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                <CategoryCard {...category} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Index;
