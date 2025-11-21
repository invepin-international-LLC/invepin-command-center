import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SecurityProvider } from "@/components/auth/SecurityProvider";
import { OrganizationProvider } from "@/components/auth/OrganizationProvider";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Hive from "./pages/Hive";
import Demo from "./pages/Demo";
import Pricing from "./pages/Pricing";
import ROICalculator from "./pages/ROICalculator";
import Contact from "./pages/Contact";
import Mobile from "./pages/Mobile";
import NotFound from "./pages/NotFound";
import Retail from "./pages/solutions/Retail";
import Enterprise from "./pages/solutions/Enterprise";
import Healthcare from "./pages/solutions/Healthcare";
import MicroPins from "./pages/products/MicroPins";
import FacialRecognition from "./pages/products/FacialRecognition";
import ColonyHub from "./pages/products/ColonyHub";
import CaseStudies from "./pages/resources/CaseStudies";
import Docs from "./pages/resources/Docs";
import Support from "./pages/resources/Support";
import InvepinSetup from "./pages/InvepinSetup";

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    // Handle deep link authentication for mobile apps
    const handleDeepLink = async () => {
      const isNative = (window as any).Capacitor?.isNativePlatform?.() ?? false;
      if (!isNative) return;

      try {
        const { App } = await import('@capacitor/app');
        App.addListener('appUrlOpen', async (event: { url: string }) => {
          console.log('Deep link received:', event.url);
          
          // Parse the URL to extract auth parameters
          try {
            const url = new URL(event.url);
            const fragment = url.hash || url.search;
            
            if (fragment) {
              // Extract tokens from the fragment
              const params = new URLSearchParams(fragment.replace('#', '').replace('?', ''));
              const accessToken = params.get('access_token');
              const refreshToken = params.get('refresh_token');
              
              if (accessToken) {
                console.log('Auth tokens found in deep link, setting session...');
                
                // Set the session with the tokens
                const { error } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken || '',
                });
                
                if (error) {
                  console.error('Error setting session:', error);
                } else {
                  console.log('Session set successfully, redirecting to dashboard...');
                  // Navigate to dashboard after successful auth
                  window.location.href = '/dashboard';
                }
              }
            }
          } catch (parseError) {
            console.error('Error parsing deep link:', parseError);
          }
        });
      } catch (error) {
        console.error('Error setting up deep link handler:', error);
      }
    };

    handleDeepLink();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/hive" element={<Hive />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/roi-calculator" element={<ROICalculator />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/mobile" element={<div className="min-h-screen"><Mobile /></div>} />
      <Route path="/solutions/retail" element={<Retail />} />
      <Route path="/solutions/enterprise" element={<Enterprise />} />
      <Route path="/solutions/healthcare" element={<Healthcare />} />
      <Route path="/products/micro-pins" element={<MicroPins />} />
      <Route path="/products/facial-recognition" element={<FacialRecognition />} />
      <Route path="/products/colony-hub" element={<ColonyHub />} />
      <Route path="/case-studies" element={<CaseStudies />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/support" element={<Support />} />
      <Route path="/invepin-setup" element={<InvepinSetup />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <OrganizationProvider>
      <SecurityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </SecurityProvider>
    </OrganizationProvider>
  </QueryClientProvider>
);

export default App;
