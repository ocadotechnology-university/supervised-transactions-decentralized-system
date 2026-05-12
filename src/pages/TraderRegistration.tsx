import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QrScanHandler from "../components/QrScanHandler";


export default function TraderRegistration() {
    const navigate = useNavigate();

    const handleScanSuccess = useCallback(
        (decodedString: string) => {
            try {
                const data = JSON.parse(decodedString);

                const isValid =
                    typeof data.name === "string" &&
                    typeof data.points === "number" &&
                    typeof data.timestamp === "number" &&
                    !!data.key;

                if (!isValid) {
                    console.error("Invalid data structure");
                    return;
                }

                localStorage.setItem("traderData", decodedString);

                navigate("/trader", { replace: true });
            } catch (e) {
                console.error("Invalid QR payload", e);
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