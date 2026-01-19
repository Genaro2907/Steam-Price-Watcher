import { useEffect, useState } from "react";
import api from "@/services/api";
import { ITrendingDeal } from "@/interfaces/deal.interfaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink, Flame, Loader2 } from "lucide-react";

export function Home() {
  const [deals, setDeals] = useState<ITrendingDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrending() {
      try {
        const response = await api.get<ITrendingDeal[]>("/v1/deals/trending");
        setDeals(response.data);
      } catch (error) {
        console.error("Erro ao buscar trending:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTrending();
  }, []);

  // Formatação dinâmica baseada na moeda vinda do Back
  const formatPrice = (value: number, currency: 'BRL' | 'USD') => {
    return new Intl.NumberFormat(currency === 'BRL' ? "pt-BR" : "en-US", {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
           <Flame className="text-orange-500 fill-orange-500" />
           Ofertas em Alta (Trending)
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
            As melhores oportunidades da Steam monitoradas em tempo real.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-70">
           <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
           <p className="mt-4 text-slate-500">Buscando melhores preços...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <Card key={deal.dealID} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800">
              
              <div className="aspect-video w-full bg-slate-100 overflow-hidden relative">
                <img 
                  src={deal.thumb} 
                  alt={deal.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Badge de Desconto */}
                <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded font-bold shadow-sm">
                  -{Math.round(deal.savings)}%
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg leading-tight truncate mb-1" title={deal.title}>
                  {deal.title}
                </h3>
                
                <div className="flex items-center gap-2 mt-3">
                   {/* Preço Antigo (Riscado) */}
                   <span className="text-sm text-slate-400 line-through">
                      {formatPrice(deal.normalPrice, deal.currency)}
                   </span>
                   {/* Preço Novo (Destaque) */}
                   <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                      {formatPrice(deal.salePrice, deal.currency)}
                   </span>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <Button className="w-full gap-2" variant="default" asChild>
                  <a href={deal.steamUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Ver na Loja
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}