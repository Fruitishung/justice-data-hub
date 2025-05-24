
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TimelineEvent } from '@/types/timeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TimelineBuilderProps {
  incidentReportId: string;
  events: TimelineEvent[];
  onEventsUpdate: (events: TimelineEvent[]) => void;
}

interface EventFormData {
  event_type: TimelineEvent['event_type'];
  timestamp: string;
  title: string;
  description: string;
  location: string;
}

const TimelineBuilder = ({ incidentReportId, events, onEventsUpdate }: TimelineBuilderProps) => {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const { toast } = useToast();

  const form = useForm<EventFormData>({
    defaultValues: {
      event_type: 'investigation',
      timestamp: new Date().toISOString().slice(0, 16),
      title: '',
      description: '',
      location: ''
    }
  });

  const handleAddEvent = (data: EventFormData) => {
    const newEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      incident_report_id: incidentReportId,
      event_type: data.event_type,
      timestamp: data.timestamp,
      title: data.title,
      description: data.description,
      location: data.location || undefined,
      created_by: 'Current User', // This would come from auth context
      created_at: new Date().toISOString()
    };

    const updatedEvents = [...events, newEvent].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    onEventsUpdate(updatedEvents);
    form.reset();
    setIsAddingEvent(false);

    toast({
      title: "Event Added",
      description: "Timeline event has been added successfully."
    });
  };

  const handleRemoveEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    onEventsUpdate(updatedEvents);

    toast({
      title: "Event Removed",
      description: "Timeline event has been removed."
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Timeline Builder</h3>
        <Button 
          onClick={() => setIsAddingEvent(!isAddingEvent)}
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {isAddingEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Add Timeline Event</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddEvent)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="event_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="incident">Incident</SelectItem>
                            <SelectItem value="evidence">Evidence Collection</SelectItem>
                            <SelectItem value="witness">Witness Interview</SelectItem>
                            <SelectItem value="arrest">Arrest</SelectItem>
                            <SelectItem value="investigation">Investigation Activity</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timestamp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date & Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of the event" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide detailed information about this event"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Where did this event occur?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-2">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsAddingEvent(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Events ({events.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {events
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                .map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()} • {event.event_type}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveEvent(event.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimelineBuilder;
