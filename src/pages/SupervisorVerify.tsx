import QrScanHandler from "../components/QrScanHandler";
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Transaction, TraderEntry } from "../utils/types.ts";
import {importKey, verifyData, encodeData, base64ToBuffer, generateId} from "../utils/crypto";
import {Button, ButtonContainer} from "../styles/common.styles.ts";
import {AdditionalButtonWrapper, SequenceScannerWrapper} from "../styles/SupervisorVerify.styles.ts";

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
}

export default function SupervisorVerify() {
    const navigate = useNavigate();
    const [scannedQrCount, setScannedQrCount] = useState<number>(0);
    const [expectedQrCount, setExpectedQrCount] = useState<number | null>(null);
    const [pendingQrCount, setPendingQrCount] = useState<number>(0);

    const expectedQrCountRef = useRef<number | null>(null);
    const currentCustomerRef = useRef<string | null>(null);
    const seenRawQrRef = useRef<Set<string>>(new Set());
    const seenSignaturesRef = useRef<Set<string>>(new Set());
    const pendingVerificationsRef = useRef<Set<string>>(new Set());

    const successfulTransactionsRef = useRef<Transaction[]>([]);
    const pointsDeductionMapRef = useRef<Map<string, number>>(new Map());
    const totalPointsRef = useRef<number>(0);
    const errorsRef = useRef<string[]>([]);

    const isFinalizingRef = useRef<boolean>(false);

    const finalizeSequence = useCallback((totalExpected: number) => {
        if (isFinalizingRef.current) {
            return;
        }
        isFinalizingRef.current = true;

        const storedTraders = localStorage.getItem(TRADERS_KEY);
        const allTraders: TraderEntry[] = storedTraders ? JSON.parse(storedTraders) : [];

        const successfulTransactions = successfulTransactionsRef.current;

        if (successfulTransactions.length > 0) {
            const updatedTraders = allTraders.map(trader => {
                const deduction = pointsDeductionMapRef.current.get(trader.name);
                if (deduction) {
                    return { ...trader, points: trader.points - deduction };
                }
                return trader;
            });
            localStorage.setItem(TRADERS_KEY, JSON.stringify(updatedTraders));

            for (const transaction of successfulTransactions) {
                localStorage.setItem(transaction.signature, JSON.stringify(transaction));
            }

            const title = successfulTransactions.length === totalExpected ? "VERIFICATION SUCCESSFUL" : "PARTIAL VERIFICATION";

            navigate("/supervisor/verify/results", {
                state: {
                    title: title,
                    subtitle: `Verified ${successfulTransactions.length} of ${totalExpected} transactions for customer ${currentCustomerRef.current}`,
                    points: totalPointsRef.current,
                    errors: errorsRef.current,
                    path: "/supervisor"
                }
            });
        } else {
            navigate("/supervisor/verify/results", {
                state: {
                    title: "VERIFICATION FAILED",
                    subtitle: `Verified 0 of ${totalExpected} transactions for customer ${currentCustomerRef.current}`,
                    errors: errorsRef.current,
                    path: "/supervisor"
                }
            });
        }
    }, []);

    const handleScanSuccess = useCallback((scanResults: string) => {
            if (isFinalizingRef.current) {
                return;
            }

            if (seenRawQrRef.current.has(scanResults)) {
                return;
            }
            seenRawQrRef.current.add(scanResults);

            try {
                const parsedResults = JSON.parse(scanResults);

                if (!validateQrData(parsedResults)) {
                    if (expectedQrCountRef.current === null) {
                        navigate("/supervisor/verify/results", {
                            state: {
                                title: "VERIFICATION FAILED",
                                subtitle: "Could not establish sequence.",
                                errors: ["The first scanned QR code has invalid data format."],
                                path: "/supervisor"
                            }
                        });
                        return;
                    }

                    errorsRef.current.push("Invalid QR data format.");

                    const invalidId = generateId()
                    seenSignaturesRef.current.add(invalidId)
                    setScannedQrCount(seenSignaturesRef.current.size);

                    if (seenSignaturesRef.current.size >= expectedQrCountRef.current && pendingVerificationsRef.current.size === 0) {
                        finalizeSequence(expectedQrCountRef.current);
                    }

                    return;
                }

                if (currentCustomerRef.current === null) {
                    currentCustomerRef.current = parsedResults.customerData;
                }
                if (currentCustomerRef.current !== parsedResults.customerData) {
                    errorsRef.current.push(`Transaction belongs to a different customer (${parsedResults.customerData}, current is ${currentCustomerRef.current}).`);

                    const invalidId = generateId();
                    seenSignaturesRef.current.add(invalidId);
                    setScannedQrCount(seenSignaturesRef.current.size);

                    if (expectedQrCountRef.current !== null && seenSignaturesRef.current.size >= expectedQrCountRef.current && pendingVerificationsRef.current.size === 0) {
                        finalizeSequence(expectedQrCountRef.current);
                    }
                    return;
                }

                if (seenSignaturesRef.current.has(parsedResults.signature)) {
                    return;
                }
                seenSignaturesRef.current.add(parsedResults.signature);

                const sequenceCount = parsedResults.sequence;

                if (expectedQrCountRef.current === null) {
                    setExpectedQrCount(sequenceCount);
                    expectedQrCountRef.current = sequenceCount;
                }

                setScannedQrCount(seenSignaturesRef.current.size);

                pendingVerificationsRef.current.add(parsedResults.signature);
                setPendingQrCount(pendingVerificationsRef.current.size);

                (async () => {
                    try {
                        const transactionData: Transaction = {
                            name: parsedResults.message.name,
                            points: parsedResults.message.points,
                            id: parsedResults.message.id,
                            timestamp: parsedResults.message.timestamp,
                            signature: parsedResults.signature,
                            customerData: parsedResults.customerData
                        };

                        const isDuplicate = localStorage.getItem(transactionData.signature);

                        if (isDuplicate) {
                            const originalTransaction: Transaction = JSON.parse(isDuplicate);
                            errorsRef.current.push(`Duplicate transaction (already scanned by customer ${originalTransaction.customerData}).`);
                            return;
                        }

                        const storedTraders = localStorage.getItem(TRADERS_KEY);
                        const allTraders: TraderEntry[] = storedTraders ? JSON.parse(storedTraders) : [];
                        const foundTrader = allTraders.find(trader => trader.name === transactionData.name);

                        if (!foundTrader) {
                            errorsRef.current.push(`Trader "${transactionData.name}" not found.`);
                            return;
                        }

                        const isVerified = await verifyTransactionCrypto(transactionData, parsedResults.message, foundTrader);
                        if (!isVerified) {
                            errorsRef.current.push("Signature verification failed.");
                            return;
                        }

                        const currentDeduction = pointsDeductionMapRef.current.get(transactionData.name) || 0;
                        if ((foundTrader.points - currentDeduction) < transactionData.points) {
                            errorsRef.current.push(`Insufficient points for trader ${transactionData.name}. (Needs ${transactionData.points})`);
                            return;
                        }

                        pointsDeductionMapRef.current.set(transactionData.name, currentDeduction + transactionData.points);
                        totalPointsRef.current += transactionData.points;
                        successfulTransactionsRef.current.push(transactionData);

                    } finally {
                        pendingVerificationsRef.current.delete(parsedResults.signature);
                        setPendingQrCount(pendingVerificationsRef.current.size);

                        if (seenSignaturesRef.current.size >= sequenceCount && pendingVerificationsRef.current.size === 0) {
                            finalizeSequence(sequenceCount);
                        }
                    }
                })();

            } catch (error) {
                if (expectedQrCountRef.current === null) {
                    navigate("/supervisor/verify/results", {
                        state: {
                            title: "VERIFICATION FAILED",
                            subtitle: "Could not establish sequence.",
                            errors: ["The first scanned QR code is not a transaction (Not JSON)."],
                            path: "/supervisor"
                        }
                    });
                    return;
                }

                errorsRef.current.push("QR data is not JSON.");

                const invalidId = generateId()
                seenSignaturesRef.current.add(`invalid${invalidId}`)
                setScannedQrCount(seenSignaturesRef.current.size);

                if (seenSignaturesRef.current.size >= expectedQrCountRef.current && pendingVerificationsRef.current.size === 0) {
                    finalizeSequence(expectedQrCountRef.current);
                }

                return;
            }
        },
        []
    );

    const sequenceSubtitle = expectedQrCount ? `SCANNED ${scannedQrCount} OF ${expectedQrCount}` : "";

    return (
        <SequenceScannerWrapper>
            <QrScanHandler
                title="SCAN CASHOUT"
                subtitle={sequenceSubtitle}
                scanSuccessHandler={handleScanSuccess}
            />

            {scannedQrCount > 0 && expectedQrCount && scannedQrCount < expectedQrCount && (
                <AdditionalButtonWrapper>
                    <ButtonContainer>
                        <Button
                            onClick={() => finalizeSequence(expectedQrCount)}
                            disabled={pendingQrCount > 0}
                            style={{
                                backgroundColor: pendingQrCount > 0 ? "#918f8f" : "#e55555",
                            }}
                        >
                            {pendingQrCount > 0 ? `VERIFYING ${pendingQrCount}...` : `FINISH EARLY (${successfulTransactionsRef.current.length} VALID)`}
                        </Button>
                    </ButtonContainer>
                </AdditionalButtonWrapper>
            )}
        </SequenceScannerWrapper>
    );
}