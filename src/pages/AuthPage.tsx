
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

interface LocationState {
  from?: {
    pathname: string;
  };
}

const AuthTabs = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || "/";
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("login");

  // Clear error when switching tabs
  const handleTabChange = (value: string) => {
    setError(null);
    setActiveTab(value);
  };

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate(from);
      }
    };
    checkUser();
  }, [navigate, from]);

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginForm setError={setError} />
        </TabsContent>

        <TabsContent value="register">
          <RegisterForm setError={setError} />
        </TabsContent>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </Tabs>
    </Card>
  );
};

const AuthPage = () => {
  return (
    <div className="container mx-auto p-8 max-w-md">
      <Routes>
        <Route path="/" element={<AuthTabs />} />
        <Route path="/reset-password" element={
          <Card className="p-6">
            <PasswordResetForm />
          </Card>
        } />
        <Route path="/update-password" element={
          <Card className="p-6">
            <UpdatePasswordForm />
          </Card>
        } />
      </Routes>
    </div>
  );
};

export default AuthPage;
