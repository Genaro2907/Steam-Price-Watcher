import { CreateGameModal } from "@/components/CreateGameModal";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Game } from "@/interfaces/home.interfaces";
import api from "@/services/api";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ExternalLink, LayoutList, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export function MyGames() {
    const [ games, setGames ] = useState<Game[]>([]);
    const [ loading, setLoading ] = useState(true);
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
                title: "Monitoramento encerrado",
                description: "Jogo removida da sua lista.",
                className: "bg-green-600 text-white border-none",
            })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao remover o jogo.",
                description: "Não foi possivel remover o jogo."
            })
        }
    }

    useEffect(() =>{
        loadGames();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <LayoutList className="text-blue-500" />
                        Meus Jogos
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Gerencie sua lista de desejos e monitoramento pessoal.
                    </p>
                </div>

                <CreateGameModal onSuccess={loadGames} />
            </div>

            { loading ? (
                <div className="text-center py-20">Carregando monitoramento...</div>
            ) : games.length === 0 ? (
                <div className="text-center py-20 border rounded-lg border-dashed">
                    <p className="text-slate-500 mb-4"> Você ainda não monitora nenhum jogo.</p>
                    <CreateGameModal onSuccess={loadGames} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <Card key={game._id} className="group overflow-hidden hover:shadow-lg transition-all border-slate-200 dark:border-slate-800">
                            <div className="aspect-video w-full bg-slate-100 overflow-hidden relative">
                                <img
                                    src={game.thumb || "https://placehold.co/600x400?text=No+Image"}
                                    alt={game.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <CardContent className="p-4">
                                <h3 className="font-semibold text-lg truncate mb-1" title={game.title}>
                                    {game.title}
                                </h3>
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(game.cheapestPrice)}
                                </p>
                            </CardContent>

                            <CardFooter className="p-4 pt-0 flex gap-2">
                                <Button className="flex-1 gap-2" variant="secondary" asChild>
                                    <a href={`https://store.steampowered.com/app/${game.steamAppID}`} target="_blank" rel="noreferrer">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogTitle> Parar monitoramento? </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Você removerá <strong>{game.title}</strong> da sua lista.
                                        </AlertDialogDescription>
                                        
                                        {/* CORREÇÃO CRÍTICA: Footer agora está DENTRO do Content */}
                                        <AlertDialogFooter>
                                            <AlertDialogCancel> Cancelar </AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleRemoveGame(game.externalID)} className="bg-red-600 hover:bg-red-700">
                                                Remover
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent> 
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}