import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider"
import { MyGames } from "./pages/MyGames";
import { MainLayout } from "./components/MainLayout";

const PrivateRoutes = () => {
  const { signed, loading } = useAuth();
  if (loading) return <div>Carregando...</div>;
  
  return signed ? <MainLayout /> : <Navigate to="/login" />;
};

export default function AppRouter() {
    return (
        <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Rotas Protegidas envolvidas pelo Layout */}
                <Route element={<PrivateRoutes />}>
                {/* Caminho "/" agora é o Trending Dashboard */}
                <Route path="/" element={<Home />} />
                
                {/* Caminho "/my-games" é a lista pessoal */}
                <Route path="/my-games" element={<MyGames />} />
                </Route>
            </Routes>
            <Toaster />
            </AuthProvider>
        </ThemeProvider>
        </BrowserRouter>
    );
}