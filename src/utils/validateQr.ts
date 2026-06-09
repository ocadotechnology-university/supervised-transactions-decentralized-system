import type { TraderEntry, ScannedTransaction, ScannedCashout } from "./types.ts";

export const validateTraderQrData = (data: any): data is TraderEntry => {
    return !!(
        data &&
        typeof data.name === "string" &&
        typeof data.points === "number" &&
        !!data.key
    );
};

export const validateCustomerQrData = (data: any): data is ScannedTransaction => {
    return !!(
        data &&
        data.message &&
        typeof data.message.name === "string" &&
        typeof data.message.points === "number" &&
        typeof data.message.id === "string" &&
        typeof data.message.timestamp === "number" &&
        typeof data.signature === "string" &&
        (data.sequence === undefined || typeof data.sequence === "number") &&
        (data.customerData === undefined || typeof data.customerData === "string")
    );
};

export const validateSupervisorQrData = (data: any): data is ScannedCashout => {
    return !!(
        data &&
        data.message &&
        typeof data.sequence === "number" &&
        typeof data.customerData === "string" &&
        typeof data.message.name === "string" &&
        typeof data.message.points === "number" &&
        typeof data.message.id === "string" &&
        typeof data.message.timestamp === "number" &&
        typeof data.signature === "string"
    );
};