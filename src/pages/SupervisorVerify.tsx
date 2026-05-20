import QrScanHandler from "../components/QrScanHandler";
import {useCallback, useState} from "react";
import { useNavigate } from "react-router-dom";
import type { Transaction, TraderEntry } from "../utils/types.ts";
import { importPublicKey, verifyData, encodeData, base64ToBuffer } from "../utils/cryptoutils";

type ScannedCashout = {
    sequence: number;
    customerData: string;
    message: {
        name: string;
        points: number;
        id: string;
        timestamp: number;
    };
    signature: string;
};

const TRADERS_KEY = "traders";

const validateQrData = (data: any): data is ScannedCashout => {
    return !!(
        data &&
        data.message &&
        typeof data.sequence === "number" &&
        typeof data.customerData === "string" &&
        typeof data.message.name === "string" &&
        typeof data.message.points === "number" &&
        typeof data.message.id === "string" &&
        typeof data.message.timestamp === "number" &&
        typeof data.signature === "string"
    );
}

const verifyTransaction = async (transactionData: Transaction, message: object): Promise<boolean> => {
    const storedTraders = localStorage.getItem(TRADERS_KEY)
    const allTraders: TraderEntry[] = storedTraders ? JSON.parse(storedTraders) : [];

    const foundTrader = allTraders.find(trader => trader.name === transactionData.name);
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
        const updatedPoints = foundTrader.points - transactionData.points;

        const updatedTraders = allTraders.map(trader => trader.name === transactionData.name ? { ...trader, points: updatedPoints } : trader);

        localStorage.setItem(TRADERS_KEY, JSON.stringify(updatedTraders))
        return true;
    }
    
    return false;
}

export default function SupervisorVerify(){
    const navigate = useNavigate();
    const [scannedQrCount, setScannedQrCount] = useState<number>(0);
    const [expectedQrCount, setExpectedQrCount] = useState<number>(0);

    const handleScanSuccess = useCallback(
        async (scanResults: string) => {
            try {
                const parsedResults = JSON.parse(scanResults);

                if (!validateQrData(parsedResults)) {
                    console.error("Invalid data structure");
                    navigate("/supervisor/verify/results", {
                        state: {
                            title: "INVALID QR CODE",
                            path: "/supervisor"
                        } });
                    return;
                }

                const transactionData: Transaction = {
                    name: parsedResults.message.name,
                    points: parsedResults.message.points,
                    id: parsedResults.message.id,
                    timestamp: parsedResults.message.timestamp,
                    signature: parsedResults.signature,
                    customerData: parsedResults.customerData
                };
                
                if(localStorage.getItem(transactionData.signature)) {
                    // token is used
                    navigate("/supervisor/verify/results", {
                        state: {
                            title: "INVALID TRANSACTION",
                            subtitle: "DUPLICATE TRANSACTION",
                            path: "/supervisor"
                        } });
                    return;
                }

                const verifyResult = await verifyTransaction(transactionData, parsedResults.message);

                if(verifyResult) {
                    // trader is real and has pool
                    localStorage.setItem(transactionData.signature, JSON.stringify(transactionData))
                    navigate("/supervisor/verify/results", {
                        state: {
                            title: "VERIFICATION SUCCESSFUL",
                            subtitle: parsedResults.customerData,
                            points: transactionData.points,
                            path: "/supervisor"
                        } });
                }
                else {
                    navigate("/supervisor/verify/results", {
                        state: {
                            title: "VERIFICATION FAILED",
                            path: "/supervisor"
                        } });
                }
            } catch (error) {
                console.error("Invalid QR payload", error);
                navigate("/supervisor/verify/results", {
                    state: {
                        title: "VERIFICATION FAILED",
                        path: "/supervisor"
                    } });
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