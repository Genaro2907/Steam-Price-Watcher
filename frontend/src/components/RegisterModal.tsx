import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AxiosError } from "axios";
import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function RegisterModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const { signUp } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await signUp({
                name,
                email,
                password,
                phoneNumber: phone || undefined
            });

            toast({
                title: "Conta criada com sucesso! 🎉",
                description: "Você já está logado na plataforma.",
                className: "bg-green-600 text white border-none",
            });
            setOpen(false);
            navigate("/");
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            console.error(err);

            let msg = "Erro ao criar conta.";
            if(err.response?.status === 409) {
                msg = "Este e-mail já está em uso.";
            } else if (err.response?.data?.error) {
                msg = err.response.data.error;
            }

            toast({
                variant: "destructive",
                title: "Erro no registro",
                description: msg,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-slate-600 dark:text-slate-400">
                    Não tem uma conta? <strong>Registre-se</strong>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px">
                <DialogHeader>
                    <DialogTitle>Criar nova conta</DialogTitle>
                    <DialogDescription>
                        Preencha seus dados para começar a monitorar jogos.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleRegister} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="reg-name">Nome Completo</Label>
                        <Input
                            id="reg-name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ex: Gabriel"
                            required
                            minLength={3}
                        />
                    </div> 

                    <div className="space-y-2">
                        <Label htmlFor="reg-email">E-mail</Label>
                        <Input
                            id="reg-email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reg-phone">Celular (Opcional)</Label>
                        <Input 
                            id="reg-phone" 
                            type="tel"
                            value={phone} 
                            onChange={e => setPhone(e.target.value)} 
                            placeholder="11999999999"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="req-pass">Senha</Label>
                        <Input
                            id="req-pass"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Minimo 6 caracteres"
                            required
                            minLength={6}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : "Criar Conta"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}