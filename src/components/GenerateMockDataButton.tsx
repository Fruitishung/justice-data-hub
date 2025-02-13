
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"

const GenerateMockDataButton = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generateMockData = async () => {
    setIsGenerating(true)
    try {
      const { data, error } = await supabase.functions.invoke('generate-mock-data', {
        body: {} // Empty body since our function doesn't require any parameters
      })

      if (error) {
        throw error
      }
      
      toast({
        title: "Mock Data Generated",
        description: `Created incident report with case number: ${data.data.case_number}`,
      })

    } catch (error) {
      console.error('Error generating mock data:', error)
      toast({
        title: "Error",
        description: "Failed to generate mock data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button 
      onClick={generateMockData}
      disabled={isGenerating}
      variant="outline"
      className="mt-4"
    >
      {isGenerating ? "Generating..." : "Generate Training Data"}
    </Button>
  )
}

export default GenerateMockDataButton
