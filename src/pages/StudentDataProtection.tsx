
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ProtectionSettingsForm } from "@/components/student-data-protection/ProtectionSettingsForm";
import { AccessLogsTable } from "@/components/student-data-protection/AccessLogsTable";

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

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Student Data Protection</h1>

      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Protection Settings</TabsTrigger>
          {isAdmin && <TabsTrigger value="logs">Access Logs</TabsTrigger>}
        </TabsList>

        <TabsContent value="settings">
          <ProtectionSettingsForm
            settings={settings}
            onSettingsUpdate={setSettings}
          />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="logs">
            <AccessLogsTable logs={accessLogs} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default StudentDataProtection;
