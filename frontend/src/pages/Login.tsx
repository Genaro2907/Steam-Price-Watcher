import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Globe, Layers, Loader2, Zap } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { RegisterModal } from "@/components/RegisterModal";
import logo from "@/assets/logo.png";

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { toast } = useToast();
    const { signIn } = useAuth();
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await signIn(email, password);
            
            toast({
                title: "Bem-vindo de volta! 🚀",
                description: "Login realizado com sucesso.",
                className: "bg-green-600 text-white border-none"
            });
            
            navigate('/');
        } catch(err) {
            console.error(err);
            
            toast({
                variant: "destructive",
                title: "Falha ao entrar",
                description: "Verifique seu e-mail e senha e tente novamente."
            });
            
        } finally {
            setLoading(false);
        }
    }

    return ( 
        <div className="min-h-screen grid lg:grid-cols-2">
        
        {/* --- COLUNA DA ESQUERDA (Branding Institucional) --- */}
        <div className="hidden lg:flex relative flex-col justify-between p-12 text-white overflow-hidden bg-slate-900">
            
            {/* Imagem de Fundo (Abstrata/Tech para não limitar a jogos) */}
            <div className="absolute inset-0 z-0">
                {/* Troquei para uma imagem mais abstrata/futurista */}
                <img 
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
                    alt="Abstract Tech Background" 
                    className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-900/60" />
            </div>

            {/* Header Logo */}
            <div className="relative z-10 flex items-center gap-3">
            <img src={logo} alt="RareFind Logo" className="h-10 w-auto object-contain brightness-0 invert" />
            <span className="font-bold text-2xl tracking-tight">RareFind</span>
            </div>

            {/* Copy Principal (Mais abrangente) */}
            <div className="relative z-10 space-y-6 max-w-lg">
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
                Descubra o <br/>
                <span className="text-emerald-400">Extraordinário</span>.
            </h2>
            <p className="text-slate-300 text-lg">
                Sua central de inteligência para monitoramento, análise e descobertas exclusivas. Tudo o que você precisa em um único lugar.
            </p>
            
            {/* Ícones de Funcionalidades (Genéricos para permitir expansão) */}
            <div className="flex flex-col gap-3 pt-4">
                <div className="flex items-center gap-3 text-slate-200">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Zap className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="font-medium">Performance em Tempo Real</span>
                </div>
                
                <div className="flex items-center gap-3 text-slate-200">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Layers className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="font-medium">Múltiplas Ferramentas Integradas</span>
                </div>

                <div className="flex items-center gap-3 text-slate-200">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Globe className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="font-medium">Acesso Global</span>
                </div>
            </div>
            </div>

            <footer className="relative z-10 text-sm text-slate-500">
            RareFind Platform &copy; {new Date().getFullYear()} - Inovação ao seu alcance.
            </footer>
        </div>


        {/* --- COLUNA DA DIREITA (Formulário) --- */}
        <div className="relative flex flex-col items-center justify-center p-8 bg-background transition-colors duration-300">
            
            <div className="absolute top-4 right-4 md:top-8 md:right-8">
                <ModeToggle />
            </div>

            <div className="w-full max-w-[350px] flex flex-col justify-center gap-8">
                
                <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex items-center gap-2 lg:hidden mb-4">
                    <img src={logo} alt="Logo" className="h-12" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight">
                    Acesso ao Painel
                </h1>
                <p className="text-sm text-muted-foreground">
                    Entre com suas credenciais para continuar.
                </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="exemplo@rarefind.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="h-11 bg-muted/30"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Senha</Label>
                            <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground font-normal" type="button">
                                Esqueceu a senha?
                            </Button>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            className="h-11 bg-muted/30"
                        />
                    </div>

                    <Button type="submit" className="w-full h-11 font-semibold text-base bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Autenticando...
                            </>
                        ) : (
                            "Acessar Sistema"
                        )}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-muted" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Ainda não tem acesso?
                        </span>
                    </div>
                </div>

                <div className="text-center">
                    <RegisterModal />
                </div>
            </div>
        </div>
        </div>
    )
}