import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Transaction, CustomerEntry } from "../utils/types.ts";
import { Screen, Title, Button, ButtonContainer } from "../styles/common.styles.ts";
import { PointsGrid } from "../styles/points.styles.ts";

const CUSTOMER_KEY = "customerData";
const TRANSACTIONS_KEY = "customerTransactions";

export default function CustomerCashout() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [customerName, setName] = useState<string>("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const storedCustomerData = localStorage.getItem(CUSTOMER_KEY);
        if (storedCustomerData) {
            const customerData: CustomerEntry = JSON.parse(storedCustomerData);
            setName(`${customerData.name}#${customerData.id}`);
        }

        const storedTransactions = localStorage.getItem(TRANSACTIONS_KEY)
        if (storedTransactions) {
            const parsedTransactions: Transaction[] = JSON.parse(storedTransactions);
            setTransactions(parsedTransactions);
        }
    }, []);

    const toggleSelect = (id: string): void => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    }

    const handleCashoutSequence = (): void => {
        if (selectedIds.size === 0) {
            return;
        }

        const selectedTransactions = transactions.filter(transaction => selectedIds.has(transaction.id));
        const remainingTransactions = transactions.filter(transaction => !selectedIds.has(transaction.id));

        const qrDataList = selectedTransactions.map(transaction => ({
            sequence: selectedTransactions.length,
            customerData: customerName,
            message: {
                name: transaction.name,
                points: transaction.points,
                id: transaction.id,
                timestamp: transaction.timestamp
            },
            signature: transaction.signature
        }));

        const qrPayload = {
            title: "SHOW CODES TO SUPERVISOR",
            qrData: qrDataList
        };

        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(remainingTransactions));
        navigate("/customer/cashout/qr", { state: qrPayload });
    }

    return (
        <Screen>
            <Title>SELECT TRANSACTIONS</Title>

            {transactions.length > 0 ? (
                <PointsGrid>
                    {transactions.map((transaction) => {
                        const isSelected = selectedIds.has(transaction.id);
                        return (
                            <Button
                                key={transaction.id}
                                onClick={() => toggleSelect(transaction.id)}
                                style={{
                                    opacity: isSelected ? 1 : 0.5,
                                }}
                            >
                                {transaction.points}
                            </Button>
                        );
                    })}
                </PointsGrid>
            ) : (
                <Title>NO TRANSACTIONS</Title>
            )}

            <ButtonContainer style={{ marginTop: "40px"}}>
                <Button onClick={handleCashoutSequence}>
                    CASHOUT {selectedIds.size} SELECTED
                </Button>

                <Button onClick={() => navigate(-1)}>
                    BACK
                </Button>
            </ButtonContainer>
        </Screen>
    );
}