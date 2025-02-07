
import { LucideIcon } from "lucide-react";

interface ReportSectionProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

const ReportSection = ({ icon: Icon, title, children }: ReportSectionProps) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-6 h-6 text-accent" />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
};

export default ReportSection;
