import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import SmartScheduler from "./pages/SmartScheduler";
import CalendarView from "./pages/CalendarView";
import Reminders from "./pages/Reminders";
import Wellness from "./pages/Wellness";
import Health from "./pages/Health";
import Chat from "./pages/Chat";
import NeuroFlow from "./pages/NeuroFlow";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import GoalsPage from "./pages/Goals";
import GoalSharePreview from "./pages/GoalSharePreview";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/scheduler" element={<SmartScheduler />} />
      <Route path="/calendar" element={<CalendarView />} />
      <Route path="/goals" element={<GoalsPage />} />
      <Route path="/share/goal" element={<GoalSharePreview />} />
      <Route path="/reminders" element={<Reminders />} />
      <Route path="/wellness" element={<Wellness />} />
      <Route path="/health" element={<Health />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/neuroflow" element={<NeuroFlow />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
