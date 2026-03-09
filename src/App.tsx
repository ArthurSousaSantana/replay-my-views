import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import Index from "./pages/Index";
import ListingOffers from "./pages/ListingOffers";
import ListingBuilds from "./pages/ListingBuilds";
import DetailsOffer from "./pages/DetailsOffer";
import DetailsBuild from "./pages/DetailsBuild";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNewBuild from "./pages/admin/AdminNewBuild";
import AdminNewOffer from "./pages/admin/AdminNewOffer";
import AdminProducts from "./pages/admin/AdminProducts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/ofertas" element={<ListingOffers />} />
            <Route path="/ofertas/:id" element={<DetailsOffer />} />
            <Route path="/builds" element={<ListingBuilds />} />
            <Route path="/builds/:id" element={<DetailsBuild />} />

            {/* Admin login (public, no guard) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected admin routes */}
            <Route path="/admin" element={<AdminRouteGuard><AdminDashboard /></AdminRouteGuard>} />
            <Route path="/admin/builds/nova" element={<AdminRouteGuard><AdminNewBuild /></AdminRouteGuard>} />
            <Route path="/admin/builds/:id/editar" element={<AdminRouteGuard><AdminNewBuild /></AdminRouteGuard>} />
            <Route path="/admin/ofertas/nova" element={<AdminRouteGuard><AdminNewOffer /></AdminRouteGuard>} />
            <Route path="/admin/ofertas/:id/editar" element={<AdminRouteGuard><AdminNewOffer /></AdminRouteGuard>} />
            <Route path="/admin/produtos" element={<AdminRouteGuard><AdminProducts /></AdminRouteGuard>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
