
import { useState, useCallback } from 'react';
import { scannerUtils } from '@/utils/fingerprintScanner';
import { toast } from "@/components/ui/use-toast";

// Helper function to convert ArrayBuffer to base64 string
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export const useFingerprint = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentPrint, setCurrentPrint] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState<string>('');
  const [scanProgress, setScanProgress] = useState(0);

  const startScan = useCallback(async (position: string) => {
    setIsScanning(true);
    setCurrentPosition(position);
    setScanProgress(0);
    
    try {
      console.log(`Starting scan for position: ${position}`);
      
      // Connect to the scanner device
      const connected = await scannerUtils.connect();
      if (!connected) {
        console.error('Failed to connect to fingerprint scanner');
        throw new Error('Failed to connect to fingerprint scanner');
      }
      
      console.log('Scanner connected successfully');
      
      // Show progressive scanning feedback
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress; // Cap at 90% until actual completion
        });
      }, 200);
      
      // Capture the fingerprint data
      console.log('Capturing fingerprint...');
      const fingerprintData = await scannerUtils.captureFingerprint();
      console.log('Fingerprint captured:', fingerprintData);
      
      clearInterval(progressInterval);
      setScanProgress(100);
      
      // Convert the ArrayBuffer to base64 for display/storage
      const base64Data = arrayBufferToBase64(fingerprintData.data);
      const dataUrl = `data:image/png;base64,${base64Data}`;
      
      console.log(`Fingerprint converted to data URL (first 30 chars): ${dataUrl.substring(0, 30)}...`);
      
      // Set the current print to immediately show in the UI
      setCurrentPrint(dataUrl);
      
      toast({
        title: "Fingerprint Scanned",
        description: `Successfully captured ${position} fingerprint`,
      });
      
      // Return the scan result for further processing
      return {
        scanData: dataUrl,
        position,
        quality: fingerprintData.quality.toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: error.message || "Failed to capture fingerprint",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsScanning(false);
      
      // Disconnect from scanner
      try {
        await scannerUtils.disconnect();
        console.log('Scanner disconnected');
      } catch (disconnectError) {
        console.error('Error disconnecting:', disconnectError);
      }
    }
  }, []);

  return {
    isScanning,
    currentPrint,
    currentPosition,
    scanProgress,
    startScan,
  };
};
