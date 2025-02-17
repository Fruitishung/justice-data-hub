
import { supabase } from "@/integrations/supabase/client";

type UserRole = 'viewer' | 'user' | 'admin';

interface UserPermissions {
  id: string;
  user_id: string;
  role: UserRole;
  allowed_features: string[];
  created_at: string;
  updated_at: string;
}

interface AccessLog {
  feature: string;
  allowed: boolean;
  timestamp: string;
  user_agent: string;
}

/**
 * Checks if the current user has access to a specific feature
 * @param featureName - The name of the feature to check access for
 * @returns A promise that resolves to true if the user has access, false otherwise
 */
export const checkFeatureAccess = async (featureName: string): Promise<boolean> => {
  try {
    // Use the security definer function instead of direct table access
    const { data: permissions, error } = await supabase
      .rpc('check_user_permission', { userid: null })
      .maybeSingle();

    if (error) {
      console.error('Permission check failed:', error);
      return false;
    }

    // If no permissions found, default to basic access
    if (!permissions) {
      console.log('No permissions found, defaulting to basic access');
      return true;
    }

    // Admin role has access to everything
    if (permissions.role === 'admin') {
      console.log('Admin access granted');
      return true;
    }

    // Check if feature is in allowed features array
    const hasAccess = permissions.allowed_features?.includes(featureName) ?? false;
    console.log(`Feature access check for ${featureName}: ${hasAccess}`);
    return hasAccess;
  } catch (error) {
    console.error('Access check failed:', error);
    return false;
  }
};

/**
 * Logs an access attempt to the access_logs table
 * @param featureName - The name of the feature that was accessed
 * @param allowed - Whether access was granted
 */
export const logAccessAttempt = async (featureName: string, allowed: boolean): Promise<void> => {
  const accessLog: AccessLog = {
    feature: featureName,
    allowed,
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent
  };

  try {
    const { error } = await supabase
      .from('access_logs')
      .insert([accessLog]);

    if (error) {
      console.error('Failed to log access attempt:', error);
    } else {
      console.log('Access attempt logged successfully');
    }
  } catch (error) {
    console.error('Failed to log access attempt:', error);
  }
};
