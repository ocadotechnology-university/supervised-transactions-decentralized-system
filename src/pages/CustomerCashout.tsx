import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Transaction, CustomerEntry } from "../utils/types.ts";
import {Screen, Title, Button, ButtonContainer, Paragraph} from "../styles/common.styles.ts";
import { PointsGrid } from "../styles/points.styles.ts";
import {STORAGE_KEYS} from "../utils/localStorageKeys.ts";

export default function CustomerCashout() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [customerName, setName] = useState<string>("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const storedCustomerData = localStorage.getItem(STORAGE_KEYS.CUSTOMER_DATA);
        if (storedCustomerData) {
            const customerData: CustomerEntry = JSON.parse(storedCustomerData);
            setName(`${customerData.name}#${customerData.id}`);
        }

        const storedTransactions = localStorage.getItem(STORAGE_KEYS.CUSTOMER_TRANSACTIONS)
        if (storedTransactions) {
            const parsedTransactions: Transaction[] = JSON.parse(storedTransactions);
            setTransactions(parsedTransactions);
        }
    }, []);

    const toggleSelect = (id: string): void => {
        setSelectedIds((prevSelectedIds) => {
            const newSelected = new Set(prevSelectedIds);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    }

    const handleCashoutSequence = (): void => {
        if (selectedIds.size === 0) {
            return;
        }

        const grouped = Object.groupBy(transactions, (transaction) =>
            selectedIds.has(transaction.id) ? "selected" : "remaining"
        );

        const selectedTransactions = grouped.selected || [];
        const remainingTransactions = grouped.remaining || [];

        const qrDataList = selectedTransactions.map((transaction) => ({
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
            title: "SHOW CODES TO SUPERVISOR OR TO CUSTOMER",
            qrData: qrDataList
        };

        localStorage.setItem(STORAGE_KEYS.CUSTOMER_TRANSACTIONS, JSON.stringify(remainingTransactions));
        navigate("/customer/cashout/qr", { state: qrPayload });
    }

    return (
        <Screen>
            <Title>SELECT TRANSACTIONS</Title>
            <Paragraph>Selected transactions will be removed from your account</Paragraph>

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
                    CASHOUT/SHARE {selectedIds.size} SELECTED
                </Button>

                <Button onClick={() => navigate(-1)}>
                    BACK
                </Button>
            </ButtonContainer>
        </Screen>
    );
}