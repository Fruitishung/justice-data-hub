import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const UpdatePasswordForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if we have a valid session from the reset link
  useEffect(() => {
    const checkSession = async () => {
      setCheckingSession(true);
      try {
        // First, check if we're coming from an email link with recovery token
        const params = new URLSearchParams(location.search);
        const hasResetParams = params.has('type') && params.get('type') === 'recovery';
        
        if (hasResetParams) {
          // We'll let the updatePassword handle the token validation
          setCheckingSession(false);
          return;
        }

        // Otherwise, check if we have a valid session
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          toast({
            variant: "destructive",
            title: "Invalid or expired link",
            description: "Please request a new password reset link.",
          });
          navigate("/auth/reset-password");
        }
        setCheckingSession(false);
      } catch (error) {
        console.error("Error checking session:", error);
        setCheckingSession(false);
        navigate("/auth/reset-password");
      }
    };

    checkSession();
  }, [navigate, toast, location.search]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      
      // Redirect to login page after successful password update
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center p-4">
        <p>Verifying your reset link...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Create New Password</h2>
      <p className="text-gray-600">
        Please create a new password for your account.
      </p>

      <form onSubmit={handleUpdatePassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
};
