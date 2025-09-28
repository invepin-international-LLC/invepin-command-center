import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SecurityProvider } from "@/components/auth/SecurityProvider";
import { OrganizationProvider } from "@/components/auth/OrganizationProvider";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Demo from "./pages/Demo";
import Pricing from "./pages/Pricing";
import ROICalculator from "./pages/ROICalculator";
import Contact from "./pages/Contact";
import Mobile from "./pages/Mobile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <OrganizationProvider>
      <SecurityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/roi-calculator" element={<ROICalculator />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/mobile" element={<div className="min-h-screen"><Mobile /></div>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SecurityProvider>
    </OrganizationProvider>
  </QueryClientProvider>
);

export default App;
