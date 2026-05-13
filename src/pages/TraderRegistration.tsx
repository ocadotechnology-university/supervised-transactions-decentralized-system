import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QrScanHandler from "../components/QrScanHandler";

const TRADER_KEY = "traderData";

export default function TraderRegistration() {
    const navigate = useNavigate();

    const handleScanSuccess = useCallback(
        (scanResults: string) => {
            try {
                const parsedResults = JSON.parse(scanResults);

                const isValid =
                    typeof parsedResults.name === "string" &&
                    typeof parsedResults.points === "number" &&
                    typeof parsedResults.timestamp === "number" &&
                    !!parsedResults.key;

                if (!isValid) {
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