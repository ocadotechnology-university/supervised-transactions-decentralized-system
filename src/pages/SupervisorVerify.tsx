import ScanQR from "../components/ScanQR";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import {
    importPublicKey,
    verifyData,
    encodeData,
    base64ToBuffer
} from "../utils/cryptoutils";

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

async function verifyTransaction(transactionData: Transaction, message: object){
    const STORAGE_KEY = "traders";
    
    let stored: TraderEntry[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );

    const foundTrader = stored.find(trader => trader.name === transactionData.name);
    if (!foundTrader) {
        return false;
    }

    try {
        const messageString = JSON.stringify(message);
        const messageEncoded = encodeData(messageString);
        const signatureBuffer = base64ToBuffer(transactionData.signature);
        const pubKey = await importPublicKey(foundTrader.publicKey)
        const isVerified = await verifyData(pubKey, signatureBuffer, messageEncoded);

        if (!isVerified) {
            return false;
        }
    }
    catch (error) {
        return false;
    }
    
    if(foundTrader.points >= transactionData.points){
        foundTrader.points -= transactionData.points;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
        return true;
    }
    
    return false;
}

export default function SupervisorVerify(){
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState<boolean>(false);

    const handleScanSuccess = useCallback(
        async (decodedString: string) => {
            try {
                const data = JSON.parse(decodedString);

                const isValid =
                    typeof data.customerData === "string" &&
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
                
                if(localStorage.getItem(transactionData.signature)) {
                    // token is used
                    setIsScanning(false);
                    navigate("/supervisor/verify/results", { state: { success: false } })
                    return;
                }

                const verifyResult = await verifyTransaction(transactionData, data.message);

                if(verifyResult) {
                    // trader is real and has pool
                    localStorage.setItem(transactionData.signature, JSON.stringify(data))
                    setIsScanning(false);
                    navigate("/supervisor/verify/results", { state: { success: true, transactionPoints: transactionData.points, customerData: data.customerData } })
                }
                else {
                    setIsScanning(false);
                    navigate("/supervisor/verify/results", { state: { success: false } })
                }
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