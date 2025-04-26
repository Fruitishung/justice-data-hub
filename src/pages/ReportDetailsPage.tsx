
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import ReportForm from '@/components/police-report/ReportForm';
import { useReportData } from '@/hooks/useReportData';
import ReportLoadingSkeleton from '@/components/report/ReportLoadingSkeleton';
import ReportNotFound from '@/components/report/ReportNotFound';
import { FaceSheet } from '@/components/report-details/FaceSheet';
import { useToast } from '@/components/ui/use-toast';
import { PhotosSection } from '@/components/report-details/PhotosSection';
import { EvidenceSection } from '@/components/report-details/EvidenceSection';

const ReportDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!id) {
      navigate('/report/new');
    }
  }, [id, navigate]);

  const { data: report, isLoading, error } = useReportData(id);

  const validateReport = () => {
    if (!report) return false;

    // Required fields to check
    const requiredFields = [
      { field: report.case_number, name: 'Case Number' },
      { field: report.incident_date, name: 'Incident Date' },
      { field: report.incident_description, name: 'Incident Description' },
      { field: report.officer_name, name: 'Officer Name' },
      { field: report.officer_badge_number, name: 'Badge Number' },
      { field: report.location_address, name: 'Location' }
    ];

    // Check required fields
    const missingFields = requiredFields.filter(({ field }) => !field);

    // Check photos
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

  // If we're still loading, show an improved loading state
  if (isLoading) {
    return <ReportLoadingSkeleton />;
  }

  // If no report and not a new report, show error
  if (!report && id && id !== 'new') {
    return <ReportNotFound />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {id === 'new' ? 'Create New Report' : `Edit Report - ${report?.case_number}`}
        </h1>
        {report && (
          <Button
            onClick={handlePrint}
            className="print:hidden"
            variant="outline"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
        )}
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
