
import { LucideIcon } from 'lucide-react';
import { motion } from "framer-motion";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const CategoryCard = ({ title, description, icon: Icon }: CategoryCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
    >
      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-primary">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};
