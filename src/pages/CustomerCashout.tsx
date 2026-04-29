import "../styles.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type CustomerEntry = {
    name: string;
    uuid: string;
    timestamp: number;
}

type Transaction = {
    name: string;
    points: number;
    uuid: string;
    timestamp: number;
    signature: string;
}

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
            setName(`${customerData.name}#${customerData.uuid}`);
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
        const payload = {
            customerData: customerName,
            message: {
                name: transaction.name,
                points: transaction.points,
                uuid: transaction.uuid,
                timestamp: transaction.timestamp
            },
            signature: transaction.signature
        };

        //maybe should delete transaction after qr code is shown?
        const transactionRemaining = transactions.filter(cashed => cashed.uuid !== transaction.uuid);
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactionRemaining));

        navigate("/customer/cashout/qr", { state: payload });
    }

    return (
        <div className="screen">
            <h1 className="title">SELECT TRANSACTION</h1>

            {transactions.length > 0 ? (
                <div className="pointsGrid">
                    {transactions.map((transaction) => (
                        <button
                            key={transaction.uuid}
                            className="button"
                            onClick={() => handleCashout(transaction)}
                        >
                            {transaction.points}
                        </button>
                    ))}
                </div>
            ) : (

                <h2 className="title">NO TRANSACTIONS</h2>
            )}

            <div className="buttonContainer" style={{ marginTop: "40px" }}>
                <button
                    className="button"
                    onClick={() => navigate("/customer", {replace: true})}
                >
                    BACK
                </button>
            </div>
        </div>
    );

}