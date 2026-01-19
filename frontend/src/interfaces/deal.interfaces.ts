export interface ITrendingDeal {
    dealID: string;
    title: string;
    thumb: string;
    steamAppID: string;
    steamUrl: string;
    salePrice: number;
    normalPrice: number;
    savings: number;
    currency: 'BRL' | 'USD';
}