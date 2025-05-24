
import { BadgeAlert, FileSearch } from "lucide-react";

export const MCTETTSHeader = () => {
  return (
    <>
      {/* Classified banner */}
      <div className="bg-red-600 text-white py-1 px-4 text-center font-bold tracking-wider mb-6 animate-pulse rounded">
        RESTRICTED ACCESS - LAW ENFORCEMENT USE ONLY
      </div>

      <div className="flex items-center justify-center mb-8">
        <BadgeAlert className="h-8 w-8 mr-3 text-yellow-400" />
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          MCTETTS SECURE DATABASE
        </h1>
        <FileSearch className="h-8 w-8 ml-3 text-yellow-400" />
      </div>
    </>
  );
};
