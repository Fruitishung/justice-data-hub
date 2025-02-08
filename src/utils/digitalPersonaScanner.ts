
import { ScannerDevice, FingerprintData } from './fingerprintScanner';

// Digital Persona specific types
interface DPDevice {
  name: string;
  serialNumber: string;
  productId: string;
}

interface DPScannerSDK {
  init(): Promise<boolean>;
  enumerateDevices(): Promise<DPDevice[]>;
  openDevice(device: DPDevice): Promise<boolean>;
  closeDevice(): Promise<void>;
  startCapture(): Promise<ArrayBuffer>;
  getImageQuality(): Promise<number>;
}

// Mock SDK implementation (replace with actual Digital Persona SDK when available)
const dpSdk: DPScannerSDK = {
  init: async () => true,
  enumerateDevices: async () => [{
    name: 'U.are.U 4500',
    serialNumber: 'DP4500-001',
    productId: '4500'
  }],
  openDevice: async () => true,
  closeDevice: async () => {},
  startCapture: async () => new ArrayBuffer(1024),
  getImageQuality: async () => 85
};

export class DigitalPersonaScanner implements ScannerDevice {
  private currentDevice: DPDevice | null = null;
  public isConnected: boolean = false;

  async connect(): Promise<boolean> {
    try {
      // Initialize the SDK
      await dpSdk.init();
      
      // Find available devices
      const devices = await dpSdk.enumerateDevices();
      if (devices.length === 0) {
        console.error('No Digital Persona devices found');
        return false;
      }

      // Connect to the first available device
      this.currentDevice = devices[0];
      const connected = await dpSdk.openDevice(this.currentDevice);
      
      if (connected) {
        this.isConnected = true;
        console.log(`Connected to ${this.currentDevice.name} (${this.currentDevice.serialNumber})`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error connecting to Digital Persona scanner:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await dpSdk.closeDevice();
      this.isConnected = false;
      this.currentDevice = null;
    }
  }

  async captureFingerprint(): Promise<FingerprintData | null> {
    if (!this.isConnected) {
      throw new Error('Digital Persona scanner not connected');
    }

    try {
      // Capture the fingerprint image
      const imageData = await dpSdk.startCapture();
      
      // Get the image quality
      const quality = await dpSdk.getImageQuality();
      
      return {
        data: imageData,
        quality: quality
      };
    } catch (error) {
      console.error('Error capturing fingerprint:', error);
      throw error;
    }
  }
}

