import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

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
        <div className="relative flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            
            {/* 3. Posicionamento do botão no canto superior direito */}
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>

            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Acessar Plataforma</CardTitle>
                    <CardDescription>Entre para monitorar seus jogos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                "Entrar"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}