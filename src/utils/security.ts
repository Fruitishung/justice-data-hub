
/**
 * Security utility functions for protecting proprietary features
 */

import { supabase } from "@/integrations/supabase/client";

export const checkFeatureAccess = async (featureName: string): Promise<boolean> => {
  try {
    const { data: permissions, error } = await supabase
      .from('user_permissions')
      .select('allowed_features')
      .single();

    if (error) {
      console.error('Permission check failed:', error);
      return false;
    }

    return permissions?.allowed_features?.includes(featureName) || false;
  } catch (error) {
    console.error('Access check failed:', error);
    return false;
  }
};

export const logAccessAttempt = async (featureName: string, allowed: boolean) => {
  try {
    await supabase.functions.invoke('log-access-attempt', {
      body: { 
        feature: featureName,
        allowed,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to log access attempt:', error);
  }
};
