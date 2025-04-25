
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
  startCapture(): Promise<{ buffer: ArrayBuffer, imageUrl: string }>;
  getImageQuality(): Promise<number>;
}

// Mock fingerprint images
const FINGERPRINT_IMAGES = [
  "data:image/png;base64,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",
  "data:image/png;base64,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"
];

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
    // For development, simulate a real scan with a delay
    // This helps visualize the scanning progress in the UI
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate random data for the buffer
        const mockData = new Uint8Array(1024).fill(1);
        
        // Choose a random fingerprint image from our library
        const imageUrl = FINGERPRINT_IMAGES[Math.floor(Math.random() * FINGERPRINT_IMAGES.length)];
        
        resolve({
          buffer: mockData.buffer,
          imageUrl: imageUrl
        });
      }, 3000); // 3 second delay to simulate scanning
    });
  },
  getImageQuality: async () => 85 // Random quality between 80-95
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
      const captureResult = await dpSdk.startCapture();
      
      // Get the image quality
      const quality = await dpSdk.getImageQuality();
      
      console.log('Fingerprint captured successfully');
      
      return {
        data: captureResult.buffer,
        quality: quality,
        imageUrl: captureResult.imageUrl // Store the image URL
      };
    } catch (error) {
      console.error('Error capturing fingerprint:', error);
      throw new Error('Failed to capture fingerprint. Please try again.');
    }
  }
}
