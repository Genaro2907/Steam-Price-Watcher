import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Game } from "@/interfaces/home.interfaces";
import api from "@/services/api";
import { useEffect, useState } from "react";

export function Home() {
    const { signOut, user } = useAuth();
    const [games, setGames] = useState<Game[]>([]);
    const [ loading, setLoading] = useState(true);

    useEffect(() => {
        async function  loadGames() {
            try {
                const response = await api.get("/v1/games");
                setGames(response.data);
            } catch (error) {
                console.error("Erro ao buscar jogos:", error);
            } finally {
                setLoading(false);
            }
        }
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
            {/*Header Simples*/}
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Steam Price Watcher</h1>
                    <p className="text-sm text-slate-500"> Olá, {user?.name}</p>
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
                            <Button>Adicionar Novo Jogo</Button>
                        </div>
                        {/*Grid de Cards*/}
                        { games.length === 0 ? (
                            <p className="text-slate-500">Nenhum jogo cadastrado ainda.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {games.map((game) => (
                                <Card key={game._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    {/* Imagem do Jogo (placeholder se não tiver) */}
                                    <div className="h-48 w-full bg-slate-200 overflow-hidden relative">
                                        {/* Usando object-cover para a imagem preencher sem distorcer */}
                                        <img 
                                            src={game.imageUrl || "https://placehold.co/600x400?text=No+Image"} 
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
                                            {formatCurrency(game.price)}
                                        </p>
                                    </CardContent>

                                    <CardFooter>
                                        <Button className="w-full" variant="secondary" asChild>
                                            <a href={game.steamUrl} target="_blank" rel="noreferrer">
                                                Ver na Steam
                                            </a>
                                        </Button>
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