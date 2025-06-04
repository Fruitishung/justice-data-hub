
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, Calendar, AlertCircle } from 'lucide-react';

interface Enrollment {
  id: string;
  status: string;
  enrolled_at: string;
  club: {
    name: string;
    description: string;
    category: string;
  };
}

const MyEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('club_enrollments')
        .select(`
          id,
          status,
          enrolled_at,
          clubs:club_id (
            name,
            description,
            category
          )
        `)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast({
        title: "Error",
        description: "Failed to load your enrollments",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (enrollmentId: string) => {
    try {
      const { error } = await supabase
        .from('club_enrollments')
        .update({ status: 'withdrawn' })
        .eq('id', enrollmentId);

      if (error) throw error;

      toast({
        title: "Enrollment Withdrawn",
        description: "Your enrollment has been withdrawn successfully"
      });

      fetchEnrollments();
    } catch (error) {
      console.error('Error withdrawing enrollment:', error);
      toast({
        title: "Error",
        description: "Failed to withdraw enrollment",
        variant: "destructive"
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

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading your enrollments...</div>;
  }

  if (enrollments.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            You haven't enrolled in any clubs yet. Use a club enrollment code to join a club.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">My Club Enrollments</h2>
      
      {enrollments.map((enrollment) => (
        <Card key={enrollment.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {enrollment.club.name}
              </CardTitle>
              {getStatusBadge(enrollment.status)}
            </div>
            <p className="text-sm text-muted-foreground">
              Category: {formatCategory(enrollment.club.category)}
            </p>
          </CardHeader>
          <CardContent>
            {enrollment.club.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {enrollment.club.description}
              </p>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Calendar className="h-4 w-4" />
              <span>
                Enrolled on {new Date(enrollment.enrolled_at).toLocaleDateString()}
              </span>
            </div>

            {enrollment.status === 'pending' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWithdraw(enrollment.id)}
                className="w-full"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Withdraw Enrollment
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyEnrollments;
