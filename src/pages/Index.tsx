
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/Hero";
import ReportCategories from "@/components/index/ReportCategories";
import TrainingActions from "@/components/index/TrainingActions";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Hero />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Report Generator</h2>
          <p className="text-gray-600 mb-4">
            Create detailed police reports with our advanced report generator. 
            Includes sections for incident details, vehicle information, suspects, and more.
          </p>
          <Button 
            onClick={() => navigate("/report/new")}
            className="w-full"
          >
            Create New Report
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Reports</h2>
          <p className="text-gray-600 mb-4">
            View and manage your existing reports. Track progress, update details, and generate narratives.
          </p>
          <Button 
            variant="outline"
            onClick={() => navigate("/reports")}
            className="w-full"
          >
            View All Reports
          </Button>
        </Card>
      </div>

      <ReportCategories />
      <TrainingActions />
    </div>
  );
};

export default Index;
