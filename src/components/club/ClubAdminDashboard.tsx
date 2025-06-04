
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, Settings, Check, X, Eye, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  max_members: number;
  enrollment_fee: number;
  enrollment_open: boolean;
  club_code: string;
}

interface Enrollment {
  id: string;
  status: string;
  enrolled_at: string;
  user_id: string;
  notes: string;
}

const ClubAdminDashboard = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminClubs();
  }, []);

  const fetchAdminClubs = async () => {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name');

      if (error) throw error;

      setClubs(data || []);
      if (data && data.length > 0) {
        setSelectedClub(data[0]);
      }
    } catch (error) {
      console.error('Error fetching admin clubs:', error);
      toast({
        title: "Error",
        description: "Failed to load your clubs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClubEnrollments = async (clubId: string) => {
    try {
      const { data, error } = await supabase
        .from('club_enrollments')
        .select('*')
        .eq('club_id', clubId)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast({
        title: "Error",
        description: "Failed to load club enrollments",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (selectedClub) {
      fetchClubEnrollments(selectedClub.id);
    }
  }, [selectedClub]);

  const handleUpdateEnrollmentStatus = async (enrollmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('club_enrollments')
        .update({ 
          status,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
          approved_by: status === 'approved' ? (await supabase.auth.getUser()).data.user?.id : null
        })
        .eq('id', enrollmentId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Enrollment ${status} successfully`
      });

      if (selectedClub) {
        fetchClubEnrollments(selectedClub.id);
      }
    } catch (error) {
      console.error('Error updating enrollment status:', error);
      toast({
        title: "Error",
        description: "Failed to update enrollment status",
        variant: "destructive"
      });
    }
  };

  const handleUpdateClub = async (updatedClub: Partial<Club>) => {
    if (!selectedClub) return;

    try {
      const { error } = await supabase
        .from('clubs')
        .update(updatedClub)
        .eq('id', selectedClub.id);

      if (error) throw error;

      toast({
        title: "Club Updated",
        description: "Club settings updated successfully"
      });

      fetchAdminClubs();
    } catch (error) {
      console.error('Error updating club:', error);
      toast({
        title: "Error",
        description: "Failed to update club settings",
        variant: "destructive"
      });
    }
  };

  const copyClubCode = () => {
    if (selectedClub) {
      navigator.clipboard.writeText(selectedClub.club_code);
      toast({
        title: "Copied",
        description: "Club enrollment code copied to clipboard"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      withdrawn: "outline"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading your clubs...</div>;
  }

  if (clubs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            You don't have any clubs to manage yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Club Administration</h1>
      
      {/* Club Selection */}
      <div className="flex gap-2 flex-wrap">
        {clubs.map((club) => (
          <Button
            key={club.id}
            variant={selectedClub?.id === club.id ? "default" : "outline"}
            onClick={() => setSelectedClub(club)}
          >
            {club.name}
          </Button>
        ))}
      </div>

      {selectedClub && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Club Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Club Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Club Name</Label>
                <Input
                  value={selectedClub.name}
                  onChange={(e) => setSelectedClub({ ...selectedClub, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={selectedClub.description || ''}
                  onChange={(e) => setSelectedClub({ ...selectedClub, description: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Max Members</Label>
                <Input
                  type="number"
                  value={selectedClub.max_members || ''}
                  onChange={(e) => setSelectedClub({ ...selectedClub, max_members: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div>
                <Label>Enrollment Fee ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={selectedClub.enrollment_fee || ''}
                  onChange={(e) => setSelectedClub({ ...selectedClub, enrollment_fee: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedClub.enrollment_open}
                  onCheckedChange={(checked) => setSelectedClub({ ...selectedClub, enrollment_open: checked })}
                />
                <Label>Enrollment Open</Label>
              </div>
              
              <div>
                <Label>Enrollment Code</Label>
                <div className="flex gap-2">
                  <Input value={selectedClub.club_code} readOnly />
                  <Button variant="outline" size="sm" onClick={copyClubCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button onClick={() => handleUpdateClub(selectedClub)} className="w-full">
                Update Club Settings
              </Button>
            </CardContent>
          </Card>

          {/* Enrollment Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Enrollment Requests ({enrollments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {enrollments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No enrollment requests yet
                  </p>
                ) : (
                  enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        {getStatusBadge(enrollment.status)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {enrollment.status === 'pending' && (
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateEnrollmentStatus(enrollment.id, 'approved')}
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateEnrollmentStatus(enrollment.id, 'rejected')}
                          >
                            <X className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClubAdminDashboard;
