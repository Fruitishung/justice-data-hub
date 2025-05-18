
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const SecurityWarning = () => {
  return (
    <Alert variant="destructive" className="bg-red-700 border-red-600 text-white mb-6">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="text-white font-bold">SECURITY WARNING - CONFIDENTIAL</AlertTitle>
      <AlertDescription className="text-white/90">
        You are accessing a classified law enforcement database. Unauthorized use or sharing of this 
        information without proper clearance is a violation of your Peace Officer's Oath of Office 
        and may result in criminal prosecution and disciplinary action.
      </AlertDescription>
    </Alert>
  );
};
