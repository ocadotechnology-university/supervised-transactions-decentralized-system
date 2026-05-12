import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QrScanHandler from "../components/QrScanHandler";
import type { Transaction } from "../utils/types.ts";

function addToStorage(transactionData: Transaction) {
    const STORAGE_KEY = "customerTransactions";
    let transactionAll: Transaction[] = [];

    const transactionStored = localStorage.getItem(STORAGE_KEY)
    if (transactionStored) {
        transactionAll = JSON.parse(transactionStored)
        //check for duplicates
        if (transactionAll.some((transaction) => transaction.id === transactionData.id)) {
            return false;
        }
    }

    transactionAll.push(transactionData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactionAll));
    return true;
}

export default function CustomerScan() {
    const navigate = useNavigate();

    const handleScanSuccess = useCallback(
        (result: string) => {
            try {
                const data = JSON.parse(result);

                const isValid =
                    typeof data.message.name === "string" &&
                    typeof data.message.points === "number" &&
                    typeof data.message.id === "string" &&
                    typeof data.message.timestamp === "number" &&
                    typeof data.signature === "string";

                if (!isValid) {
                    console.error("Invalid data structure");
                    navigate("/customer/scan/results", { state: { success: false } });
                    return;
                }

                const transactionData: Transaction = {
                    name: data.message.name,
                    points: data.message.points,
                    id: data.message.id,
                    timestamp: data.message.timestamp,
                    signature: data.signature
                };

                if(addToStorage(transactionData)) {
                    navigate("/customer/scan/results", { state: { success: true, transactionPoints: transactionData.points} });
                } else {
                    navigate("/customer/scan/results", { state: { success: false, duplicate: true} });
                }
            } catch (error) {
                console.error("Invalid QR payload", error);
                navigate("/customer/scan/results", { state: { success: false } });
            }
        },
        []
    );

    return (
        <QrScanHandler
            title="SCAN TRANSACTION"
            scanSuccessHandler = { handleScanSuccess }
        />
    );
}