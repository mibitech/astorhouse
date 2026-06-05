import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, LoginPage } from "@/features/auth";
import Index from "./pages/Index";
import About from "./pages/About";
import { ContactPage, ContactManagementPage } from "@/features/contacts";
import Dogs from "./pages/Dogs";
import DogDetail from "./pages/DogDetail";
import Training from "./pages/Training";
import { PuppiesPage, PuppyManagementPage } from "@/features/puppies";
import { HotelPage, HotelManagementPage } from "@/features/hotel";
import Articles from "./pages/Articles";
import NotFound from "./pages/NotFound";
import DogManagement from "./pages/DogManagement";
import { FaqPage, FaqManagementPage } from "@/features/faq";
import { CompanyInfoManagementPage } from "@/features/company";
import { WhatsAppBubble } from "@/components/ui/whatsapp-bubble";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/caes" element={<Dogs />} />
          <Route path="/caes/:id" element={<DogDetail />} />
          <Route path="/adestramento" element={<Training />} />
          <Route path="/filhotes" element={<PuppiesPage />} />
          <Route path="/hotel" element={<HotelPage />} />
          <Route path="/artigos" element={<Articles />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/caes" element={<DogManagement />} />
          <Route path="/admin/filhotes" element={<PuppyManagementPage />} />
          <Route path="/admin/faq" element={<FaqManagementPage />} />
          <Route path="/admin/hotel" element={<HotelManagementPage />} />
          <Route path="/admin/contatos" element={<ContactManagementPage />} />
          <Route path="/admin/empresa" element={<CompanyInfoManagementPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppBubble phoneNumber="551140354243" />
      </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
