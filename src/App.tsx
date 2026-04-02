import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dogs from "./pages/Dogs";
import DogDetail from "./pages/DogDetail";
import Training from "./pages/Training";
import Puppies from "./pages/Puppies";
import Hotel from "./pages/Hotel";
import Articles from "./pages/Articles";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DogManagement from "./pages/DogManagement";
import PuppyManagement from "./pages/PuppyManagement";
import FAQManagement from "./pages/FAQManagement";
import FAQ from "./pages/FAQ";
import HotelManagement from "./pages/HotelManagement";
import ContactManagement from "./pages/ContactManagement";
import CompanyInfoManagement from "./pages/CompanyInfoManagement";
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
          <Route path="/filhotes" element={<Puppies />} />
          <Route path="/hotel" element={<Hotel />} />
          <Route path="/artigos" element={<Articles />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/caes" element={<DogManagement />} />
          <Route path="/admin/filhotes" element={<PuppyManagement />} />
          <Route path="/admin/faq" element={<FAQManagement />} />
          <Route path="/admin/hotel" element={<HotelManagement />} />
          <Route path="/admin/contatos" element={<ContactManagement />} />
          <Route path="/admin/empresa" element={<CompanyInfoManagement />} />
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
