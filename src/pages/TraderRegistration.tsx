import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { TraderEntry } from "../utils/types.ts";
import QrScanHandler from "../components/QrScanHandler";
import { useLocalStorage } from "usehooks-ts";
import { validateTraderQrData } from "../utils/validateQr.ts";
import { STORAGE_KEYS } from "../utils/localStorageKeys.ts";

export default function TraderRegistration() {
    const navigate = useNavigate();
    const [, setTraderData] = useLocalStorage<TraderEntry | null>(STORAGE_KEYS.TRADER_DATA, null);

    const handleScanSuccess = useCallback(
        (scanResults: string) => {
            try {
                const parsedResults: TraderEntry = JSON.parse(scanResults);

                if (!validateTraderQrData(parsedResults)) {
                    navigate("/trader/register/results", {
                        state: {
                            title: "Invalid QR code",
                            path: "/",
                        } });
                    return;
                }

                setTraderData(parsedResults);

            } catch (error) {
                navigate("/trader/register/results", {
                    state: {
                        title: "Invalid QR code",
                        path: "/",
                    } });
            }
        },
        []
    );

    return (
        <QrScanHandler
            title="Scan QR code from the supervisor"
            scanSuccessHandler = { handleScanSuccess }
        />
    );
}