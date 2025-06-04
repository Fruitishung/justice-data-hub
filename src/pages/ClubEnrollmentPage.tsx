
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, DollarSign, Calendar } from 'lucide-react';

const ClubEnrollmentPage = () => {
  const [enrollmentCode, setEnrollmentCode] = useState('');
  const [clubData, setClubData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { toast } = useToast();

  const handleFindClub = async () => {
    if (!enrollmentCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a club enrollment code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_club_by_code', {
        enrollment_code: enrollmentCode.trim()
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({
          title: "Club Not Found",
          description: "Invalid enrollment code. Please check and try again.",
          variant: "destructive"
        });
        setClubData(null);
      } else {
        setClubData(data[0]);
      }
    } catch (error) {
      console.error('Error finding club:', error);
      toast({
        title: "Error",
        description: "Failed to find club. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!clubData) return;

    setIsEnrolling(true);
    try {
      const { data, error } = await supabase.rpc('enroll_in_club', {
        enrollment_code: enrollmentCode.trim()
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; club_name?: string };

      if (result.success) {
        toast({
          title: "Enrollment Successful",
          description: `Your enrollment request for ${result.club_name} has been submitted and is pending approval.`
        });
        setClubData(null);
        setEnrollmentCode('');
      } else {
        toast({
          title: "Enrollment Failed",
          description: result.error || "Failed to enroll in club",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error enrolling in club:', error);
      toast({
        title: "Error",
        description: "Failed to process enrollment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Club Enrollment</h1>
        <p className="text-muted-foreground">
          Enter your club enrollment code to join a club directly
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Find Club</CardTitle>
          <CardDescription>
            Enter the enrollment code provided by your club administrator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter club enrollment code"
              value={enrollmentCode}
              onChange={(e) => setEnrollmentCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFindClub()}
            />
            <Button 
              onClick={handleFindClub}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Find Club"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {clubData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {clubData.name}
            </CardTitle>
            <CardDescription>
              Category: {formatCategory(clubData.category)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {clubData.description && (
              <p className="text-sm text-muted-foreground">
                {clubData.description}
              </p>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              {clubData.max_members && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Max Members: {clubData.max_members}</span>
                </div>
              )}
              
              {clubData.enrollment_fee > 0 && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Fee: ${clubData.enrollment_fee}</span>
                </div>
              )}
            </div>

            {!clubData.enrollment_open && (
              <Alert>
                <AlertDescription>
                  Enrollment is currently closed for this club.
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleEnroll}
              disabled={isEnrolling || !clubData.enrollment_open}
              className="w-full"
            >
              {isEnrolling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enrolling...
                </>
              ) : (
                "Request Enrollment"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <Alert>
        <Calendar className="h-4 w-4" />
        <AlertDescription>
          Your enrollment request will be reviewed by club administrators. You'll be notified once your request is processed.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ClubEnrollmentPage;
