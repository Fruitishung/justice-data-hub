
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
  startCapture: async () => {
    // For development, return a mock fingerprint data
    const mockData = new Uint8Array(1024).fill(1);
    return mockData.buffer;
  },
  getImageQuality: async () => 85
};

export class DigitalPersonaScanner implements ScannerDevice {
  private currentDevice: DPDevice | null = null;
  private _isConnected: boolean = false;

  get isConnected(): boolean {
    return this._isConnected;
  }

  async connect(): Promise<boolean> {
    try {
      console.log('Attempting to connect to Digital Persona scanner...');
      
      // Initialize the SDK
      const initialized = await dpSdk.init();
      if (!initialized) {
        console.error('Failed to initialize Digital Persona SDK');
        return false;
      }
      
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
        this._isConnected = true;
        console.log(`Connected to ${this.currentDevice.name} (${this.currentDevice.serialNumber})`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error connecting to Digital Persona scanner:', error);
      this._isConnected = false;
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this._isConnected) {
      try {
        await dpSdk.closeDevice();
      } catch (error) {
        console.error('Error disconnecting from scanner:', error);
      } finally {
        this._isConnected = false;
        this.currentDevice = null;
      }
    }
  }

  async captureFingerprint(): Promise<FingerprintData | null> {
    if (!this._isConnected) {
      console.error('Digital Persona scanner not connected');
      throw new Error('Scanner not connected. Please connect the scanner first.');
    }

    try {
      console.log('Starting fingerprint capture...');
      
      // Capture the fingerprint image
      const imageData = await dpSdk.startCapture();
      
      // Get the image quality
      const quality = await dpSdk.getImageQuality();
      
      console.log('Fingerprint captured successfully');
      
      return {
        data: imageData,
        quality: quality
      };
    } catch (error) {
      console.error('Error capturing fingerprint:', error);
      throw new Error('Failed to capture fingerprint. Please try again.');
    }
  }
}
