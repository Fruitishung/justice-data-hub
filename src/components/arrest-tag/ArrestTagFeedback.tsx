
import { Card } from "@/components/ui/card";

interface ArrestTagFeedbackProps {
  isLoading?: boolean;
  error?: boolean;
  id?: string;
}

export const ArrestTagFeedback = ({ isLoading, error, id }: ArrestTagFeedbackProps) => {
  if (!id) {
    return (
      <div className="min-h-screen bg-secondary p-8">
        <Card className="max-w-3xl mx-auto p-8">
          <h1 className="text-2xl font-bold text-red-600">No arrest tag ID provided</h1>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary p-8">
        <Card className="max-w-3xl mx-auto p-8">
          <div>Loading arrest tag...</div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary p-8">
        <Card className="max-w-3xl mx-auto p-8">
          <h1 className="text-2xl font-bold text-red-600">
            Arrest tag not found for this incident report
          </h1>
          <p className="mt-2 text-gray-600">
            Please make sure the incident report has a suspect marked as in custody.
          </p>
        </Card>
      </div>
    );
  }

  return null;
};
