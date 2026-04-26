import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ScanQR from "../components/ScanQR";
import "../styles.css";

export default function TraderRegistration() {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState<boolean>(false);

    const handleScanSuccess = useCallback(
        (decodedString: string) => {
            try {
                const data = JSON.parse(decodedString);

                const isValid =
                    typeof data.name === "string" &&
                    typeof data.points === "number" &&
                    typeof data.timestamp === "number" &&
                    !!data.privateKey;

                if (!isValid) {
                    console.error("Invalid payload structure");
                    return;
                }

                localStorage.setItem("traderPayload", decodedString);

                setIsScanning(false);
                navigate("/trader/traderMain");
            } catch (e) {
                console.error("Invalid QR payload", e);
            }
        },
        [navigate]
    );

    return (
        <div className="screen">
            <h1 className="title">SCAN SUPERVISOR CODE</h1>

            {!isScanning ? (
                <button className="button" onClick={() => setIsScanning(true)}>
                    SCAN
                </button>
            ) : (
                <>
                    <div className="scannerWrapper">
                        <ScanQR scanSuccess={handleScanSuccess} />
                    </div>

                    <button
                        className="button"
                        onClick={() => {
                            setIsScanning(false);
                            navigate("/");
                        }}
                    >
                        BACK
                    </button>
                </>
            )}
        </div>
    );
}