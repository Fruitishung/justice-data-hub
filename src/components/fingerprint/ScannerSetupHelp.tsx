import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  HelpCircle, 
  Download, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const ScannerSetupHelp = () => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle className="h-4 w-4 mr-1" />
          Setup Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Fingerprint Scanner Setup Guide</DialogTitle>
          <DialogDescription>
            Complete guide for setting up the Digital Persona U.are.U 4500 scanner
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="quickstart" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="installation">Installation</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[400px] mt-4">
            <TabsContent value="quickstart" className="space-y-4 pr-4">
              <h3 className="font-semibold text-lg">Quick Start Guide</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">1. Connect Scanner</p>
                    <p className="text-sm text-muted-foreground">
                      Plug the U.are.U 4500 scanner into a USB port
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">2. Install Drivers</p>
                    <p className="text-sm text-muted-foreground">
                      Download and install Digital Persona drivers for your OS
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">3. Grant Permissions</p>
                    <p className="text-sm text-muted-foreground">
                      Allow browser access to USB devices when prompted
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">4. Test Scanner</p>
                    <p className="text-sm text-muted-foreground">
                      Click "Scan" and place finger on scanner
                    </p>
                  </div>
                </div>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>No Scanner?</strong> Enable Mock Mode in settings to use simulated fingerprints for testing.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="installation" className="space-y-4 pr-4">
              <h3 className="font-semibold text-lg">Driver Installation</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Windows
                  </h4>
                  <div className="bg-muted p-3 rounded-md space-y-2">
                    <p className="text-sm">1. Download drivers from:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-background px-2 py-1 rounded">
                        https://crossmatch.com/support/
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open('https://crossmatch.com/support/', '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm">2. Run installer as Administrator</p>
                    <p className="text-sm">3. Restart if prompted</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    macOS
                  </h4>
                  <div className="bg-muted p-3 rounded-md space-y-2">
                    <p className="text-sm">Install command:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-background px-2 py-1 rounded flex-1">
                        sudo installer -pkg UareU.pkg -target /
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('sudo installer -pkg UareU.pkg -target /', 'Command')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm">Grant USB permissions in System Preferences</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Linux
                  </h4>
                  <div className="bg-muted p-3 rounded-md space-y-2">
                    <p className="text-sm">Install dependencies:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-background px-2 py-1 rounded flex-1">
                        sudo apt-get install libusb-1.0-0
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('sudo apt-get install libusb-1.0-0', 'Command')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm">Set USB permissions for device 05ba:0007</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="troubleshooting" className="space-y-4 pr-4">
              <h3 className="font-semibold text-lg">Common Issues</h3>
              
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Scanner Not Detected</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Check USB cable connection</li>
                      <li>Try a different USB port</li>
                      <li>Reinstall drivers</li>
                      <li>Check Device Manager (Windows)</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Poor Scan Quality</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Clean scanner surface</li>
                      <li>Ensure finger is clean and dry</li>
                      <li>Press firmly but don't move</li>
                      <li>Center finger on scanner</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Permission Denied</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Grant USB permissions in browser</li>
                      <li>Run as Administrator (Windows)</li>
                      <li>Check antivirus settings</li>
                      <li>Enable WebUSB in browser flags</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
            
            <TabsContent value="testing" className="space-y-4 pr-4">
              <h3 className="font-semibold text-lg">Testing & Diagnostics</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Browser Console Test</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Open Developer Tools (F12) and run:
                  </p>
                  <div className="bg-muted p-3 rounded-md space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-background px-2 py-1 rounded flex-1">
                        console.log('SDK:', !!window.DigitalPersona)
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard("console.log('SDK:', !!window.DigitalPersona)", 'Test code')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">USB Device Check</h4>
                  <div className="bg-muted p-3 rounded-md space-y-2">
                    <p className="text-sm">Linux/macOS:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-background px-2 py-1 rounded flex-1">
                        lsusb | grep "05ba:0007"
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('lsusb | grep "05ba:0007"', 'Command')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Enable Debug Mode</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-background px-2 py-1 rounded flex-1">
                        localStorage.setItem('fingerprintDebugMode', 'true')
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          localStorage.setItem('fingerprintDebugMode', 'true');
                          toast({
                            title: "Debug Mode Enabled",
                            description: "Check console for detailed logs",
                          });
                        }}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="mt-4 flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/docs/FINGERPRINT_SCANNER_SETUP.md', '_blank')}
          >
            <Download className="h-4 w-4 mr-1" />
            Full Documentation
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Digital Persona U.are.U 4500 • v4.5.0+
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};