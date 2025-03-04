
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"
import { useToast } from "@/components/ui/use-toast"
import { Fingerprint } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { scannerUtils } from "@/utils/fingerprintScanner"
import { useParams } from "react-router-dom"
import { Progress } from "@/components/ui/progress"

interface FingerprintScannerProps {
  form: UseFormReturn<ReportFormData>
}

const FingerprintScanner = ({ form }: FingerprintScannerProps) => {
  const [isScanning, setIsScanning] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const { toast } = useToast()
  const { id } = useParams()

  useEffect(() => {
    const connectScanner = async () => {
      try {
        const connected = await scannerUtils.connect()
        setIsConnected(connected)
        
        if (connected) {
          toast({
            title: "Scanner Connected",
            description: "Digital Persona scanner is ready to use",
          })
        } else {
          toast({
            title: "Scanner Not Connected",
            description: "Please check if the scanner is properly connected",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Scanner connection error:', error)
        toast({
          title: "Connection Error",
          description: "Failed to connect to the scanner. Please try again.",
          variant: "destructive",
        })
      }
    }

    connectScanner()

    // Cleanup on unmount
    return () => {
      scannerUtils.disconnect()
    }
  }, [toast])

  // Effect to simulate scan progress
  useEffect(() => {
    let interval: number | undefined;
    
    if (isScanning && scanProgress < 100) {
      interval = window.setInterval(() => {
        setScanProgress((prev) => {
          // Random increments to simulate real scanning
          const increment = Math.floor(Math.random() * 15) + 5;
          return Math.min(prev + increment, 100);
        });
      }, 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning, scanProgress]);

  const handleScan = async () => {
    if (!isConnected) {
      toast({
        title: "Scanner Not Connected",
        description: "Please ensure the scanner is connected before scanning",
        variant: "destructive",
      })
      return
    }

    try {
      setIsScanning(true)
      setScanProgress(0)
      
      // Capture fingerprint
      const scanResult = await scannerUtils.captureFingerprint()
      if (!scanResult) {
        throw new Error("Failed to capture fingerprint")
      }

      // Set progress to complete
      setScanProgress(100)

      // Convert ArrayBuffer to base64
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(scanResult.data))
      )

      if (id && id !== 'new') {
        // If we have a valid report ID, save directly to the database
        const { error: scanError } = await supabase
          .from('fingerprint_scans')
          .insert({
            finger_position: 'right_index',
            scan_data: base64String,
            scan_quality: scanResult.quality,
            incident_report_id: id,
            scan_date: new Date().toISOString()
          })

        if (scanError) {
          throw scanError
        }
      }

      // Update form state regardless of whether we're creating or editing
      const currentFingerprints = form.getValues("suspectFingerprints") || []
      form.setValue("suspectFingerprints", [
        ...currentFingerprints,
        {
          position: 'right_index',
          scanData: base64String,
          quality: scanResult.quality,
          timestamp: new Date().toISOString()
        }
      ])

      toast({
        title: "Success",
        description: "Fingerprint scan completed successfully",
      })

    } catch (error) {
      console.error('Fingerprint scan error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to scan fingerprint",
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Fingerprint Scanner</h3>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Scanner Connected' : 'Scanner Not Connected'}
          </span>
        </div>
        
        {isScanning && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Scanning in progress...</span>
              <span className="text-sm font-medium">{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
          </div>
        )}
        
        <Button
          type="button"
          onClick={handleScan}
          disabled={isScanning || !isConnected}
          className="w-full"
        >
          <Fingerprint className={`mr-2 h-4 w-4 ${isScanning ? 'animate-pulse' : ''}`} />
          {isScanning ? "Scanning..." : "Start Scan"}
        </Button>
      </div>
    </div>
  )
}

export default FingerprintScanner
