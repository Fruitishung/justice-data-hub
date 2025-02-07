
import { motion } from "framer-motion";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const CategoryCard = ({ title, description, icon }: CategoryCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
    >
      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
        <div className="text-accent">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-primary">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};
