import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SmartScheduler from "./pages/SmartScheduler";
import Reminders from "./pages/Reminders";
import Wellness from "./pages/Wellness";
import Health from "./pages/Health";
import Chat from "./pages/Chat";
import NeuroFlow from "./pages/NeuroFlow";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/scheduler" element={<SmartScheduler />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/health" element={<Health />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/neuroflow" element={<NeuroFlow />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
