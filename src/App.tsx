import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SearchPage from "./fic/pages/SearchPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import FicLayout from "@/fic/Layout";
import Discover from "@/fic/pages/Discover";
import StoryDetail from "@/fic/pages/StoryDetail";
import Reader from "@/fic/pages/Reader";
import Studio from "@/fic/pages/Studio";
import LibraryPage from "@/fic/pages/LibraryPage";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthPage from "@/fic/pages/AuthPage";
import AuthorPage from "@/fic/pages/AuthorPage";
import Profile from "@/fic/pages/Profile";
import Account from "@/fic/pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Ruta principal configurada para mostrar el Login al entrar */}
              <Route element={<FicLayout />}>
                <Route index element={<AuthPage mode="login" />} />
                <Route path="descubrir" element={<Discover />} />
                <Route path="historia/:id" element={<StoryDetail />} />
                <Route path="biblioteca" element={<LibraryPage />} />
                <Route path="estudio" element={<Studio />} />
                <Route path="autor/:handle" element={<AuthorPage />} />
                <Route path="buscar" element={<SearchPage />} />
                <Route path="perfil" element={<Profile />} />
                <Route path="cuenta" element={<Account />} />
              </Route>
              <Route path="login" element={<AuthPage mode="login" />} />
              <Route path="registro" element={<AuthPage mode="register" />} />
              <Route path="leer/:id/:ch" element={<Reader />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;