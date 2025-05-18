
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileSearch } from "lucide-react";

interface Warrant {
  id: string;
  suspect_name: string;
  warrant_type: string;
  issue_date: string;
  status: string;
  case_number: string;
  correlation_score: number;
}

interface WarrantResultsProps {
  warrants: Warrant[];
  isLoading: boolean;
  searchTerm: string;
}

export const WarrantResults = ({ warrants, isLoading, searchTerm }: WarrantResultsProps) => {
  return (
    <Card className="bg-transparent border-slate-700">
      <CardHeader className="bg-slate-800 rounded-t-md border-b border-slate-700">
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <FileSearch className="h-5 w-5" />
          Warrant Search Results
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse text-cyan-400">Loading results...</div>
          </div>
        ) : warrants?.length ? (
          <div className="space-y-4">
            {warrants.map((warrant) => (
              <div
                key={warrant.id}
                className="p-4 border border-slate-700 rounded-lg shadow-sm hover:shadow-md hover:border-slate-600 transition-all bg-slate-800/40"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-lg font-semibold text-cyan-300">{warrant.suspect_name}</p>
                    <p className="text-sm text-slate-400">Case #{warrant.case_number}</p>
                  </div>
                  <Badge 
                    variant={warrant.status === 'Open' ? 'destructive' : 'secondary'}
                    className={warrant.status === 'Open' ? 'bg-red-600' : 'bg-slate-600'}
                  >
                    {warrant.warrant_type}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p><strong className="text-slate-300">Status:</strong> 
                      <span className={`ml-1 ${warrant.status === 'Open' ? 'text-red-400' : 'text-slate-400'}`}>
                        {warrant.status}
                      </span>
                    </p>
                    <p><strong className="text-slate-300">Issued:</strong> 
                      <span className="ml-1 text-slate-400">
                        {new Date(warrant.issue_date).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p><strong className="text-slate-300">Match Score:</strong> 
                      <span className={`ml-1 ${
                        warrant.correlation_score > 80 
                          ? 'text-green-400' 
                          : warrant.correlation_score > 50 
                            ? 'text-yellow-400' 
                            : 'text-slate-400'
                      }`}>
                        {warrant.correlation_score}%
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-10 text-slate-400">
            <p>No warrants found matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400">
            <p>Enter a search term to find warrants</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
