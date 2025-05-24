
import { AlertTriangle } from "lucide-react";

export const MCTETTSFooter = () => {
  return (
    <>
      <div className="mt-6 text-xs text-slate-500 border-t border-slate-700 pt-4">
        <div className="flex justify-between items-center">
          <p>Terminal ID: MCT-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
          <p>Classification Level: CONFIDENTIAL</p>
          <p>Session: {new Date().toISOString()}</p>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-2 text-yellow-400">
        <AlertTriangle className="h-4 w-4" />
        <p className="text-sm">All searches are logged and audited</p>
      </div>
    </>
  );
};
