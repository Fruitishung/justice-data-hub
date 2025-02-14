
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../types";
import { useFingerprint } from "./fingerprint/useFingerprint";
import ScannerConnect from "./fingerprint/ScannerConnect";
import MatchResults from "./fingerprint/MatchResults";
import FingerCard from "./fingerprint/FingerCard";

interface FingerprintScannerProps {
  form: UseFormReturn<ReportFormData>;
}

const FingerprintScanner = ({ form }: FingerprintScannerProps) => {
  const {
    scanning,
    currentFinger,
    analyzing,
    matches,
    isConnected,
    connectScanner,
    scanFinger,
    removeScan,
    getScannedData
  } = useFingerprint(form);
  
  const fingerPositions = [
    'Right Thumb',
    'Right Index',
    'Right Middle',
    'Right Ring',
    'Right Little',
    'Left Thumb',
    'Left Index',
    'Left Middle',
    'Left Ring',
    'Left Little'
  ];

  React.useEffect(() => {
    return () => {
      scannerUtils.disconnect();
    };
  }, []);

  return (
    <div className="space-y-4">
      <ScannerConnect 
        isConnected={isConnected}
        onConnect={connectScanner}
      />
      
      <MatchResults matches={matches} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {fingerPositions.map((position) => (
          <FingerCard
            key={position}
            position={position}
            scanData={getScannedData(position)}
            onScan={scanFinger}
            onRemove={removeScan}
            scanning={scanning}
            analyzing={analyzing}
            isCurrentFinger={currentFinger === position}
            isConnected={isConnected}
          />
        ))}
      </div>
    </div>
  );
};

export default FingerprintScanner;
