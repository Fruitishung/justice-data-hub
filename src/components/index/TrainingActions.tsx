
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Database } from "lucide-react";

const TrainingActions = () => {
  return (
    <div className="mt-6 space-y-4">
      <Button asChild variant="outline">
        <Link to="/mctetts">Access MCTETTS System</Link>
      </Button>
      <div>
        <Button asChild variant="outline">
          <Link to="/mock-data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            View Training Data
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TrainingActions;
