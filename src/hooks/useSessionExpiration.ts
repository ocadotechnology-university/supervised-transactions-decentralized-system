import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { STORAGE_KEYS } from "../utils/localStorageKeys";

const EXPIRATION_TIME_MS = 12 * 60 * 60 * 1000; // 12 hours
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export function useSessionExpiration() {
    const location = useLocation()

    useEffect(() => {
        const checkExpiration = () => {
            const sessionStart = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);

            if (sessionStart) {
                const now = Date.now();
                const timeElapsed = now - parseInt(sessionStart, 10);

                if (timeElapsed > EXPIRATION_TIME_MS) {
                    localStorage.clear();
                    window.location.href = '/';
                }
            }
        };

        checkExpiration();
        const timer = setInterval(checkExpiration, CHECK_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [location.pathname]);
}