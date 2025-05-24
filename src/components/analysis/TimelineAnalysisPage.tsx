
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TimelineEvent } from '@/types/timeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useReportData } from '@/hooks/useReportData';
import TimelineVisualization from '@/components/timeline/TimelineVisualization';
import TimelineBuilder from '@/components/timeline/TimelineBuilder';
import { Save, Download, BarChart3 } from 'lucide-react';

const TimelineAnalysisPage = () => {
  const { id } = useParams();
  const { data: report, isLoading } = useReportData(id);
  const { toast } = useToast();
  
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [analysisNotes, setAnalysisNotes] = useState('');
  const [keyInsights, setKeyInsights] = useState<string[]>([]);

  // Initialize with basic timeline events from the report
  useEffect(() => {
    if (report && timelineEvents.length === 0) {
      const initialEvents: TimelineEvent[] = [
        {
          id: crypto.randomUUID(),
          incident_report_id: report.id,
          event_type: 'incident',
          timestamp: report.incident_date,
          title: 'Initial Incident Reported',
          description: report.incident_description || 'Primary incident occurred',
          location: report.location_address || undefined,
          created_by: report.officer_name || 'System',
          created_at: report.created_at
        }
      ];

      // Add arrest event if suspect is in custody
      if (report.suspect_details?.in_custody) {
        initialEvents.push({
          id: crypto.randomUUID(),
          incident_report_id: report.id,
          event_type: 'arrest',
          timestamp: report.created_at, // Assuming arrest happened when report was created
          title: 'Suspect Arrested',
          description: `${report.suspect_details.first_name} ${report.suspect_details.last_name} taken into custody`,
          location: report.location_address || undefined,
          created_by: report.officer_name || 'System',
          created_at: report.created_at
        });
      }

      setTimelineEvents(initialEvents);
    }
  }, [report, timelineEvents.length]);

  const handleSaveAnalysis = () => {
    // In a real app, this would save to the database
    console.log('Saving timeline analysis:', {
      incident_report_id: id,
      timeline_events: timelineEvents,
      analysis_notes: analysisNotes,
      key_insights: keyInsights
    });

    toast({
      title: "Analysis Saved",
      description: "Your timeline analysis has been saved successfully."
    });
  };

  const handleExportTimeline = () => {
    const exportData = {
      report_id: id,
      case_number: report?.case_number,
      timeline_events: timelineEvents,
      analysis_notes: analysisNotes,
      key_insights: keyInsights,
      exported_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeline-analysis-${report?.case_number || id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Timeline Exported",
      description: "Timeline analysis has been downloaded as JSON."
    });
  };

  if (isLoading) {
    return <div>Loading timeline analysis...</div>;
  }

  if (!report) {
    return <div>Report not found</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Case Timeline Analysis</h1>
          <p className="text-muted-foreground">
            Case: {report.case_number} • {report.incident_description}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleExportTimeline} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSaveAnalysis}>
            <Save className="h-4 w-4 mr-2" />
            Save Analysis
          </Button>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="builder">Build Timeline</TabsTrigger>
          <TabsTrigger value="analysis">Analysis & Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Case Timeline Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TimelineVisualization events={timelineEvents} showAnalysis={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-4">
          <TimelineBuilder
            incidentReportId={report.id}
            events={timelineEvents}
            onEventsUpdate={setTimelineEvents}
          />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Record your observations about the timeline, patterns you notice, and investigative insights..."
                  rows={10}
                  value={analysisNotes}
                  onChange={(e) => setAnalysisNotes(e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{timelineEvents.length}</div>
                      <div className="text-sm text-muted-foreground">Total Events</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">
                        {Math.round(
                          (new Date(timelineEvents[timelineEvents.length - 1]?.timestamp || 0).getTime() - 
                           new Date(timelineEvents[0]?.timestamp || 0).getTime()) / (1000 * 60 * 60)
                        )}h
                      </div>
                      <div className="text-sm text-muted-foreground">Timeline Span</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Investigative Questions</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• What patterns emerge from the timeline sequence?</li>
                      <li>• Are there gaps that need additional investigation?</li>
                      <li>• How do witness statements align with the timeline?</li>
                      <li>• What evidence supports or contradicts the sequence of events?</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimelineAnalysisPage;
