
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";

export const RedirectToMCTETTS = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/mctetts');
  }, [navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900">
      <Loader2 className="h-10 w-10 text-cyan-400 animate-spin mb-4" />
      <p className="text-white text-lg">Accessing MCTETTS Secure Database...</p>
    </div>
  );
};

export default RedirectToMCTETTS;
