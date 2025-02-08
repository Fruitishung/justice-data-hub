
// Types for fingerprint scanner interactions
export interface ScannerDevice {
  isConnected: boolean;
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  captureFingerprint(): Promise<FingerprintData | null>;
}

export interface FingerprintData {
  data: ArrayBuffer;
  quality: number;
}

// Export the Digital Persona scanner as the default scanner
import { DigitalPersonaScanner } from './digitalPersonaScanner';
export const scannerUtils = new DigitalPersonaScanner();

