
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database } from "lucide-react";

interface MCTETTSSearchInputProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export const MCTETTSSearchInput = ({ searchTerm, onSearchChange, onClear }: MCTETTSSearchInputProps) => {
  return (
    <div className="flex gap-4 mb-6 items-center">
      <Database className="h-5 w-5 text-cyan-400" />
      <Input
        placeholder="Enter search term..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 bg-slate-900 border-slate-700 text-white"
      />
      <Button 
        onClick={onClear} 
        variant="destructive"
        className="bg-red-600 hover:bg-red-700"
      >
        Clear
      </Button>
    </div>
  );
};
