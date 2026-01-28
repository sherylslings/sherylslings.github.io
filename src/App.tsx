import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import BrowseCollectionPage from "./pages/BrowseCollectionPage";
import CategoryPage from "./pages/CategoryPage";
import CarrierDetailPage from "./pages/CarrierDetailPage";
import PoliciesPage from "./pages/PoliciesPage";
import SafetyPage from "./pages/SafetyPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCarriers from "./pages/admin/AdminCarriers";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SiteSettingsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<BrowseCollectionPage />} />
            <Route path="/browse" element={<Navigate to="/" replace />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/carrier/:id" element={<CarrierDetailPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />}>
              <Route index element={<Navigate to="carriers" replace />} />
              <Route path="carriers" element={<AdminCarriers />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SiteSettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
