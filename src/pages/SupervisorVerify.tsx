import QrScanHandler from "../components/QrScanHandler";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Transaction, TraderEntry } from "../utils/types.ts";
import { importPublicKey, verifyData, encodeData, base64ToBuffer } from "../utils/cryptoutils";

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
        const pubKey = await importPublicKey(foundTrader.key)
        const isVerified = await verifyData(pubKey, signatureBuffer, messageEncoded);

        if (!isVerified) {
            return false;
        }
    }
    catch (error) {
        return false;
    }
    
    if (foundTrader.points >= transactionData.points) {
        foundTrader.points -= transactionData.points;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
        return true;
    }
    
    return false;
}

export default function SupervisorVerify(){
    const navigate = useNavigate();

    const handleScanSuccess = useCallback(
        async (decodedString: string) => {
            try {
                const data = JSON.parse(decodedString);

                const isValid =
                    typeof data.customerData === "string" &&
                    typeof data.message.name === "string" &&
                    typeof data.message.points === "number" &&
                    typeof data.message.id === "string" &&
                    typeof data.message.timestamp === "number" &&
                    typeof data.signature === "string";

                if (!isValid) {
                    console.error("Invalid data structure");
                    navigate("/supervisor/verify/results", { state: { success: false } });
                    return;
                }

                const transactionData = {
                    name: data.message.name,
                    points: data.message.points,
                    id: data.message.id,
                    timestamp: data.message.timestamp,
                    signature: data.signature,
                    customerData: data.customerData
                };
                
                if(localStorage.getItem(transactionData.signature)) {
                    // token is used
                    navigate("/supervisor/verify/results", { state: { success: false } })
                    return;
                }

                const verifyResult = await verifyTransaction(transactionData, data.message);

                if(verifyResult) {
                    // trader is real and has pool
                    localStorage.setItem(transactionData.signature, JSON.stringify(transactionData))
                    navigate("/supervisor/verify/results", { state: { success: true, transactionPoints: transactionData.points, customerData: data.customerData } })
                }
                else {
                    navigate("/supervisor/verify/results", { state: { success: false } })
                }
            } catch (e) {
                console.error("Invalid QR payload", e);
                navigate("/supervisor/verify/results", { state: { success: false } });
            }
        },
        []
    );

    return (
        <QrScanHandler
            title="SCAN CASHOUT"
            scanSuccessHandler = { handleScanSuccess }
        />
    );
}