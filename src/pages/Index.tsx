import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, icon, link }) => {
  return (
    <Link to={link}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <i className={`lucide lucide-${icon} w-6 h-6 mr-2 text-gray-600`}></i>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Police Report Management System</h1>
        {user ? (
          <div>
            <span>Welcome, {user.email}</span>
            <Button variant="outline" className="ml-4" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      </header>

      <main className="space-y-6">
        <IncidentActions />
        <TrainingActions />
      </main>
    </div>
  );
};

const IncidentActions = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Incident Reporting</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CategoryCard
            title="Create New Report"
            description="Start a new incident report with detailed sections"
            icon="FilePlus"
            link="/report/new"
          />
          <CategoryCard
            title="View Existing Reports"
            description="Search, review, and update existing incident reports"
            icon="FileSearch"
            link="/reports"
          />
          <CategoryCard
            title="Manage Arrest Tags"
            description="View and manage arrest tags associated with incidents"
            icon="Tag"
            link="/arrest-tags"
          />
        </div>
      </div>
    </section>
  );
};

const TrainingActions = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Training & Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CategoryCard
            title="Generate Mock Data"
            description="Create sample incident reports and arrest tags for testing"
            icon="Database"
            link="/mock-data"
          />
          <CategoryCard
            title="Student Data Protection"
            description="Manage student data protection settings and view access logs"
            icon="Shield"
            link="/student-data-protection"
          />
          <CategoryCard
            title="MCTETTS System"
            description="Access the Mobile Computer Terminal Emergency Temporary Tag System"
            icon="Terminal"
            link="/mctetts"
          />
        </div>
      </div>
    </section>
  );
};

export default Index;
