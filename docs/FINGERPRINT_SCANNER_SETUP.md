# Fingerprint Scanner Setup Guide

This guide will help you set up and troubleshoot the Digital Persona U.are.U 4500 fingerprint scanner for use with the Justice Data Hub application.

## Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Mock Mode](#mock-mode)

## Requirements

### Hardware
- Digital Persona U.are.U 4500 Fingerprint Scanner
- USB 2.0 or higher port
- Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)

### Software
- Digital Persona SDK and Drivers (version 4.5.0 or higher)
- Chrome/Edge/Firefox browser (latest version)
- Administrator privileges for driver installation

## Installation

### Windows

1. **Download Drivers**
   - Visit [Digital Persona Support](https://www.crossmatch.com/support/)
   - Download the U.are.U SDK for Windows
   - Current version: 4.5.0.150

2. **Install Drivers**
   ```powershell
   # Run as Administrator
   .\DigitalPersona_Setup.exe
   ```

3. **Verify Installation**
   - Open Device Manager
   - Look for "Digital Persona U.are.U 4500" under "Biometric devices"
   - Status should show "This device is working properly"

### macOS

1. **Download Drivers**
   - Download the macOS driver package from Digital Persona
   - File: `UareU_SDK_Mac_4.5.0.dmg`

2. **Install Drivers**
   ```bash
   # Mount the DMG
   hdiutil attach UareU_SDK_Mac_4.5.0.dmg
   
   # Run the installer
   sudo installer -pkg /Volumes/UareU/UareU.pkg -target /
   ```

3. **Grant Permissions**
   - System Preferences → Security & Privacy → Privacy
   - Add browser to "Camera" and "USB" permissions

### Linux (Ubuntu/Debian)

1. **Install Dependencies**
   ```bash
   sudo apt-get update
   sudo apt-get install libusb-1.0-0 libusb-1.0-0-dev
   ```

2. **Download and Extract SDK**
   ```bash
   wget https://example.com/uareu-sdk-linux.tar.gz
   tar -xzvf uareu-sdk-linux.tar.gz
   cd uareu-sdk-linux
   ```

3. **Install**
   ```bash
   sudo ./install.sh
   sudo ldconfig
   ```

4. **Set USB Permissions**
   ```bash
   # Create udev rule
   echo 'SUBSYSTEM=="usb", ATTRS{idVendor}=="05ba", ATTRS{idProduct}=="0007", MODE="0666"' | \
   sudo tee /etc/udev/rules.d/99-digitalpersona.rules
   
   # Reload rules
   sudo udevadm control --reload-rules
   sudo udevadm trigger
   ```

## Configuration

### Browser Setup

1. **Enable WebUSB** (if required)
   - Chrome: `chrome://flags/#enable-webusb`
   - Set to "Enabled"
   - Restart browser

2. **Allow USB Access**
   - When prompted, click "Allow" to grant USB access
   - Select "Digital Persona U.are.U 4500" from the device list

### Application Settings

1. **Check Scanner Status**
   - Navigate to any fingerprint scanning page
   - Look for the "Scanner Status" card
   - Status should show "Scanner Connected" in green

2. **Configure Quality Threshold**
   - Default minimum quality: 60%
   - Can be adjusted in scanner settings if needed

## Testing

### Quick Test

1. **Open Application**
   - Navigate to a page with fingerprint scanning
   - Check scanner status indicator

2. **Test Scan**
   - Click "Scan Right Index" or "Scan Left Index"
   - Place finger on scanner
   - Hold steady for 2-3 seconds
   - Check quality score (should be >60%)

### Diagnostic Test

1. **Enable Developer Console**
   - Press F12 in browser
   - Go to Console tab

2. **Run Diagnostic**
   ```javascript
   // Check if SDK is loaded
   console.log('SDK Loaded:', !!window.DigitalPersona);
   
   // Check scanner connection
   const scanner = new DigitalPersonaScanner();
   scanner.checkHardware().then(console.log);
   ```

## Troubleshooting

### Common Issues

#### Scanner Not Detected

**Symptoms:**
- Status shows "Scanner Disconnected"
- Error: "No Digital Persona scanner found"

**Solutions:**
1. Check USB connection
2. Try different USB port
3. Restart scanner service:
   ```bash
   # Windows
   net stop "DigitalPersona Service"
   net start "DigitalPersona Service"
   
   # macOS/Linux
   sudo systemctl restart digitalpersona
   ```

#### SDK Not Loaded

**Symptoms:**
- Error: "Digital Persona SDK not loaded"
- Scanner status shows error

**Solutions:**
1. Reinstall drivers
2. Clear browser cache
3. Check browser console for errors
4. Verify SDK files are accessible

#### Poor Scan Quality

**Symptoms:**
- Quality scores below 60%
- Blurry or partial fingerprint images

**Solutions:**
1. Clean scanner surface with microfiber cloth
2. Ensure finger is clean and dry
3. Place finger flat on scanner
4. Apply moderate pressure
5. Keep finger still during scan

#### Permission Denied

**Symptoms:**
- Error: "Permission denied accessing scanner"
- USB access blocked

**Solutions:**
1. Run browser as administrator (Windows)
2. Grant USB permissions in browser
3. Check system security settings
4. Add browser to antivirus exceptions

### Advanced Troubleshooting

#### Enable Debug Logging

```javascript
// In browser console
localStorage.setItem('fingerprintDebugMode', 'true');
```

#### Check USB Device Info

```bash
# Linux/macOS
lsusb | grep "05ba:0007"

# Windows PowerShell
Get-PnpDevice -Class "Biometric" | Select-Object Status,FriendlyName
```

#### Manual Driver Reset

1. Uninstall current drivers
2. Reboot system
3. Install fresh drivers
4. Test with Digital Persona demo app first

## Mock Mode

For development and testing without hardware:

### Enable Mock Mode

1. **Via UI:**
   - Click settings icon in Scanner Status
   - Toggle "Mock Mode"

2. **Via Console:**
   ```javascript
   localStorage.setItem('fingerprintMockMode', 'true');
   location.reload();
   ```

### Mock Mode Features

- Simulates scanner connection
- Generates sample fingerprint images
- 3-second scan simulation
- Random quality scores (80-95%)

### Disable Mock Mode

```javascript
localStorage.removeItem('fingerprintMockMode');
location.reload();
```

## Support

### Contact Information

- **Digital Persona Support:** support@digitalpersona.com
- **Driver Downloads:** https://www.crossmatch.com/support/
- **Application Support:** Contact your IT administrator

### Useful Resources

- [Digital Persona SDK Documentation](https://developer.digitalpersona.com)
- [USB Troubleshooting Guide](https://support.digitalpersona.com/usb-guide)
- [Integration Best Practices](https://developer.digitalpersona.com/best-practices)

### Known Issues

1. **macOS Big Sur+**: May require additional privacy permissions
2. **Chrome 90+**: WebUSB flag must be explicitly enabled
3. **Windows 11**: Requires updated drivers (4.5.0.150+)
4. **Linux**: Some distributions require manual USB permission setup

---

Last Updated: 2024
Version: 1.0