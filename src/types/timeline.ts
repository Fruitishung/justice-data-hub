
export interface TimelineEvent {
  id: string;
  incident_report_id: string;
  event_type: 'incident' | 'evidence' | 'witness' | 'arrest' | 'investigation' | 'other';
  timestamp: string;
  title: string;
  description: string;
  location?: string;
  evidence_ids?: string[];
  created_by: string;
  created_at: string;
}

export interface TimelineAnalysis {
  id: string;
  incident_report_id: string;
  timeline_events: TimelineEvent[];
  analysis_notes: string;
  key_insights: string[];
  created_at: string;
  updated_at: string;
}
