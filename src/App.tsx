import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import CommandQueue from "./pages/CommandQueue";
import Pipeline from "./pages/Pipeline";
import ContentPage from "./pages/ContentPage";
import SocialPulse from "./pages/SocialPulse";
import Training from "./pages/Training";
import Sponsors from "./pages/Sponsors";
import LegalVault from "./pages/LegalVault";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tasks" element={<CommandQueue />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/social" element={<SocialPulse />} />
            <Route path="/training" element={<Training />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/legal" element={<LegalVault />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
