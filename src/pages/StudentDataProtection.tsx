
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const StudentDataProtection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [protection, setProtection] = useState<any>(null);
  const [accessLogs, setAccessLogs] = useState<any[]>([]);

  useEffect(() => {
    checkAdminStatus();
    loadData();
  }, []);

  const checkAdminStatus = async () => {
    const { data: permissions } = await supabase
      .from('user_permissions')
      .select('role')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    setIsAdmin(permissions?.role === 'admin');
  };

  const loadData = async () => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      // Load protection settings
      const { data: protectionData, error: protectionError } = await supabase
        .from('student_data_protection')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (protectionError && protectionError.code !== 'PGRST116') {
        throw protectionError;
      }

      setProtection(protectionData || {});

      // Load access logs if admin
      if (isAdmin) {
        const { data: logsData, error: logsError } = await supabase
          .from('minor_data_access_logs')
          .select(`
            *,
            accessed_by:accessed_by_user_id (
              email
            ),
            student:student_id (
              email
            )
          `)
          .order('accessed_at', { ascending: false })
          .limit(50);

        if (logsError) throw logsError;
        setAccessLogs(logsData || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data protection settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProtection = async (updates: any) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const { error } = await supabase
        .from('student_data_protection')
        .upsert({
          user_id: userId,
          ...protection,
          ...updates,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Data protection settings updated.",
      });

      loadData();
    } catch (error) {
      console.error('Error updating protection:', error);
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Student Data Protection</h1>
        <Button variant="outline" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>

      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Protection Settings</TabsTrigger>
          {isAdmin && <TabsTrigger value="logs">Access Logs</TabsTrigger>}
        </TabsList>

        <TabsContent value="settings">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Label>School System</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={protection.school_system || ''}
                  onChange={(e) => updateProtection({ school_system: e.target.value })}
                >
                  <option value="">Select System</option>
                  <option value="google_edu">Google Education</option>
                  <option value="microsoft_edu">Microsoft Education</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label>School Email</Label>
                <Input
                  type="email"
                  value={protection.school_email || ''}
                  onChange={(e) => updateProtection({ school_email: e.target.value })}
                />
              </div>

              <div>
                <Label>School District</Label>
                <Input
                  value={protection.school_district || ''}
                  onChange={(e) => updateProtection({ school_district: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={protection.parental_consent_obtained || false}
                  onCheckedChange={(checked) => 
                    updateProtection({ 
                      parental_consent_obtained: checked,
                      parental_consent_date: checked ? new Date().toISOString() : null
                    })
                  }
                />
                <Label>Parental Consent Obtained</Label>
              </div>

              {protection.parental_consent_obtained && (
                <div>
                  <Label>Guardian Email</Label>
                  <Input
                    type="email"
                    value={protection.guardian_email || ''}
                    onChange={(e) => updateProtection({ guardian_email: e.target.value })}
                  />
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="logs">
            <Card className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Accessed By</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Access Type</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {format(new Date(log.accessed_at), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>{log.accessed_by?.email}</TableCell>
                      <TableCell>{log.student?.email}</TableCell>
                      <TableCell>{log.access_type}</TableCell>
                      <TableCell>{log.access_reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default StudentDataProtection;
