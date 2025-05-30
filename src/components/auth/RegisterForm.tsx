
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

interface RegisterFormProps {
  setError: (error: string | null) => void;
}

export const RegisterForm = ({ setError }: RegisterFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!disclaimerAccepted) {
      setError("You must accept the legal disclaimer to continue");
      setIsLoading(false);
      return;
    }

    if (!schoolName.trim()) {
      setError("School name is required");
      setIsLoading(false);
      return;
    }

    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.trim(),
            school_name: schoolName.trim(),
            legal_disclaimer_accepted: disclaimerAccepted,
          },
        },
      });

      if (signUpError) throw signUpError;

      // If auto-confirm is enabled, user is signed in immediately
      if (data.session) {
        toast({
          title: "Success",
          description: "Registration successful! You're now logged in.",
        });
        navigate("/");
      } else {
        toast({
          title: "Success",
          description: "Registration successful! Please check your email to verify your account.",
        });
      }
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

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="school">School Name</Label>
        <Input
          id="school"
          type="text"
          placeholder="Enter your school name"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Choose a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="disclaimer"
          checked={disclaimerAccepted}
          onCheckedChange={(checked) => setDisclaimerAccepted(checked as boolean)}
        />
        <Label htmlFor="disclaimer" className="text-sm">
          I accept the legal disclaimer and terms of use for the Police Report Management System
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
};
