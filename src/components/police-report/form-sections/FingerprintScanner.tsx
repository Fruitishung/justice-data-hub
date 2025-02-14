
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"
import { Fingerprint } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { checkFeatureAccess } from "@/utils/security"
import { digitalPersonaScanner } from "@/utils/digitalPersonaScanner"

interface FingerprintScannerProps {
  form: UseFormReturn<ReportFormData>
}

const FingerprintScanner = ({ form }: FingerprintScannerProps) => {
  const [isScanning, setIsScanning] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const checkAccess = async () => {
      const hasFeatureAccess = await checkFeatureAccess('fingerprint_scanning')
      setHasAccess(hasFeatureAccess)
    }
    checkAccess()
  }, [])

  const handleScan = async () => {
    if (!hasAccess) {
      toast({
        title: "Access Denied",
        description: "You don't have access to the fingerprint scanning feature.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsScanning(true)
      const scanResult = await digitalPersonaScanner.capture()
      
      if (!scanResult.success) {
        throw new Error(scanResult.error || "Failed to capture fingerprint")
      }

      // Upload scan data to Supabase
      const { data: fingerprint, error: uploadError } = await supabase
        .from('fingerprint_scans')
        .insert({
          scan_data: scanResult.data,
          finger_position: 'right_index',
          incident_report_id: form.getValues('id')
        })
        .select()
        .single()

      if (uploadError) {
        throw uploadError
      }

      // Update form with fingerprint data
      const currentSuspectDetails = form.getValues('suspectDetails') || {}
      form.setValue('suspectDetails', {
        ...currentSuspectDetails,
        fingerprints: [...(currentSuspectDetails.fingerprints || []), fingerprint.id]
      })

      toast({
        title: "Success",
        description: "Fingerprint scan completed and uploaded successfully",
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

  if (!hasAccess) {
    return (
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <p className="text-yellow-800 text-sm">
          Fingerprint scanning requires additional permissions.
          Please contact your administrator to enable this feature.
        </p>
      </Card>
    )
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
