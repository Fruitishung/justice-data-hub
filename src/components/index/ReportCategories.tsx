
import { Link } from "react-router-dom";
import { CategoryCard } from "@/components/CategoryCard";
import { 
  FileText, 
  Building2, 
  Car, 
  AlertTriangle, 
  Users, 
  Briefcase,
  Shield,
  FileWarning 
} from "lucide-react";

const ReportCategories = () => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6">Report Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/report/new">
          <CategoryCard
            title="General Incident"
            description="Basic incident report form"
            icon={FileText}
          />
        </Link>
        <Link to="/report/new">
          <CategoryCard
            title="Commercial Burglary"
            description="Business break-ins and theft"
            icon={Building2}
          />
        </Link>
        <Link to="/report/new">
          <CategoryCard
            title="Vehicle Crime"
            description="Auto theft and vandalism"
            icon={Car}
          />
        </Link>
        <Link to="/report/new">
          <CategoryCard
            title="Assault"
            description="Physical altercations"
            icon={AlertTriangle}
          />
        </Link>
        <Link to="/report/new">
          <CategoryCard
            title="Missing Person"
            description="Missing persons reports"
            icon={Users}
          />
        </Link>
        <Link to="/report/new">
          <CategoryCard
            title="Property Crime"
            description="Theft and property damage"
            icon={Briefcase}
          />
        </Link>
        <Link to="/report/new">
          <CategoryCard
            title="Criminal Activity"
            description="General criminal incidents"
            icon={Shield}
          />
        </Link>
        <Link to="/report/new">
          <CategoryCard
            title="Special Incident"
            description="Unique or unusual cases"
            icon={FileWarning}
          />
        </Link>
      </div>
    </div>
  );
};

export default ReportCategories;
