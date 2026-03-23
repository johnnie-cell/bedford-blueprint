import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import IronmanTraining from "./pages/IronmanTraining";
import Dads4DadsBusiness from "./pages/Dads4DadsBusiness";
import Dads4DadsFoundation from "./pages/Dads4DadsFoundation";
import ClubDaddyPodcast from "./pages/ClubDaddyPodcast";
import PersonalBrand from "./pages/PersonalBrand";
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
            <Route path="/ironman" element={<IronmanTraining />} />
            <Route path="/business" element={<Dads4DadsBusiness />} />
            <Route path="/foundation" element={<Dads4DadsFoundation />} />
            <Route path="/podcast" element={<ClubDaddyPodcast />} />
            <Route path="/brand" element={<PersonalBrand />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
