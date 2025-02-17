
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type IncidentReport } from '@/types/reports';

interface FaceSheetProps {
  report: IncidentReport;
}

export const FaceSheet = ({ report }: FaceSheetProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Face Sheet</h2>
          <Separator className="my-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Case Information</h3>
            <div className="space-y-2">
              <p><strong>Case Number:</strong> {report.case_number}</p>
              <p><strong>Date:</strong> {new Date(report.incident_date || '').toLocaleDateString()}</p>
              <p><strong>Status:</strong> {report.report_status}</p>
              <p><strong>Priority:</strong> {report.report_priority}</p>
              <p><strong>Category:</strong> {report.report_category}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Location Details</h3>
            <div className="space-y-2">
              <p><strong>Address:</strong> {report.location_address}</p>
              <p><strong>Details:</strong> {report.location_details}</p>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <h3 className="text-lg font-semibold mb-2">Incident Description</h3>
          <p className="whitespace-pre-wrap">{report.incident_description}</p>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Officer Information</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {report.officer_name}</p>
              <p><strong>Rank:</strong> {report.officer_rank}</p>
              <p><strong>Badge Number:</strong> {report.officer_badge_number}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Emergency Response</h3>
            <div className="space-y-2">
              <p><strong>Response Type:</strong> {report.emergency_response}</p>
              <p><strong>Units Involved:</strong> {report.emergency_units}</p>
            </div>
          </div>
        </div>

        {report.suspect_details && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Suspect Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><strong>Name:</strong> {`${report.suspect_details.first_name || ''} ${report.suspect_details.last_name || ''}`}</p>
                  <p><strong>DOB:</strong> {report.suspect_details.dob}</p>
                  <p><strong>Gender:</strong> {report.suspect_details.gender}</p>
                  <p><strong>Height:</strong> {report.suspect_details.height}</p>
                  <p><strong>Weight:</strong> {report.suspect_details.weight}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Hair:</strong> {report.suspect_details.hair}</p>
                  <p><strong>Eyes:</strong> {report.suspect_details.eyes}</p>
                  <p><strong>Identifying Marks:</strong> {report.suspect_details.identifying_marks}</p>
                  <p><strong>In Custody:</strong> {report.suspect_details.in_custody ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
