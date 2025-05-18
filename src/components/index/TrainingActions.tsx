
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Database, Camera, FileSearch } from "lucide-react";

const TrainingActions = () => {
  return (
    <div className="mt-6 space-y-4">
      <Button asChild variant="outline" className="w-full bg-slate-900 hover:bg-slate-800 border-slate-700 text-cyan-400">
        <Link to="/mctetts" className="flex items-center gap-2">
          <FileSearch className="h-4 w-4" />
          Access MCTETTS Secure System
        </Link>
      </Button>
      <div className="space-y-2">
        <Button asChild variant="outline">
          <Link to="/mock-data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            View Training Data
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/training-photos" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Generate Training Photos
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TrainingActions;
