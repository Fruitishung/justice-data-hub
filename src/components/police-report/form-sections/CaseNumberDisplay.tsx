
import { Badge } from "@/components/ui/badge"

interface CaseNumberDisplayProps {
  caseNumber?: string;
}

const CaseNumberDisplay = ({ caseNumber }: CaseNumberDisplayProps) => {
  return (
    <div className="mb-4">
      {caseNumber ? (
        <Badge variant="outline" className="text-lg p-2">
          Case #: {caseNumber}
        </Badge>
      ) : (
        <Badge variant="outline" className="text-lg p-2 text-muted-foreground">
          Case # will be assigned upon submission
        </Badge>
      )}
    </div>
  );
};

export default CaseNumberDisplay;
