import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ListingOffers from "./pages/ListingOffers";
import ListingBuilds from "./pages/ListingBuilds";
import DetailsOffer from "./pages/DetailsOffer";
import DetailsBuild from "./pages/DetailsBuild";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNewBuild from "./pages/admin/AdminNewBuild";
import AdminNewOffer from "./pages/admin/AdminNewOffer";
import AdminProducts from "./pages/admin/AdminProducts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ofertas" element={<ListingOffers />} />
          <Route path="/ofertas/:id" element={<DetailsOffer />} />
          <Route path="/builds" element={<ListingBuilds />} />
          <Route path="/builds/:id" element={<DetailsBuild />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/builds/nova" element={<AdminNewBuild />} />
          <Route path="/admin/ofertas/nova" element={<AdminNewOffer />} />
          <Route path="/admin/produtos" element={<AdminProducts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
