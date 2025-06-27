import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  Fingerprint,
  Settings,
  HelpCircle
} from 'lucide-react';
import { scannerUtils } from '@/utils/fingerprintScanner';
import { toast } from '@/components/ui/use-toast';
import { ScannerSetupHelp } from './ScannerSetupHelp';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScannerStatusProps {
  onStatusChange?: (isConnected: boolean) => void;
  showDetails?: boolean;
}

export const ScannerStatus = ({ onStatusChange, showDetails = true }: ScannerStatusProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [scannerInfo, setScannerInfo] = useState<{
    name?: string;
    serialNumber?: string;
    driverVersion?: string;
  }>({});

  const checkConnection = async () => {
    setIsChecking(true);
    setErrorDetails(null);
    
    try {
      // Check if we're in mock mode
      const isMockMode = localStorage.getItem('fingerprintMockMode') === 'true';
      
      if (isMockMode) {
        setScannerInfo({
          name: 'Mock Scanner (Development Mode)',
          serialNumber: 'MOCK-001',
          driverVersion: '1.0.0-mock'
        });
        setIsConnected(true);
        toast({
          title: "Mock Mode Active",
          description: "Using simulated fingerprint scanner for development",
        });
      } else {
        // Check for real hardware
        const connected = await scannerUtils.connect();
        
        if (connected) {
          // Get scanner info if available
          const info = await scannerUtils.getScannerInfo?.() || {};
          setScannerInfo(info);
          setIsConnected(true);
          
          toast({
            title: "Scanner Connected",
            description: `Connected to ${info.name || 'Digital Persona Scanner'}`,
          });
        } else {
          throw new Error('Scanner not found or drivers not installed');
        }
      }
      
      setLastCheckTime(new Date());
      onStatusChange?.(true);
      
    } catch (error) {
      console.error('Scanner connection error:', error);
      setIsConnected(false);
      
      // Provide specific error messages
      let errorMessage = 'Unknown error occurred';
      
      if (error.message?.includes('SDK not loaded')) {
        errorMessage = 'Digital Persona SDK not installed. Please install scanner drivers.';
      } else if (error.message?.includes('Scanner not found')) {
        errorMessage = 'No scanner detected. Please connect a Digital Persona scanner.';
      } else if (error.message?.includes('drivers not installed')) {
        errorMessage = 'Scanner drivers not installed. Please install Digital Persona drivers.';
      } else if (error.message?.includes('Permission denied')) {
        errorMessage = 'Permission denied. Please run the application with appropriate permissions.';
      } else {
        errorMessage = error.message || 'Failed to connect to scanner';
      }
      
      setErrorDetails(errorMessage);
      onStatusChange?.(false);
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Auto-refresh connection status every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isChecking) {
        checkConnection();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isChecking]);

  const toggleMockMode = () => {
    const currentMode = localStorage.getItem('fingerprintMockMode') === 'true';
    localStorage.setItem('fingerprintMockMode', (!currentMode).toString());
    
    toast({
      title: currentMode ? "Mock Mode Disabled" : "Mock Mode Enabled",
      description: currentMode 
        ? "Will attempt to use real scanner hardware" 
        : "Using simulated scanner for development",
    });
    
    // Recheck connection with new mode
    checkConnection();
  };

  const getStatusIcon = () => {
    if (isChecking) {
      return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    }
    if (isConnected) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusText = () => {
    if (isChecking) return 'Checking connection...';
    if (isConnected) return 'Scanner Connected';
    return 'Scanner Disconnected';
  };

  const getStatusColor = () => {
    if (isChecking) return 'border-blue-500 bg-blue-50';
    if (isConnected) return 'border-green-500 bg-green-50';
    return 'border-red-500 bg-red-50';
  };

  return (
    <Card className={`p-4 ${getStatusColor()}`}>
      <div className="space-y-4">
        {/* Main Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Fingerprint className="h-6 w-6" />
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                Fingerprint Scanner Status
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Digital Persona U.are.U 4500 Scanner</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                {getStatusIcon()}
                {getStatusText()}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={checkConnection}
              disabled={isChecking}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isChecking ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleMockMode}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Mock Mode (Development)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <ScannerSetupHelp />
          </div>
        </div>

        {/* Scanner Details */}
        {showDetails && isConnected && scannerInfo.name && (
          <div className="border-t pt-3 space-y-1">
            <p className="text-sm">
              <span className="font-medium">Device:</span> {scannerInfo.name}
            </p>
            {scannerInfo.serialNumber && (
              <p className="text-sm">
                <span className="font-medium">Serial:</span> {scannerInfo.serialNumber}
              </p>
            )}
            {scannerInfo.driverVersion && (
              <p className="text-sm">
                <span className="font-medium">Driver:</span> v{scannerInfo.driverVersion}
              </p>
            )}
          </div>
        )}

        {/* Error Details */}
        {errorDetails && !isConnected && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription className="mt-2">
              {errorDetails}
            </AlertDescription>
          </Alert>
        )}

        {/* Last Check Time */}
        {lastCheckTime && (
          <p className="text-xs text-muted-foreground">
            Last checked: {lastCheckTime.toLocaleTimeString()}
          </p>
        )}

        {/* Mock Mode Indicator */}
        {localStorage.getItem('fingerprintMockMode') === 'true' && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Mock mode is active. Using simulated scanner for development.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
};