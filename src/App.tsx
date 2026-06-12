import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { SearchProvider } from "@/contexts/SearchContext";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import ListingOffers from "./pages/ListingOffers";
import ListingBuilds from "./pages/ListingBuilds";
import DetailsOffer from "./pages/DetailsOffer";
import DetailsBuild from "./pages/DetailsBuild";
import NotFound from "./pages/NotFound";

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminNewBuild = lazy(() => import("./pages/admin/AdminNewBuild"));
const AdminNewOffer = lazy(() => import("./pages/admin/AdminNewOffer"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminBanners = lazy(() => import("./pages/admin/AdminBanners"));

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SearchProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/ofertas" element={<ListingOffers />} />
              <Route path="/ofertas/:id" element={<DetailsOffer />} />
              <Route path="/builds" element={<ListingBuilds />} />
              <Route path="/builds/:id" element={<DetailsBuild />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<Suspense fallback={<AdminFallback />}><AdminLogin /></Suspense>} />
              <Route path="/admin" element={<AdminRouteGuard><Suspense fallback={<AdminFallback />}><AdminDashboard /></Suspense></AdminRouteGuard>} />
              <Route path="/admin/builds/nova" element={<AdminRouteGuard><Suspense fallback={<AdminFallback />}><AdminNewBuild /></Suspense></AdminRouteGuard>} />
              <Route path="/admin/builds/:id/editar" element={<AdminRouteGuard><Suspense fallback={<AdminFallback />}><AdminNewBuild /></Suspense></AdminRouteGuard>} />
              <Route path="/admin/ofertas/nova" element={<AdminRouteGuard><Suspense fallback={<AdminFallback />}><AdminNewOffer /></Suspense></AdminRouteGuard>} />
              <Route path="/admin/ofertas/:id/editar" element={<AdminRouteGuard><Suspense fallback={<AdminFallback />}><AdminNewOffer /></Suspense></AdminRouteGuard>} />
              <Route path="/admin/produtos" element={<AdminRouteGuard><Suspense fallback={<AdminFallback />}><AdminProducts /></Suspense></AdminRouteGuard>} />
              <Route path="/admin/banners" element={<AdminRouteGuard><Suspense fallback={<AdminFallback />}><AdminBanners /></Suspense></AdminRouteGuard>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SearchProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
