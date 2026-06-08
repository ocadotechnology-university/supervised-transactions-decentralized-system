import type { LeaderboardEntry } from "./types";
import {STORAGE_KEYS} from "./localStorageKeys.ts";

export function getScore(): LeaderboardEntry[] {
    const rawData = localStorage.getItem(STORAGE_KEYS.SUPERVISOR_RANKING);
    const customerScores: Record<string, number> = rawData ? JSON.parse(rawData) : {};

    return Object.entries(customerScores).map(([customerData, points]) => ({
            customerData,
            points
        }))
        .sort((a, b) => b.points - a.points);
}