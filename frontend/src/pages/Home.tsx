import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Game } from "@/interfaces/home.interfaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CreateGameModal } from "@/components/CreateGameModal";
import { 
  Trash2, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  User,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ModeToggle } from "@/components/mode-toggle";

export function Home() {
  const { signOut, user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  async function loadGames() {
    try {
      const response = await api.get("/v1/games");
      setGames(response.data);
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveGame(externalID: string) {
    try {
      await api.delete(`/v1/games/${externalID}`);
      setGames((oldGames) => oldGames.filter(game => game.externalID !== externalID));
      toast({
        title: "Jogo removido",
        description: "Voce parou de monitorar esse jogo com sucesso.",
        className: "bg-green-500 text-white-border-none",
      })
    } catch (error) {
      console.error("Erro ao remover jogo", error);
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Não foi possivel remover o jogo. Tente novamente."
      })
    }
  }

  useEffect(() => {
    loadGames();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 flex flex-col fixed h-full z-10 hidden md:flex">
        {/* Logo Area */}
        <div className="p-6 flex flex-col items-center border-b dark:border-slate-800">
          <img 
            src={logo} 
            alt="Logo RareFind" 
            className="h-20 w-auto object-contain mb-3 drop-shadow-sm" 
          />
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            RareFind
          </h1>
        </div>

        {/* Menu Links */}
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-2" size="lg">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          
          <Button variant="ghost" className="w-full justify-start gap-2 text-slate-500" size="lg">
            <User className="h-4 w-4" />
            Perfil
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-2 text-slate-500" size="lg">
            <Settings className="h-4 w-4" />
            Configurações
          </Button>
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-sm font-medium truncate max-w-[120px]" title={user?.name}>
                    {user?.name}
                </span>
                <span className="text-xs text-slate-400 truncate max-w-[120px]">
                    {user?.email}
                </span>
             </div>
             <ModeToggle />
          </div>
          
          <Button variant="outline" className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      {/* ml-64 empurra o conteúdo para a direita para não ficar embaixo da sidebar fixa */}
      <main className="flex-1 md:ml-64 p-8">
        
        {/* Header da Página (Título + Ação) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
                Acompanhe o preço dos seus jogos favoritos em tempo real.
            </p>
          </div>
          <CreateGameModal onSuccess={loadGames} />
        </div>

        {/* Grid de Jogos */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
             <div className="animate-pulse flex space-x-4">
                <div className="h-12 w-12 bg-slate-300 rounded-full"></div>
             </div>
             <p className="mt-4">Carregando seus jogos...</p>
          </div>
        ) : (
          <>
            {games.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-slate-500 mb-4">Você ainda não monitora nenhum jogo.</p>
                  <CreateGameModal onSuccess={loadGames} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.map((game) => (
                  <Card key={game._id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800">
                    
                    {/* Imagem (Aspect Video 16:9 - Padrão e mais compacto) */}
                    <div className="aspect-video w-full bg-slate-100 overflow-hidden relative">
                      <img 
                        src={game.thumb || "https://placehold.co/600x400?text=No+Image"} 
                        alt={game.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Badge de "Steam" flutuante (Opcional, estilo visual) */}
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white font-medium">
                        STEAM
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      {/* Título com line-clamp para não quebrar layout */}
                      <h3 className="font-semibold text-lg leading-tight truncate mb-1" title={game.title}>
                        {game.title}
                      </h3>
                      
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-xs text-slate-500 font-medium uppercase">Melhor Preço</span>
                      </div>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                        {formatCurrency(game.cheapestPrice)}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-0 flex gap-2">
                      <Button className="flex-1 gap-2" variant="secondary" asChild>
                        <a 
                          href={`https://store.steampowered.com/app/${game.steamAppID}`} 
                          target="_blank" 
                          rel="noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Ver Loja
                        </a>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover monitoramento</AlertDialogTitle>
                            <AlertDialogDescription>
                              Deseja parar de acompanhar o preço de <strong>{game.title}</strong>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Voltar</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={() => handleRemoveGame(game.externalID)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                              Confirmar Remoção
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}