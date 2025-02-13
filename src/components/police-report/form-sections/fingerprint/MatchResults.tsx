
import { UserCheck } from "lucide-react";

interface BiometricMatch {
  id: string;
  name: string;
  similarity: number;
  matchedFingerPosition: string;
  patternType?: string;
  ridgeCount?: number;
  whorlPattern?: string;
  handDominance?: string;
}

interface MatchResultsProps {
  matches: BiometricMatch[];
}

const MatchResults = ({ matches }: MatchResultsProps) => {
  if (matches.length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <UserCheck className="text-yellow-600" />
        Potential Matches Found
      </h3>
      <div className="space-y-2">
        {matches.map((match) => (
          <div key={match.id} className="flex flex-col bg-white p-3 rounded">
            <div className="flex items-center justify-between">
              <span className="font-medium">{match.name}</span>
              <span className="text-sm text-muted-foreground">
                ({(match.similarity * 100).toFixed(1)}% match on {match.matchedFingerPosition})
              </span>
            </div>
            {(match.patternType || match.handDominance) && (
              <div className="mt-1 text-sm text-muted-foreground">
                {match.patternType && (
                  <span className="mr-3">Pattern: {match.patternType}</span>
                )}
                {match.handDominance && (
                  <span>Dominant Hand: {match.handDominance}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchResults;
