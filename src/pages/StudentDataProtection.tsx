
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SchoolSystemType = "google_edu" | "microsoft_edu" | "other";

interface ProtectionSettings {
  id: string;
  school_system: SchoolSystemType;
  school_email: string;
  school_district: string;
  guardian_email: string | null;
  parental_consent_obtained: boolean;
  parental_consent_date: string | null;
  data_retention_policy: string;
  data_access_restrictions: string[];
  user_type: "adult" | "minor";
}

interface AccessLog {
  id: string;
  accessed_at: string;
  accessed_by_user_id: string;
  student_id: string;
  access_type: string;
  access_reason: string;
}

const StudentDataProtection = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ProtectionSettings | null>(null);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user is admin
      const { data: permissions } = await supabase
        .from('user_permissions')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      setIsAdmin(permissions?.role === 'admin');

      // Fetch protection settings
      const { data: protectionData } = await supabase
        .from('student_data_protection')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (protectionData) {
        setSettings(protectionData);
      }

      // Fetch access logs if admin
      if (permissions?.role === 'admin') {
        const { data: logs } = await supabase
          .from('minor_data_access_logs')
          .select('*')
          .order('accessed_at', { ascending: false })
          .limit(50);

        if (logs) {
          setAccessLogs(logs);
        }
      }
    };

    fetchData();
  }, []);

  const updateSettings = async (updates: Partial<ProtectionSettings>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (settings?.id) {
      // Update existing settings
      const { error } = await supabase
        .from('student_data_protection')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update protection settings",
        });
        return;
      }

      setSettings({ ...settings, ...updates });
    } else {
      // Insert new settings
      const newSettings = {
        user_id: user.id,
        user_type: "minor" as const,
        data_retention_policy: "standard",
        data_access_restrictions: [],
        ...updates
      };

      const { error, data } = await supabase
        .from('student_data_protection')
        .insert(newSettings)
        .select()
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create protection settings",
        });
        return;
      }

      if (data) {
        setSettings(data);
      }
    }

    toast({
      title: "Success",
      description: "Protection settings updated successfully",
    });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Student Data Protection</h1>

      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Protection Settings</TabsTrigger>
          {isAdmin && <TabsTrigger value="logs">Access Logs</TabsTrigger>}
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Protection Settings</CardTitle>
              <CardDescription>
                Configure your student data protection settings and parental consent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="school-system">School System</Label>
                <Select
                  value={settings?.school_system || ""}
                  onValueChange={(value: SchoolSystemType) =>
                    updateSettings({ school_system: value })
                  }
                >
                  <SelectTrigger id="school-system">
                    <SelectValue placeholder="Select school system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google_edu">Google Education</SelectItem>
                    <SelectItem value="microsoft_edu">
                      Microsoft Education
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school-email">School Email</Label>
                <Input
                  id="school-email"
                  type="email"
                  value={settings?.school_email || ""}
                  onChange={(e) =>
                    updateSettings({ school_email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school-district">School District</Label>
                <Input
                  id="school-district"
                  value={settings?.school_district || ""}
                  onChange={(e) =>
                    updateSettings({ school_district: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="parental-consent"
                  checked={settings?.parental_consent_obtained || false}
                  onCheckedChange={(checked) => {
                    const updates: Partial<ProtectionSettings> = {
                      parental_consent_obtained: checked,
                      parental_consent_date: checked ? new Date().toISOString() : null,
                    };
                    updateSettings(updates);
                  }}
                />
                <Label htmlFor="parental-consent">Parental Consent Obtained</Label>
              </div>

              {settings?.parental_consent_obtained && (
                <div className="space-y-2">
                  <Label htmlFor="guardian-email">Guardian Email</Label>
                  <Input
                    id="guardian-email"
                    type="email"
                    value={settings?.guardian_email || ""}
                    onChange={(e) =>
                      updateSettings({ guardian_email: e.target.value })
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Access Logs</CardTitle>
                <CardDescription>
                  View recent access to student data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Access Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Student ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {new Date(log.accessed_at).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.access_type}</TableCell>
                        <TableCell>{log.access_reason}</TableCell>
                        <TableCell>{log.student_id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default StudentDataProtection;
