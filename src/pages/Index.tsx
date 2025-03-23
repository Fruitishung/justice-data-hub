import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ReportCategories from "@/components/index/ReportCategories";
import { supabase } from "@/integrations/supabase/client";

// Add this import
import { JurisdictionDisplay } from "@/components/JurisdictionDisplay";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-accent text-accent-foreground py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Police Report Management System</h1>
          
          {/* Add Jurisdiction Display here */}
          <div className="flex items-center space-x-4">
            <JurisdictionDisplay />
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-6">
        <h2 className="text-3xl font-semibold mb-4">Welcome to the System</h2>
        <p className="text-gray-600 mb-8">
          Select a category to start a new report or manage existing records.
        </p>

        <ReportCategories />
      </main>
    </div>
  );
};

export default Index;
