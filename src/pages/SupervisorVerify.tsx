import { useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Transaction, TraderEntry, ScannedCashout } from "../utils/types.ts";
import { importKey, verifyData, encodeData, base64ToBuffer } from "../utils/crypto";
import { validateSupervisorQrData } from "../utils/validateQr.ts";
import { useSequenceScanner } from "../hooks/useSequenceScanner.ts";
import type { SequenceSummary } from "../hooks/useSequenceScanner.ts";
import SequenceScannerLayout from "../components/SequenceScannerLayout.tsx";
import { STORAGE_KEYS } from "../utils/localStorageKeys.ts";
import {startSession} from "../utils/startSession.ts";

const verifyTransactionCrypto = async (transactionData: Transaction, message: object, foundTrader: TraderEntry): Promise<boolean> => {
    try {
        const messageString = JSON.stringify(message);
        const messageEncoded = encodeData(messageString);
        const signatureBuffer = base64ToBuffer(transactionData.signature);
        const pubKey = await importKey(foundTrader.key, "verify");

        return await verifyData(pubKey, signatureBuffer, messageEncoded);
    }
    catch (error) {
        return false;
    }
};

export default function SupervisorVerify() {
    const navigate = useNavigate();
    const currentCustomerRef = useRef<string | null>(null);
    const pointsDeductionMapRef = useRef<Map<string, number>>(new Map());
    const allTradersRef = useRef<TraderEntry[]>([]);

    useEffect(() => {
        allTradersRef.current = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPERVISOR_TRADERS) || "[]");
    }, []);

    const processTransaction = useCallback(async (parsedData: ScannedCashout) => {
        if (!currentCustomerRef.current) {
            currentCustomerRef.current = parsedData.customerData;
        }
        if (currentCustomerRef.current !== parsedData.customerData) {
            return { error: `Transaction belongs to a different customer (${parsedData.customerData}, currently scanning is ${currentCustomerRef.current}).` };
        }

        const transactionData: Transaction = {
            name: parsedData.message.name,
            points: parsedData.message.points,
            id: parsedData.message.id,
            timestamp: parsedData.message.timestamp,
            signature: parsedData.signature,
            customerData: parsedData.customerData
        };

        if (localStorage.getItem(transactionData.signature)) {
            const originalTransaction = JSON.parse(localStorage.getItem(transactionData.signature)!);
            return { error: `Duplicate transaction (already scanned by customer ${originalTransaction}).` };
        }

        const foundTrader = allTradersRef.current.find(transaction => transaction.name === transactionData.name);
        if (!foundTrader) {
            return { error: `Trader "${transactionData.name}" not found.` };
        }

        const isVerified = await verifyTransactionCrypto(transactionData, parsedData.message, foundTrader);
        if (!isVerified) {
            return { error: "Signature verification failed." };
        }

        const currentDeduction = pointsDeductionMapRef.current.get(transactionData.name) || 0;
        if ((foundTrader.points - currentDeduction) < transactionData.points) {
            return { error: `Insufficient points for trader ${transactionData.name} (needs ${transactionData.points}).` };
        }

        pointsDeductionMapRef.current.set(transactionData.name, currentDeduction + transactionData.points);
        return { transaction: transactionData, points: transactionData.points };
    }, []);

    const onFinalize = useCallback((summary: SequenceSummary) => {
        if (summary.successfulTransactions.length > 0) {
            startSession()

            const updatedTraders = allTradersRef.current.map(trader => {
                const deduction = pointsDeductionMapRef.current.get(trader.name);
                return deduction ? { ...trader, points: trader.points - deduction } : trader;
            });
            localStorage.setItem(STORAGE_KEYS.SUPERVISOR_TRADERS, JSON.stringify(updatedTraders));
            summary.successfulTransactions.forEach(transaction => localStorage.setItem(transaction.signature, JSON.stringify(transaction.customerData)));

            const currentRanking = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPERVISOR_RANKING) || "{}");
            const rankingPointsTotal = currentCustomerRef.current ? (currentRanking[currentCustomerRef.current] || 0) + summary.totalPoints : summary.totalPoints;
            if (currentCustomerRef.current) {
                const updatedRanking = { ...currentRanking, [currentCustomerRef.current]: rankingPointsTotal };
                localStorage.setItem(STORAGE_KEYS.SUPERVISOR_RANKING, JSON.stringify(updatedRanking));
            }

            const title = summary.successfulTransactions.length === summary.totalExpected ? "Verification successful" : "Partial verification";
            navigate("/supervisor/verify/results", {
                state: {
                    title,
                    subtitle: `Verified ${summary.successfulTransactions.length} of ${summary.totalExpected} transactions for customer ${currentCustomerRef.current}`,
                    points: summary.totalPoints,
                    errors: summary.errors,
                    path: "/supervisor"
                }
            });
        } else {
            navigate("/supervisor/verify/results", {
                state: {
                    title: "Verification failed",
                    subtitle: `Verified 0 of ${summary.totalExpected} transactions for customer ${currentCustomerRef.current}`,
                    errors: summary.errors,
                    path: "/supervisor"
                }
            });
        }
    }, []);

    const onFatalError = useCallback((errorMsg: string) => {
        navigate("/supervisor/verify/results", {
            state: {
                title: "Verification failed",
                subtitle: "Could not establish sequence.",
                errors: [errorMsg],
                path: "/supervisor"
            }
        });
    }, []);

    const scanner = useSequenceScanner<ScannedCashout>({
        validateData: validateSupervisorQrData,
        getSequenceInfo: (data) => ({ sequence: data.sequence, signature: data.signature }),
        processTransaction,
        onFinalize,
        onFatalSequenceError: onFatalError
    });

    return (
        <SequenceScannerLayout
            title="Scan cashout"
            expectedQrCount={scanner.expectedQrCount}
            scannedQrCount={scanner.scannedQrCount}
            pendingQrCount={scanner.pendingQrCount}
            successfulCount={scanner.successfulCount}
            onScanSuccess={scanner.handleScanSuccess}
            onFinalizeEarly={scanner.finalizeEarly}
        />
    );
}