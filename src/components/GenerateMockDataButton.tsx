
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

const GenerateMockDataButton = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generateMockData = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch(
        'https://iqotjboqyqgborcdfsol.supabase.co/functions/v1/generate-mock-data',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to generate mock data')
      }

      const data = await response.json()
      
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
