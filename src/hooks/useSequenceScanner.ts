import { useState, useRef, useCallback } from "react";
import { generateId } from "../utils/crypto.ts";
import type { Transaction } from "../utils/types.ts";

export type SequenceSummary = {
    successfulTransactions: Transaction[];
    totalPoints: number;
    errors: string[];
    totalExpected: number;
}

export type UseSequenceScannerProps<T> = {
    validateData: (data: any) => data is T;
    getSequenceInfo: (data: T) => { sequence: number; signature: string };
    processTransaction: (data: T) => Promise<{ transaction?: Transaction; points?: number; error?: string }>;
    onFinalize: (summary: SequenceSummary) => void;
    onFatalSequenceError: (errorMsg: string) => void;
}

export function useSequenceScanner<T>(props: UseSequenceScannerProps<T>) {
    const [scannedQrCount, setScannedQrCount] = useState<number>(0);
    const [expectedQrCount, setExpectedQrCount] = useState<number | null>(null);
    const [pendingQrCount, setPendingQrCount] = useState<number>(0);

    const expectedQrCountRef = useRef<number | null>(null);
    const seenRawQrRef = useRef<Set<string>>(new Set());
    const seenSignaturesRef = useRef<Set<string>>(new Set());
    const pendingVerificationsRef = useRef<Set<string>>(new Set());

    const successfulTransactionsRef = useRef<Transaction[]>([]);
    const totalPointsRef = useRef<number>(0);
    const errorsRef = useRef<string[]>([]);
    const isFinalizingRef = useRef<boolean>(false);

    const triggerFinalize = useCallback((totalExpected: number) => {
        if (isFinalizingRef.current) {
            return;
        }
        isFinalizingRef.current = true;

        props.onFinalize({
            successfulTransactions: successfulTransactionsRef.current,
            totalPoints: totalPointsRef.current,
            errors: errorsRef.current,
            totalExpected,
        });
    }, [props]);

    const checkAndFinalize = useCallback(() => {
        if (
            expectedQrCountRef.current !== null &&
            seenSignaturesRef.current.size >= expectedQrCountRef.current &&
            pendingVerificationsRef.current.size === 0
        ) {
            triggerFinalize(expectedQrCountRef.current);
        }
    }, [triggerFinalize]);

    const handleTransactionError = useCallback((errMsg: string, isFatal: boolean) => {
        if (isFatal) {
            props.onFatalSequenceError(errMsg);
            return;
        }
        errorsRef.current.push(errMsg);
        seenSignaturesRef.current.add(`invalid-${generateId()}`);
        setScannedQrCount(seenSignaturesRef.current.size);
        checkAndFinalize();
    }, [props, checkAndFinalize]);

    const handleScanSuccess = useCallback((scanResults: string) => {
        if (isFinalizingRef.current || seenRawQrRef.current.has(scanResults)) {
            return;
        }
        seenRawQrRef.current.add(scanResults);

        try {
            const parsedResults = JSON.parse(scanResults);

            if (!props.validateData(parsedResults)) {
                handleTransactionError("Invalid QR data format.", expectedQrCountRef.current === null);
                return;
            }

            const { sequence, signature } = props.getSequenceInfo(parsedResults);

            if (seenSignaturesRef.current.has(signature)) {
                return;
            }
            seenSignaturesRef.current.add(signature);

            if (expectedQrCountRef.current === null) {
                setExpectedQrCount(sequence);
                expectedQrCountRef.current = sequence;
            }

            setScannedQrCount(seenSignaturesRef.current.size);
            pendingVerificationsRef.current.add(signature);
            setPendingQrCount(pendingVerificationsRef.current.size);

            (async () => {
                try {
                    const result = await props.processTransaction(parsedResults);
                    if (result.error) {
                        errorsRef.current.push(result.error);
                    } else if (result.transaction) {
                        successfulTransactionsRef.current.push(result.transaction);
                        totalPointsRef.current += (result.points || 0);
                    }
                } catch (error) {
                    errorsRef.current.push("Processing error occurred.");
                } finally {
                    pendingVerificationsRef.current.delete(signature);
                    setPendingQrCount(pendingVerificationsRef.current.size);
                    checkAndFinalize();
                }
            })();

        } catch (error) {
            handleTransactionError("Corrupted QR data.", expectedQrCountRef.current === null);
        }
    }, [props, handleTransactionError, checkAndFinalize]);

    return {
        scannedQrCount,
        expectedQrCount,
        pendingQrCount,
        successfulCount: successfulTransactionsRef.current.length,
        handleScanSuccess,
        finalizeEarly: () => {
            if (expectedQrCountRef.current) {
                triggerFinalize(expectedQrCountRef.current);
            }
        }
    };
}