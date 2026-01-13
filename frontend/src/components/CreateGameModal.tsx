import { CreateGameModalProps, GameSearchResult } from "@/interfaces/home.interfaces";
import api from "@/services/api";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { AlertCircle, Loader2, Plus, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AxiosError } from "axios";

export function CreateGameModal({ onSuccess }: CreateGameModalProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [ results, setResults] = useState<GameSearchResult[]>([]);

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingAdd, setLoadingAdd] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if(!searchTerm.trim()) return;

        setLoadingSearch(true);
        setErrorMsg("");
        setResults([]);

        try {
            const response = await api.get<GameSearchResult[]>("/v1/games/search", {
                params: { title: searchTerm }
            });
            setResults(response.data);
        } catch(err) {
            console.error("Erro na busca:", err);
            setErrorMsg("Erro ao buscar jogos. Tente novamente.");
        } finally {
            setLoadingSearch(false)
        }
    }

    async function handleMonitor(game: GameSearchResult) {
        setLoadingAdd(game.gameID);
        setErrorMsg("");

        const payload = {
            title: game.external,
            externalID: game.gameID,
            thumb: game.thumb,
            steamAppID: game.steamAppID || null,
            cheapestPrice: game.cheapest
        };

        try {
            await api.post("/v1/games/monitor", payload);

            setOpen(false);
            setSearchTerm("");
            setResults([]);
            onSuccess();
        } catch (error) {
            const err = error as AxiosError;

            if(err.response?.status === 409) {
                setErrorMsg(`Você já está monitorando "${game.external}".`);
            } else {
                setErrorMsg("Erro ao adicionar o jogo. Tente novamente.");
            }
        } finally {
            setLoadingAdd(null)
        }
    }

    const displayPrice = (game: GameSearchResult) => {
        if(game.formattedPrice) return game.formattedPrice;

        const val = Number(game.cheapest);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(isNaN(val) ? 0: val);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button className="gap-2">
            <Plus size={18} /> Adicionar Novo Jogo
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
            <DialogTitle>Monitorar Novo Jogo</DialogTitle>
            <DialogDescription>
                Busque pelo título. Usaremos nossa inteligência para encontrar o melhor preço em BRL.
            </DialogDescription>
            </DialogHeader>

            {/* Formulário de Busca */}
            <form onSubmit={handleSearch} className="flex gap-2 mt-2">
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="search" className="sr-only">Nome</Label>
                <Input
                id="search"
                placeholder="Ex: Elden Ring, Factorio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
                />
            </div>
            <Button type="submit" disabled={loadingSearch}>
                {loadingSearch ? <Loader2 className="animate-spin" /> : <Search size={18} />}
            </Button>
            </form>

            {/* Exibição de Erros */}
            {errorMsg && (
            <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
            )}

            {/* Lista de Resultados */}
            <div className="mt-4 max-h-[350px] overflow-y-auto space-y-2 pr-1">
            {results.map((game) => (
                <div 
                key={game.gameID} 
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                {/* Imagem */}
                <div className="w-16 h-10 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                    <img src={game.thumb} alt="" className="w-full h-full object-cover" />
                </div>
                
                {/* Informações */}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" title={game.external}>
                    {game.external}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{game.priceSource}</span>
                    {game.steamAppID && (
                        <span className="bg-slate-200 px-1 rounded text-[10px] text-slate-700">Steam</span>
                    )}
                    </div>
                </div>

                {/* Ação e Preço */}
                <div className="text-right flex flex-col items-end gap-1">
                    <span className={`text-sm font-bold ${game.currency === 'BRL' ? 'text-green-600' : 'text-blue-600'}`}>
                    {displayPrice(game)}
                    </span>
                    
                    <Button 
                    size="sm" 
                    variant={loadingAdd === game.gameID ? "ghost" : "secondary"}
                    disabled={loadingAdd !== null} 
                    onClick={() => handleMonitor(game)}
                    className="h-8"
                    >
                    {loadingAdd === game.gameID ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        "Monitorar"
                    )}
                    </Button>
                </div>
                </div>
            ))}

            {!loadingSearch && results.length === 0 && searchTerm && !errorMsg && (
                <div className="text-center py-8 text-slate-500 text-sm">
                Nenhum jogo encontrado com esse nome.
                </div>
            )}
            </div>

        </DialogContent>
        </Dialog>
    );
}