import type { Transaction } from "./types";

function isValidTransaction(data: any): data is Transaction {
    return(
        data &&
        typeof data.customerData === "string" &&
        typeof data.points === "number" &&
        typeof data.signature === "string"
    )
}

function getSortedScores(customerScores: Record<string, number>) {
    const entries = Object.entries(customerScores);

    entries.sort((a, b) => b[1] - a[1]);

    const sortedLeaderboard = entries.map(entry => {
        return {
            customerData: entry[0],
            points: entry[1]
        };
    });

    return sortedLeaderboard;
}

function getUsedTransactions(): Transaction[] {
    const transactions: Transaction[] = [];

    const allKeys = Object.keys(localStorage);

    allKeys.forEach(key => {
        if (key === "trader" || key === "traders") {
            return;
        }

        const rawValue = localStorage.getItem(key);

        if (rawValue) {
            try {
                const parsedData = JSON.parse(rawValue);
                if(isValidTransaction(parsedData)){
                    transactions.push(parsedData);
                }
            } catch (error) {
                console.error(`Error of parsing JSON key: ${key}`, error);
            }
        }
    });

    return transactions;
}

export function calculateScore(){
    const usedTransactions = getUsedTransactions();
    const customerScores: Record<string, number> = {};

    for (const token of usedTransactions) {

        if (!token.customerData) continue;

        if(customerScores[token.customerData]) {
            customerScores[token.customerData] += token.points;
        }
        else {
            customerScores[token.customerData] = token.points;
        }
        
    }

    return getSortedScores(customerScores);
}