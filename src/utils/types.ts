export type Transaction = {
    name: string;
    points: number;
    id: string;
    timestamp: number;
    signature: string;
    customerData: string;
};

export type CustomerEntry = {
    name: string;
    id: string;
    timestamp: number;
};

export type TraderEntry = {
    name: string;
    points: number;
    key: JsonWebKey;
    timestamp: number;
};

export type LeaderboardEntry = {
    customerData: string;
    points: number;
}