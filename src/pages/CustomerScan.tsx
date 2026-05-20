import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QrScanHandler from "../components/QrScanHandler";
import type { Transaction} from "../utils/types.ts";

type ScannedTransaction = {
    message: {
        name: string;
        points: number;
        id: string;
        timestamp: number;
    };
    signature: string;
};

const TRANSACTIONS_KEY = "customerTransactions";

const validateQrData = (data: any): data is ScannedTransaction => {
    return !!(
        data &&
        data.message &&
        typeof data.message.name === "string" &&
        typeof data.message.points === "number" &&
        typeof data.message.id === "string" &&
        typeof data.message.timestamp === "number" &&
        typeof data.signature === "string"
    );
};

export default function CustomerScan() {
    const navigate = useNavigate();

    const handleScanSuccess = useCallback(
        (scanResults: string) => {
            try {
                const parsedResults = JSON.parse(scanResults);

                if (!validateQrData(parsedResults)) {
                    navigate("/customer/scan/results", {
                        state: {
                            title: "INVALID QR CODE",
                            path: "/customer"
                        } });
                    return;
                }

                const newTransaction: Transaction = {
                    name: parsedResults.message.name,
                    points: parsedResults.message.points,
                    id: parsedResults.message.id,
                    timestamp: parsedResults.message.timestamp,
                    signature: parsedResults.signature
                };

                const storedTransactions = localStorage.getItem(TRANSACTIONS_KEY)
                const allTransactions: Transaction[] = storedTransactions ? JSON.parse(storedTransactions) : [];

                if (allTransactions.some((transaction) => transaction.id === newTransaction.id)) {
                    navigate("/customer/scan/results", {
                        state: {
                            title: "TRANSACTION FAILED",
                            subtitle: "DUPLICATE TRANSACTION",
                            path: "/customer"
                        } });
                    return;
                }

                const updatedTransactions = [...allTransactions, newTransaction];
                localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
                navigate("/customer/scan/results", {
                    state: {
                        title: "YOU GOT",
                        points: newTransaction.points,
                        path: "/customer"
                    } });

            } catch (error) {
                console.error("Invalid QR payload", error);
                navigate("/customer/scan/results", {
                    state: {
                        title: "TRANSACTION FAILED",
                        path: "/customer"
                    } });
                return;
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