
import { Progress } from "@/components/ui/progress";

interface ScanProgressProps {
  progress: number;
  error: string | null;
}

export const ScanProgress = ({ progress, error }: ScanProgressProps) => {
  return (
    <div className="space-y-2">
      <Progress value={progress} className="w-full" />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {progress > 0 && progress < 100 && (
        <p className="text-sm text-muted-foreground">
          Scanning in progress... {progress}%
        </p>
      )}
    </div>
  );
};
