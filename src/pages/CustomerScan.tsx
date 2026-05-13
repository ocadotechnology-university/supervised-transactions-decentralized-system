import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QrScanHandler from "../components/QrScanHandler";
import type { Transaction} from "../utils/types.ts";

const TRANSACTIONS_KEY = "customerTransactions";

export default function CustomerScan() {
    const navigate = useNavigate();

    const handleScanSuccess = useCallback(
        (scanResults: string) => {
            try {
                const parsedResults = JSON.parse(scanResults);

                const isValid =
                    typeof parsedResults.message.name === "string" &&
                    typeof parsedResults.message.points === "number" &&
                    typeof parsedResults.message.id === "string" &&
                    typeof parsedResults.message.timestamp === "number" &&
                    typeof parsedResults.signature === "string";

                if (!isValid) {
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