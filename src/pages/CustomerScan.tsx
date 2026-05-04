import {useState, useCallback, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import ScanQR from "../components/ScanQR";
import type { Transaction } from "../utils/types.ts";
import { Screen, Title, Button, ButtonContainer, ScannerWrapper } from "../styles.ts";

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

    useEffect(() => {
        const STORAGE_KEY = "customerData";
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            navigate("/customer/register", { replace: true });
            return;
        }
    }, []);

    const [isScanning, setIsScanning] = useState<boolean>(false);

    const handleScanSuccess = useCallback(
        (decodedString: string) => {
            try {
                const data = JSON.parse(decodedString);

                const isValid =
                    typeof data.message.name === "string" &&
                    typeof data.message.points === "number" &&
                    typeof data.message.id === "string" &&
                    typeof data.message.timestamp === "number" &&
                    typeof data.signature === "string";

                if (!isValid) {
                    console.error("Invalid data structure");
                    setIsScanning(false);
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
                    setIsScanning(false);
                    navigate("/customer/scan/results", { state: { success: true, transactionPoints: transactionData.points} });
                } else {
                    setIsScanning(false);
                    navigate("/customer/scan/results", { state: { success: false, duplicate: true} });
                }
            } catch (e) {
                console.error("Invalid QR payload", e);
                setIsScanning(false);
                navigate("/customer/scan/results", { state: { success: false } });
            }
        },
        []
    );

    return (
        <Screen>
            <Title>SCAN TRANSACTION</Title>

            {!isScanning ? (
                <ButtonContainer>
                    <Button onClick={() => setIsScanning(true)}>
                        SCAN
                    </Button>

                    <Button onClick={() => navigate("/customer", { replace: true })}>
                        BACK
                    </Button>
                </ButtonContainer>
            ) : (
                <>
                    <ScannerWrapper>
                        <ScanQR scanSuccess={handleScanSuccess} />
                    </ScannerWrapper>

                    <ButtonContainer>
                        <Button
                            onClick={() => {
                                setIsScanning(false);
                                navigate("/customer", { replace: true });
                            }}
                        >
                            BACK
                        </Button>
                    </ButtonContainer>
                </>
            )}
        </Screen>
    );
}