
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
  biometrics?: BiometricData;
  imageUrl?: string; // Added for direct image URL access
}

export interface BiometricData {
  patternType: string;
  ridgeCount: number;
  whorlPattern?: string;
  handDominance?: string;
}

// Export the Digital Persona scanner as the default scanner
import { DigitalPersonaScanner } from './digitalPersonaScanner';
export const scannerUtils = new DigitalPersonaScanner();
