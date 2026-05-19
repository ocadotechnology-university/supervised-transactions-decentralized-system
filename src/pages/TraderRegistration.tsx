import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { TraderEntry } from "../utils/types.ts";
import QrScanHandler from "../components/QrScanHandler";

const TRADER_KEY = "traderData";

const validateQrData = (data: any): data is TraderEntry => {
    return !!(
        data &&
        typeof data.name === "string" &&
        typeof data.points === "number" &&
        typeof data.timestamp === "number" &&
        !!data.key
    );
};

export default function TraderRegistration() {
    const navigate = useNavigate();

    const handleScanSuccess = useCallback(
        (scanResults: string) => {
            try {
                const parsedResults = JSON.parse(scanResults);

                if (!validateQrData(parsedResults)) {
                    navigate("/trader/register/results", {
                        state: {
                            title: "INVALID QR CODE",
                            path: "/",
                        } });
                    return;
                }

                localStorage.setItem(TRADER_KEY, scanResults);
                navigate("/trader", { replace: true });

            } catch (error) {
                navigate("/trader/register/results", {
                    state: {
                        title: "INVALID QR CODE",
                        path: "/",
                    } });
            }
        },
        []
    );

    return (
        <QrScanHandler
            title="SCAN SUPERVISOR CODE"
            scanSuccessHandler = { handleScanSuccess }
        />
    );
}