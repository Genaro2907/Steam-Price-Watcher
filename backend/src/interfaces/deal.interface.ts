export interface ICheapSharkDeal {
    dealID: string;
    storeID: string;
    gameID: string;
    salePrice: string;
    normalPrice: string;
    savings: string;
    title: string;
    steamAppID: string;
    thumb: string;
}

export interface ITrendingDeal {
    dealID: string;
    title: string;
    salePrice: number;
    normalPrice: number;
    savings: number;
    steamAppID: string;
    thumb: string;
    currency: 'BRL' | 'USD';
    steamUrl: string;
}