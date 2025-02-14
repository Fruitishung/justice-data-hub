
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
import { supabase } from "@/integrations/supabase/client";

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

interface ProtectionSettingsFormProps {
  settings: ProtectionSettings | null;
  onSettingsUpdate: (settings: ProtectionSettings) => void;
}

export const ProtectionSettingsForm = ({
  settings,
  onSettingsUpdate,
}: ProtectionSettingsFormProps) => {
  const { toast } = useToast();

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

      onSettingsUpdate({ ...settings, ...updates } as ProtectionSettings);
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
        onSettingsUpdate(data as ProtectionSettings);
      }
    }

    toast({
      title: "Success",
      description: "Protection settings updated successfully",
    });
  };

  return (
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
              <SelectItem value="microsoft_edu">Microsoft Education</SelectItem>
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
            onChange={(e) => updateSettings({ school_email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="school-district">School District</Label>
          <Input
            id="school-district"
            value={settings?.school_district || ""}
            onChange={(e) => updateSettings({ school_district: e.target.value })}
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
              onChange={(e) => updateSettings({ guardian_email: e.target.value })}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
