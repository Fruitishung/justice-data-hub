
import { LucideIcon } from "lucide-react";

interface ReportSectionProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

const ReportSection = ({ icon: Icon, title, children }: ReportSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
};

export default ReportSection;
