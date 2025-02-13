
/**
 * Security utility functions for protecting proprietary features
 */

import { supabase } from "@/integrations/supabase/client";

interface UserPermissions {
  id: string;
  user_id: string;
  role: 'viewer' | 'user' | 'admin';
  allowed_features: string[];
  created_at: string;
  updated_at: string;
}

export const checkFeatureAccess = async (featureName: string): Promise<boolean> => {
  try {
    const { data: permissions, error } = await supabase
      .from('user_permissions')
      .select('*')
      .single();

    if (error || !permissions) {
      console.error('Permission check failed:', error);
      return false;
    }

    const userPermissions = permissions as UserPermissions;
    return userPermissions.allowed_features?.includes(featureName) ?? false;
  } catch (error) {
    console.error('Access check failed:', error);
    return false;
  }
};

export const logAccessAttempt = async (featureName: string, allowed: boolean) => {
  try {
    const { error } = await supabase
      .from('access_logs')
      .insert({
        feature: featureName,
        allowed,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent
      });

    if (error) {
      console.error('Failed to log access attempt:', error);
    }
  } catch (error) {
    console.error('Failed to log access attempt:', error);
  }
};
