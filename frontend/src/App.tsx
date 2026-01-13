import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Toaster } from "@/components/ui/toaster";

const PrivateRoutes = () => {
  const { signed, loading } = useAuth();
  if(loading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>
  }

  return signed ? <Outlet /> : <Navigate to="/login" />;
};

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Rotas Publicas */}
                    <Route path="/login" element={<Login />} />

                    {/* Rotas Privadas */}
                    <Route element={<PrivateRoutes />}>
                        {/* Aqui você coloca o componente que antes era o seu App principal (Dashboard) */}
                        <Route path="/" element={<Home />} />  
                        {/* Futuramente: <Route path="/game/new" element={<CreateGame />} /> */}  
                    </Route> 
                </Routes>
                <Toaster />
            </AuthProvider>
        </BrowserRouter>
    )
}