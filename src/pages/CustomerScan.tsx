import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Transaction, ScannedTransaction } from "../utils/types.ts";
import { validateCustomerQrData } from "../utils/validateQr.ts";
import { useSequenceScanner } from "../hooks/useSequenceScanner.ts";
import type { SequenceSummary } from "../hooks/useSequenceScanner.ts";
import SequenceScannerLayout from "../components/SequenceScannerLayout.tsx";
import { STORAGE_KEYS } from "../utils/localStorageKeys.ts";
import {startSession} from "../utils/startSession.ts";

export default function CustomerScan() {
    const navigate = useNavigate();

    const processTransaction = useCallback(async (parsedData: ScannedTransaction) => {
        const newTransaction: Transaction = {
            name: parsedData.message.name,
            points: parsedData.message.points,
            id: parsedData.message.id,
            timestamp: parsedData.message.timestamp,
            signature: parsedData.signature,
            customerData: parsedData.customerData
        };

        const allTransactions: Transaction[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER_TRANSACTIONS) || "[]");
        const isDuplicate = allTransactions.some(transaction => transaction.id === newTransaction.id);

        if (isDuplicate) {
            return { error: `Duplicate transaction (already saved to storage).` };
        }
        return { transaction: newTransaction, points: newTransaction.points };
    }, []);

    const onFinalize = useCallback((summary: SequenceSummary) => {
        const allTransactions: Transaction[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER_TRANSACTIONS) || "[]");

        if (summary.successfulTransactions.length > 0) {
            startSession()

            localStorage.setItem(STORAGE_KEYS.CUSTOMER_TRANSACTIONS, JSON.stringify([...allTransactions, ...summary.successfulTransactions]));

            const isSingle = summary.totalExpected === 1;
            const title = isSingle ? "YOU GOT" : summary.successfulTransactions.length === summary.totalExpected ? "SHARE SUCCESSFUL" : "PARTIAL SHARE";
            const subtitle = isSingle ? undefined : `Received ${summary.successfulTransactions.length} of ${summary.totalExpected} transactions`;

            navigate("/customer/scan/results", {
                state: {
                    title,
                    subtitle,
                    points: summary.totalPoints,
                    errors: summary.errors,
                    path: "/customer"
                }
            });
        } else {
            const subtitle = summary.totalExpected > 1 ? `Received 0 of ${summary.totalExpected} transactions` : undefined

            navigate("/customer/scan/results", {
                state: {
                    title: "TRANSACTION FAILED",
                    subtitle,
                    errors: summary.errors,
                    path: "/customer"
                }
            });
        }
    }, []);

    const onFatalError = useCallback((errorMsg: string) => {
        navigate("/customer/scan/results", {
            state: {
                title: "TRANSACTION FAILED",
                subtitle: "Could not establish sequence.",
                errors: [errorMsg],
                path: "/customer"
            }
        });
    }, []);

    const scanner = useSequenceScanner<ScannedTransaction>({
        validateData: validateCustomerQrData,
        getSequenceInfo: (data) => ({ sequence: data.sequence || 1, signature: data.signature }),
        processTransaction,
        onFinalize,
        onFatalSequenceError: onFatalError
    });

    return (
        <SequenceScannerLayout
            title="SCAN TRANSACTION"
            expectedQrCount={scanner.expectedQrCount}
            scannedQrCount={scanner.scannedQrCount}
            pendingQrCount={scanner.pendingQrCount}
            successfulCount={scanner.successfulCount}
            onScanSuccess={scanner.handleScanSuccess}
            onFinalizeEarly={scanner.finalizeEarly}
        />
    );
}