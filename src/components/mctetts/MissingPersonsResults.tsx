
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface MissingPerson {
  id: string;
  name: string;
  last_seen_date: string;
  description: string;
  status: string;
  case_number: string;
  correlation_score: number;
}

interface MissingPersonsResultsProps {
  missingPersons: MissingPerson[];
  isLoading: boolean;
  searchTerm: string;
}

export const MissingPersonsResults = ({ missingPersons, isLoading, searchTerm }: MissingPersonsResultsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing Persons Search Results</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : missingPersons?.length ? (
          <div className="space-y-4">
            {missingPersons.map((person) => (
              <div
                key={person.id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-lg font-semibold">{person.name}</p>
                    <p className="text-sm text-muted-foreground">Case #{person.case_number}</p>
                  </div>
                  <span className="px-2 py-1 text-sm rounded-full bg-red-100 text-red-800">
                    {person.status}
                  </span>
                </div>
                <div className="mt-2">
                  <p><strong>Last Seen:</strong> {format(new Date(person.last_seen_date), 'PPpp')}</p>
                  <p><strong>Description:</strong> {person.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <p>No missing persons found</p>
        ) : (
          <p>Enter a search term to find missing persons</p>
        )}
      </CardContent>
    </Card>
  );
};
