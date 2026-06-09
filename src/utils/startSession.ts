import { STORAGE_KEYS } from "./localStorageKeys";

export const startSession = () => {
    const existingSession = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
    if (!existingSession) {
        localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, Date.now().toString());
    }
};