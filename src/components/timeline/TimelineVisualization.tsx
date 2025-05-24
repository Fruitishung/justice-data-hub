
import React from 'react';
import { TimelineEvent } from '@/types/timeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, FileText, Users, UserX, Search } from 'lucide-react';
import { format } from 'date-fns';

interface TimelineVisualizationProps {
  events: TimelineEvent[];
  showAnalysis?: boolean;
}

const TimelineVisualization = ({ events, showAnalysis = false }: TimelineVisualizationProps) => {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const getEventIcon = (type: TimelineEvent['event_type']) => {
    switch (type) {
      case 'incident': return <FileText className="h-4 w-4" />;
      case 'evidence': return <Search className="h-4 w-4" />;
      case 'witness': return <Users className="h-4 w-4" />;
      case 'arrest': return <UserX className="h-4 w-4" />;
      case 'investigation': return <Search className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: TimelineEvent['event_type']) => {
    switch (type) {
      case 'incident': return 'bg-red-500';
      case 'evidence': return 'bg-blue-500';
      case 'witness': return 'bg-green-500';
      case 'arrest': return 'bg-purple-500';
      case 'investigation': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No timeline events to display. Add events to begin your analysis.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
        
        {sortedEvents.map((event, index) => (
          <div key={event.id} className="relative flex items-start space-x-4 pb-6">
            {/* Timeline dot */}
            <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ${getEventColor(event.event_type)} text-white`}>
              {getEventIcon(event.event_type)}
            </div>
            
            {/* Event content */}
            <div className="flex-1 min-w-0">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {event.event_type.replace('_', ' ')}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {event.description}
                  </p>
                  {event.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {event.location}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
      
      {showAnalysis && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Timeline Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Event Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(
                    events.reduce((acc, event) => {
                      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([type, count]) => (
                    <div key={type} className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {type.replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Timeline Span</h4>
                <p className="text-sm text-muted-foreground">
                  From {format(new Date(sortedEvents[0].timestamp), 'MMM dd, yyyy HH:mm')} 
                  to {format(new Date(sortedEvents[sortedEvents.length - 1].timestamp), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimelineVisualization;
