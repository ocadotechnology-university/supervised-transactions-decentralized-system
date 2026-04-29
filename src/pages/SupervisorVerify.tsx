import ScanQR from "../components/ScanQR";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

type Transaction = {
    name: string;
    points: number;
    uuid: string;
    timestamp: number;
    signature: string;
}

type TraderEntry = {
    name: string;
    points: number,
    publicKey: JsonWebKey;
    timestamp: number;
};

function checkPool(points: number, traderName: string){
    const STORAGE_KEY = "traders";
    
    let stored: TraderEntry[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );

    const foundTrader = stored.find(trader => trader.name === traderName)
    
    if(foundTrader && foundTrader.points >= points){
        foundTrader.points -= points;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

        return true;
    }
    
    return false;
}

export default function SupervisorVerify(){
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState<boolean>(false);

    const handleScanSuccess = useCallback(
        (decodedString: string) => {
            try {
                const data = JSON.parse(decodedString);

                const isValid =
                    typeof data.message.name === "string" &&
                    typeof data.message.points === "number" &&
                    typeof data.message.uuid === "string" &&
                    typeof data.message.timestamp === "number" &&
                    typeof data.signature === "string";

                if (!isValid) {
                    console.error("Invalid data structure");
                    setIsScanning(false);
                    navigate("/supervisor/verify/results", { state: { success: false } });
                    return;
                }

                const transactionData: Transaction = {
                    name: data.message.name,
                    points: data.message.points,
                    uuid: data.message.uuid,
                    timestamp: data.message.timestamp,
                    signature: data.signature
                };
                
                const scanedTransaction = transactionData.signature
                
                if(localStorage.getItem(scanedTransaction)) {
                    // token is used
                    navigate("/supervisor/verifyTransaction/results", { state: { success: false } })
                }
                else {
                    // token isn't used
                    if(checkPool(transactionData.points, transactionData.name)) {
                        // trader is real and has pool
                        localStorage.setItem(transactionData.signature, JSON.stringify(transactionData))
                        navigate("/supervisor/verify/results", { state: { success: true } })
                    }
                    else {
                        navigate("/supervisor/verify/results", { state: { success: false } })
                    }
                }

                setIsScanning(false);
            } catch (e) {
                console.error("Invalid QR payload", e);
                setIsScanning(false);
                navigate("/supervisor/verify/results", { state: { success: false } });
            }
        },
        []
    );

    return (
        <div className="screen">
            <h1 className="title">SCAN CASHOUT</h1>

            {!isScanning ? (
                <div className="buttonContainer">
                    <button className="button" onClick={() => setIsScanning(true)}>
                        SCAN
                    </button>

                    <button className="button" onClick={() => navigate("/supervisor", { replace: true })}>
                        BACK
                    </button>
                </div>
            ) : (
                <>
                    <div className="scannerWrapper">
                        <ScanQR scanSuccess={handleScanSuccess} />
                    </div>

                    <div className="buttonContainer">
                        <button
                            className="button"
                            onClick={() => {
                                setIsScanning(false);
                                navigate("/supervisor", { replace: true });
                            }}
                        >
                            BACK
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}