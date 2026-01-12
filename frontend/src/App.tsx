import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, TrendingDown } from "lucide-react";

// Tipagem igual a do seu Backend
interface Game {
  _id: string;
  title: string;
  thumb: string;
  cheapestPrice: number;
}

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca os jogos assim que a tela abre
  useEffect(() => {
    async function loadGames() {
      try {
        const response = await api.get('/games'); // Rota do seu backend
        setGames(response.data);
      } catch (error) {
        console.error("Erro ao buscar jogos", error);
        alert("Erro ao conectar com o Backend (Verifique se ele está rodando na porta 3001!)");
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <Gamepad2 className="h-8 w-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Steam Price Watcher</h1>
              <p className="text-slate-400 text-sm">Monitorando {games.length} jogos</p>
            </div>
          </div>
          <Button variant="outline" className="border-slate-800 text-white hover:bg-slate-900">
            Adicionar Jogo
          </Button>
        </header>

        {/* Lista de Jogos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-white">Carregando jogos...</p>
          ) : games.map((game) => (
            <Card key={game._id} className="bg-slate-900 border-slate-800 overflow-hidden hover:border-emerald-500/50 transition-all">
              {/* Imagem do Jogo */}
              <div className="h-32 w-full overflow-hidden relative">
                 <img src={game.thumb} alt={game.title} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                 <div className="absolute top-2 right-2 bg-black/80 text-emerald-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    R$ {game.cheapestPrice.toFixed(2)}
                 </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg truncate" title={game.title}>
                  {game.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-8 text-xs">
                  Ver Histórico
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;