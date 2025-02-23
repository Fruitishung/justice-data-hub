
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"
import { useToast } from "@/components/ui/use-toast"
import { Fingerprint } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { scannerUtils } from "@/utils/fingerprintScanner"
import { useParams } from "react-router-dom"

interface FingerprintScannerProps {
  form: UseFormReturn<ReportFormData>
}

const FingerprintScanner = ({ form }: FingerprintScannerProps) => {
  const [isScanning, setIsScanning] = useState(false)
  const { toast } = useToast()
  const { id } = useParams()

  const handleScan = async () => {
    try {
      setIsScanning(true)
      
      // Capture fingerprint
      const scanResult = await scannerUtils.captureFingerprint()
      if (!scanResult) {
        throw new Error("Failed to capture fingerprint")
      }

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
      <Button
        type="button"
        onClick={handleScan}
        disabled={isScanning}
        className="w-full"
      >
        <Fingerprint className="mr-2 h-4 w-4" />
        {isScanning ? "Scanning..." : "Start Scan"}
      </Button>
    </div>
  )
}

export default FingerprintScanner
