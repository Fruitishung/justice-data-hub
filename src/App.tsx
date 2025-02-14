
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ArrestTagPage from "./pages/ArrestTagPage";
import MCTETTSPage from "./pages/MCTETTSPage";
import MockDataPage from "./pages/MockDataPage";
import ReportDetailsPage from "./pages/ReportDetailsPage";
import StudentDataProtection from "./pages/StudentDataProtection";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/arrest-tag/:id" element={<ArrestTagPage />} />
          <Route path="/mctetts" element={<MCTETTSPage />} />
          <Route path="/mock-data" element={<MockDataPage />} />
          <Route path="/report/:id" element={<ReportDetailsPage />} />
          <Route path="/report/new" element={<ReportDetailsPage />} />
          <Route path="/student-data-protection" element={<StudentDataProtection />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
