import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Transaction, CustomerEntry } from "../utils/types.ts";
import { Screen, Title, PointsGrid, Button, ButtonContainer } from "../styles/common.styles.ts";

export default function CustomerCashout() {
    const TRANSACTIONS_KEY = "customerTransactions";
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [customerName, setName] = useState("");

    useEffect(() => {
        const STORAGE_KEY = "customerData";
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const customerData: CustomerEntry = JSON.parse(stored);
            setName(`${customerData.name}#${customerData.id}`);
        }
        else {
            navigate("/customer/register", { replace: true });
            return;
        }
        const transactionStored = localStorage.getItem(TRANSACTIONS_KEY)
        if (transactionStored) {
            const transactionParsed: Transaction[] = JSON.parse(transactionStored);
            setTransactions(transactionParsed);
        }
    }, []);

    function handleCashout(transaction: Transaction) {
        const qrPayload = {
            title: "SHOW CODE TO SUPERVISOR",
            qrData: {
                customerData: customerName,
                message: {
                    name: transaction.name,
                    points: transaction.points,
                    id: transaction.id,
                    timestamp: transaction.timestamp
                },
                signature: transaction.signature
            }
        };

        //maybe should delete transaction after qr code is shown?
        const transactionRemaining = transactions.filter(cashed => cashed.id !== transaction.id);
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactionRemaining));

        navigate("/customer/cashout/qr", { state: qrPayload });
    }

    return (
        <Screen>
            <Title>SELECT TRANSACTION</Title>

            {transactions.length > 0 ? (
                <PointsGrid>
                    {transactions.map((transaction) => (
                        <Button
                            key={transaction.id}
                            onClick={() => handleCashout(transaction)}
                        >
                            {transaction.points}
                        </Button>
                    ))}
                </PointsGrid>
            ) : (

                <Title>NO TRANSACTIONS</Title>
            )}

            <ButtonContainer style={{ marginTop: "40px" }}>
                <Button
                    onClick={() => navigate("/customer", {replace: true})}
                >
                    BACK
                </Button>
            </ButtonContainer>
        </Screen>
    );

}