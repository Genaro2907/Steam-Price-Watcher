import { useAuth } from "@/context/AuthContext";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Button } from "./ui/button";
import { Gamepad2, LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export function MainLayout() {
    const { signOut, user } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* ---SIDEBAR--- */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 flex flex-col fixed h-full z-10 hidden md:flex">
                <div className="p-6 flex flex-col items-center border-b dark:border-slate-800">
                    <img
                        src={logo}
                        alt="Logo RareFind"
                        className="h-20 w-auto object-contain mb-3 drop-shadow-sm hover:scale-105 transition-transform"
                    />
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center uppercase tracking-widest">
                        Seu Monitor de Preços
                    </p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {/* Link Dashboard */}
                    <Button
                        variant={isActive("/") ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                        size="lg"
                        asChild
                    >
                        <Link to="/">
                            <LayoutDashboard className="h-4 w-4" />
                            Trending Deals
                        </Link>
                    </Button>

                    {/* Link Meus Games */}
                    <Button
                        variant={isActive("/my-games") ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                        size="lg"
                        asChild
                    >
                        <Link to="/my-games">
                            <Gamepad2 className="h-4 w-4" />
                            Meus Games
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-slate-500"
                        size="lg"
                    >
                        <User className="h-4 w-4" />
                        Perfil
                    </Button>

                    <Button 
                        variant="ghost"
                        className="w-full justify-start gap-2 text-slate-500"
                        size="lg"
                    >
                        <Settings className="h-4 w-4" />
                        Configurações
                    </Button>
                </nav>

                <div className="p-4 border-t dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium truncate max-w-[120px] dark:text-slate-200">
                                {user?.name}
                            </span>
                        </div>
                        <ModeToggle />
                    </div>

                    <Button 
                        variant="outline" 
                        className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950/30" 
                        onClick={signOut}
                    >
                        <LogOut className="h-4 w-4" />
                        Sair
                    </Button>
                </div>
            </aside>
            {/* ---ÁREA DE CONTEÚDO--- */}
            <main className="flex-1 md:ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
}