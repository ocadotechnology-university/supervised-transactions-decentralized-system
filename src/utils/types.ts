export type Transaction = {
    name: string;
    points: number;
    id: string;
    timestamp: number;
    signature: string;
    customerData?: string;
};

export type BaseMessage = {
    name: string;
    points: number;
    id: string;
    timestamp: number;
};

export type ScannedTransaction = {
    sequence?: number;
    customerData?: string;
    message: BaseMessage;
    signature: string;
};

export type ScannedCashout = {
    sequence: number;
    customerData: string;
    message: BaseMessage;
    signature: string;
};

export type CustomerEntry = {
    name: string;
    id: string;
};

export type TraderEntry = {
    name: string;
    points: number;
    key: JsonWebKey;
};

export type LeaderboardEntry = {
    customerData: string;
    points: number;
}