export interface Game {
    _id: string;
    title: string;
    cheapestPrice: number;
    thumb: string;
    steamUrl: string;
    steamAppID: number;
    externalID: string;
}


export interface GameSearchResult {
    gameID: string;
    external: string;
    thumb: string;
    steamAppID: string | number;
    cheapest: string | number;
    formattedPrice?: string;
    currency: 'BRL' | 'USD';
    priceSource: string
}

export interface CreateGameModalProps {
  onSuccess: () => void;
}