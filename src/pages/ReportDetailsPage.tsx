
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReportForm from '@/components/police-report/ReportForm';
import { useReportData } from '@/hooks/useReportData';
import ReportLoadingSkeleton from '@/components/report/ReportLoadingSkeleton';
import ReportNotFound from '@/components/report/ReportNotFound';

const ReportDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!id) {
      navigate('/report/new');
    }
  }, [id, navigate]);

  const { report, isLoading, error } = useReportData(id);

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
      <h1 className="text-3xl font-bold mb-6">
        {id === 'new' ? 'Create New Report' : `Edit Report - ${report?.case_number}`}
      </h1>
      <ReportForm data={report} />
    </div>
  );
};

export default ReportDetailsPage;
