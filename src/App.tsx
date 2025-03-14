
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ArrestTagPage from "./pages/ArrestTagPage";
import MCTETTSPage from "./pages/MCTETTSPage";
import MockDataPage from "./pages/MockDataPage";
import ReportDetailsPage from "./pages/ReportDetailsPage";
import ReportsListPage from "./pages/ReportsListPage";
import StudentDataProtection from "./pages/StudentDataProtection";
import AuthPage from "./pages/AuthPage";
import TrainingPhotosPage from "./pages/TrainingPhotosPage";

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
          {/* Auth routes with nested paths */}
          <Route path="/auth/*" element={<AuthPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <ReportsListPage />
            </ProtectedRoute>
          } />
          <Route path="/arrest-tag/:id" element={
            <ProtectedRoute>
              <ArrestTagPage />
            </ProtectedRoute>
          } />
          <Route path="/arrest-tags" element={
            <ProtectedRoute>
              <ArrestTagPage />
            </ProtectedRoute>
          } />
          <Route path="/mctetts" element={
            <ProtectedRoute>
              <MCTETTSPage />
            </ProtectedRoute>
          } />
          <Route path="/mock-data" element={
            <ProtectedRoute>
              <MockDataPage />
            </ProtectedRoute>
          } />
          <Route path="/training-photos" element={
            <ProtectedRoute>
              <TrainingPhotosPage />
            </ProtectedRoute>
          } />
          <Route path="/report/new" element={
            <ProtectedRoute>
              <ReportDetailsPage />
            </ProtectedRoute>
          } />
          <Route path="/report/:id" element={
            <ProtectedRoute>
              <ReportDetailsPage />
            </ProtectedRoute>
          } />
          <Route path="/student-data-protection" element={
            <ProtectedRoute>
              <StudentDataProtection />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
