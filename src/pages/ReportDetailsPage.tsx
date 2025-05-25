
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Printer, Camera, Wand2, BarChart3, TrendingUp } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import ReportForm from '@/components/police-report/ReportForm';
import { useReportData } from '@/hooks/useReportData';
import ReportLoadingSkeleton from '@/components/report/ReportLoadingSkeleton';
import ReportNotFound from '@/components/report/ReportNotFound';
import { FaceSheet } from '@/components/report-details/FaceSheet';
import { useToast } from '@/components/ui/use-toast';
import { PhotosSection } from '@/components/report-details/PhotosSection';
import { EvidenceSection } from '@/components/report-details/EvidenceSection';
import { supabase } from '@/integrations/supabase/client';

const ReportDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);

  React.useEffect(() => {
    if (!id) {
      navigate('/report/new');
    }
  }, [id, navigate]);

  const { data: report, isLoading, error } = useReportData(id);

  const validateReport = () => {
    if (!report) return false;

    const requiredFields = [
      { field: report.case_number, name: 'Case Number' },
      { field: report.incident_date, name: 'Incident Date' },
      { field: report.incident_description, name: 'Incident Description' },
      { field: report.officer_name, name: 'Officer Name' },
      { field: report.officer_badge_number, name: 'Badge Number' },
      { field: report.location_address, name: 'Location' }
    ];

    const missingFields = requiredFields.filter(({ field }) => !field);

    const hasPhotos = report.evidence_photos?.length > 0;

    if (missingFields.length > 0 || !hasPhotos) {
      toast({
        variant: "destructive",
        title: "Cannot print incomplete report",
        description: `Please complete the following: ${missingFields.map(f => f.name).join(', ')}${!hasPhotos ? ', Evidence Photos' : ''}`
      });
      return false;
    }

    return true;
  };

  const handlePrint = () => {
    if (validateReport()) {
      window.print();
    }
  };

  const generateCrimeScenePhoto = async (type: 'manual' | 'ai') => {
    if (!report?.id) {
      toast({
        title: "Error",
        description: "Cannot generate photo without a report ID",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-crime-scene', {
        body: { 
          incident_report_id: report.id,
          photo_type: type
        }
      });

      if (error) throw error;

      if (data?.image_url) {
        toast({
          title: "Success",
          description: `${type === 'ai' ? 'AI-generated' : 'Manual'} crime scene photo generated successfully`
        });
      }
    } catch (error) {
      console.error('Error generating photo:', error);
      toast({
        title: "Error",
        description: "Failed to generate photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <ReportLoadingSkeleton />;
  }

  if (!report && id && id !== 'new') {
    return <ReportNotFound />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {id === 'new' ? 'Create New Report' : `Edit Report - ${report?.case_number}`}
        </h1>
        <div className="flex gap-2 print:hidden">
          {report && (
            <>
              <Button
                onClick={() => navigate(`/report/${id}/timeline`)}
                variant="outline"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Timeline Analysis
              </Button>
              <Button
                onClick={() => navigate('/pattern-recognition')}
                variant="outline"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Pattern Recognition
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    disabled={isGenerating}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Add Crime Scene Photo
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => generateCrimeScenePhoto('manual')}>
                    <Camera className="mr-2 h-4 w-4" /> Manual Photo
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => generateCrimeScenePhoto('ai')}>
                    <Wand2 className="mr-2 h-4 w-4" /> AI-Generated Photo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={handlePrint}
                variant="outline"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Report
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="space-y-8">
        {report && (
          <>
            <FaceSheet report={report} />
            <EvidenceSection report={report} />
            <PhotosSection report={report} />
          </>
        )}
        <div className="print:hidden">
          <ReportForm data={report} />
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsPage;
