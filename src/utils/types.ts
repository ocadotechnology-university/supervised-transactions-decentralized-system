export type Transaction = {
    name: string;
    points: number;
    id: string;
    timestamp: number;
    signature: string;
}

export type CustomerEntry = {
    name: string;
    id: string;
    timestamp: number;
}

export type TraderEntry = {
    name: string;
    points: number,
    key: JsonWebKey;
    timestamp: number;
};