
export class FingerprintScannerDevice {
  private device: USBDevice | null = null;

  async requestDevice(): Promise<boolean> {
    try {
      // Request USB device with fingerprint scanner filters
      this.device = await navigator.usb.requestDevice({
        filters: [
          // Common fingerprint scanner vendors
          { vendorId: 0x1162 },  // SecuGen
          { vendorId: 0x05ba },  // Digital Persona
          { vendorId: 0x08ff },  // AuthenTec/Validity
        ]
      });
      
      await this.device.open();
      return true;
    } catch (error) {
      console.error('Error connecting to fingerprint scanner:', error);
      return false;
    }
  }

  async captureFingerprint(): Promise<{ data: ArrayBuffer; quality: number } | null> {
    if (!this.device) {
      throw new Error('No fingerprint scanner connected');
    }

    try {
      // Configure device
      await this.device.selectConfiguration(1);
      await this.device.claimInterface(0);

      // Send capture command (this will vary based on your specific scanner)
      const captureCommand = new Uint8Array([0x00, 0x01]); // Example command
      await this.device.transferOut(1, captureCommand);

      // Read response
      const result = await this.device.transferIn(1, 1024 * 64); // Adjust buffer size as needed
      
      if (result.data) {
        // Calculate image quality (simplified)
        const quality = this.calculateImageQuality(result.data);
        
        return {
          data: result.data.buffer,
          quality: quality
        };
      }

      return null;
    } catch (error) {
      console.error('Error capturing fingerprint:', error);
      throw error;
    }
  }

  private calculateImageQuality(data: DataView): number {
    // Simplified quality calculation
    // In a real implementation, this would analyze image contrast, ridge clarity, etc.
    return Math.random() * 100; // Placeholder
  }

  async disconnect(): Promise<void> {
    if (this.device) {
      await this.device.close();
      this.device = null;
    }
  }
}

export const scannerUtils = new FingerprintScannerDevice();
