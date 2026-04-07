import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import GTMProvider from "./components/GTMProvider";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AndyGrow from "./pages/AndyGrow";
import MasterclassAndyGrow from "./pages/MasterclassAndyGrow";
import VideoOutro from "./pages/VideoOutro";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="light" themes={["light", "dark"]} enableSystem={false} storageKey="elevate-theme">
      <QueryClientProvider client={queryClient}>
        <GTMProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<AndyGrow />} />
                <Route path="/masterclass-ia" element={<MasterclassAndyGrow />} />
                <Route path="/video-outro" element={<VideoOutro />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </GTMProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
