import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Game } from "@/interfaces/home.interfaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateGameModal } from "@/components/CreateGameModal";
import { Trash2 } from "lucide-react"; 
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

export function Home() {
  const { signOut, user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

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
      
    } catch (error) {
      console.error("Erro ao remover jogo", error);
      alert("Erro ao remover monitoramento.");
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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Steam Price Watcher</h1>
          <p className="text-sm text-slate-500">Olá, {user?.name}</p>
        </div>
        <Button variant="outline" onClick={signOut}>
          Sair
        </Button>
      </header>

      <main className="container mx-auto p-6">
        {loading ? (
          <div className="text-center py-10">Carregando seus jogos...</div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold tracking-tight">Meus Jogos Monitorados</h2>
              <CreateGameModal onSuccess={loadGames} />
            </div>

            {games.length === 0 ? (
              <p className="text-slate-500">Nenhum jogo cadastrado ainda.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <Card key={game._id} className="overflow-hidden hover:shadow-lg transition-shadow relative group">
                    
                    {/* Imagem */}
                    <div className="h-48 w-full bg-slate-200 overflow-hidden relative">
                      <img 
                        src={game.thumb || "https://placehold.co/600x400?text=No+Image"} 
                        alt={game.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg truncate" title={game.title}>
                        {game.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(game.cheapestPrice)}
                      </p>
                    </CardContent>
                    
                    {/* Footer com Ações */}
                    <CardFooter className="flex gap-2">
                      {/* Botão Steam (Principal) */}
                      <Button className="flex-1" variant="secondary" asChild>
                        <a 
                          href={`https://store.steampowered.com/app/${game.steamAppID}`} 
                          target="_blank" 
                          rel="noreferrer"
                        >
                          Ver na Steam
                        </a>
                      </Button>

                      {/* NOVO: Botão de Deletar com Confirmação */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" title="Parar de monitorar">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Parar de monitorar?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Você tem certeza que deseja remover <strong>{game.title}</strong> da sua lista? 
                              Você terá que adicioná-lo novamente se mudar de ideia.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            {/* A ação de deletar acontece aqui */}
                            <AlertDialogAction 
                                onClick={() => handleRemoveGame(game.externalID)}
                                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            >
                              Sim, remover
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