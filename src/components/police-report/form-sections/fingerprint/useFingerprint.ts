
import { useState, useCallback } from 'react';
import { connectScanner, captureFingerprint } from '@/utils/fingerprintScanner';

export const useFingerprint = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentPrint, setCurrentPrint] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState<string>('');

  const startScan = useCallback(async (position: string) => {
    setIsScanning(true);
    setCurrentPosition(position);
    
    try {
      const scanner = await connectScanner();
      const printData = await captureFingerprint(scanner);
      
      // Immediately set the print data when received
      setCurrentPrint(printData);
      
      return {
        scanData: printData,
        position,
        quality: 'good',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Scan error:', error);
      throw error;
    } finally {
      setIsScanning(false);
    }
  }, []);

  return {
    isScanning,
    currentPrint,
    currentPosition,
    startScan,
  };
};
