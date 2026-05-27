import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QrScanHandler from "../components/QrScanHandler";
import type { Transaction } from "../utils/types.ts";
import { Button, ButtonContainer } from "../styles/common.styles.ts";
import { AdditionalButtonWrapper, SequenceScannerWrapper } from "../styles/SupervisorVerify.styles.ts";
import {generateId} from "../utils/crypto.ts";

type ScannedTransaction = {
    sequence?: number;
    customerData?: string;
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
        typeof data.signature === "string" &&
        (data.sequence === undefined || typeof data.sequence === "number") &&
        (data.customerData === undefined || typeof data.customerData === "string")
    );
};

export default function CustomerScan() {
    const navigate = useNavigate();
    const [scannedQrCount, setScannedQrCount] = useState<number>(0);
    const [expectedQrCount, setExpectedQrCount] = useState<number | null>(null);

    const expectedQrCountRef = useRef<number | null>(null);
    const seenRawQrRef = useRef<Set<string>>(new Set());
    const seenSignaturesRef = useRef<Set<string>>(new Set());

    const successfulTransactionsRef = useRef<Transaction[]>([]);
    const totalPointsRef = useRef<number>(0);
    const errorsRef = useRef<string[]>([]);
    const isFinalizingRef = useRef<boolean>(false);

    const finalizeSequence = useCallback((totalExpected: number) => {
        if (isFinalizingRef.current) return;
        isFinalizingRef.current = true;

        const storedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
        const allTransactions: Transaction[] = storedTransactions ? JSON.parse(storedTransactions) : [];
        const successfulTransactions = successfulTransactionsRef.current;

        if (successfulTransactions.length > 0) {
            const updatedTransactions = [...allTransactions, ...successfulTransactions];
            localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));

            const isSingle = totalExpected === 1;
            const title = isSingle ? "YOU GOT" : successfulTransactions.length === totalExpected ? "SHARE SUCCESSFUL" : "PARTIAL SHARE";

            const subtitle = isSingle ? undefined : `Received ${successfulTransactions.length} of ${totalExpected} transactions`;

            navigate("/customer/scan/results", {
                state: {
                    title: title,
                    subtitle: subtitle,
                    points: totalPointsRef.current,
                    errors: errorsRef.current,
                    path: "/customer"
                }
            });
        } else {
            navigate("/customer/scan/results", {
                state: {
                    title: "TRANSACTION FAILED",
                    subtitle: totalExpected > 1 ? `Received 0 of ${totalExpected} transactions` : undefined,
                    errors: errorsRef.current,
                    path: "/customer"
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
                    navigate("/customer/scan/results", {
                        state: {
                            title: "TRANSACTION FAILED",
                            subtitle: "Could not establish sequence.",
                            errors: ["The first scanned QR code has an invalid format."],
                            path: "/customer"
                        }
                    });
                    return;
                }

                errorsRef.current.push("Invalid QR data format.");

                const invalidId = generateId()
                seenSignaturesRef.current.add(invalidId)
                setScannedQrCount(seenSignaturesRef.current.size);

                if (seenSignaturesRef.current.size >= expectedQrCountRef.current) {
                    finalizeSequence(expectedQrCountRef.current);
                }

                return;
            }

            if (seenSignaturesRef.current.has(parsedResults.signature)) {
                return;
            }
            seenSignaturesRef.current.add(parsedResults.signature);

            const sequenceCount = parsedResults.sequence || 1;

            if (expectedQrCountRef.current === null) {
                setExpectedQrCount(sequenceCount);
                expectedQrCountRef.current = sequenceCount;
            }

            setScannedQrCount(seenSignaturesRef.current.size);

            const newTransaction: Transaction = {
                name: parsedResults.message.name,
                points: parsedResults.message.points,
                id: parsedResults.message.id,
                timestamp: parsedResults.message.timestamp,
                signature: parsedResults.signature,
                customerData: parsedResults.customerData
            };

            const storedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
            const allTransactions: Transaction[] = storedTransactions ? JSON.parse(storedTransactions) : [];
            const isDuplicate = allTransactions.some((transaction) => transaction.id === newTransaction.id);

            if (isDuplicate) {
                errorsRef.current.push(`Duplicate transaction (already saved to storage).`);
            } else {
                successfulTransactionsRef.current.push(newTransaction);
                totalPointsRef.current += newTransaction.points;
            }

            if (seenSignaturesRef.current.size >= sequenceCount) {
                finalizeSequence(sequenceCount);
            }

        } catch (error) {
            if (expectedQrCountRef.current === null) {
                navigate("/customer/scan/results", {
                    state: {
                        title: "TRANSACTION FAILED",
                        subtitle: "Could not establish sequence.",
                        errors: ["QR payload is not valid JSON."],
                        path: "/customer"
                    }
                });
                return;
            }

            errorsRef.current.push("QR data is not JSON.");

            const invalidId = generateId()
            seenSignaturesRef.current.add(`invalid${invalidId}`)
            setScannedQrCount(seenSignaturesRef.current.size);

            if (seenSignaturesRef.current.size >= expectedQrCountRef.current) {
                finalizeSequence(expectedQrCountRef.current);
            }

            return;
        }
    }, []);


    const sequenceSubtitle = expectedQrCount && expectedQrCount > 1 ? `SCANNED ${scannedQrCount} OF ${expectedQrCount}` : "";

    return (
        <SequenceScannerWrapper>
            <QrScanHandler
                title="SCAN TRANSACTION"
                subtitle={sequenceSubtitle}
                scanSuccessHandler={handleScanSuccess}
            />

            {scannedQrCount > 0 && expectedQrCount && scannedQrCount < expectedQrCount && (
                <AdditionalButtonWrapper>
                    <ButtonContainer>
                        <Button
                            onClick={() => finalizeSequence(expectedQrCount)}
                            style={{
                                backgroundColor: "#e55555",
                            }}
                        >
                            FINISH EARLY ({successfulTransactionsRef.current.length} TRANSACTIONS)
                        </Button>
                    </ButtonContainer>
                </AdditionalButtonWrapper>
            )}
        </SequenceScannerWrapper>
    );
}