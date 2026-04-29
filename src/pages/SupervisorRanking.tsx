import "../styles.css";
import { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";

type Transaction = {
    name: string;
    points: number;
    uuid: string;
    timestamp: number;
    signature: string;
    customerData: string;
}

type LeaderboardEntry = {
    customerData: string;
    points: number;
}

function getSortedScores(customerScores: Record<string, number>) {
    const entries = Object.entries(customerScores);

    entries.sort((a, b) => b[1] - a[1]);

    const sortedLeaderboard = entries.map(entry => {
        return {
            customerData: entry[0],
            points: entry[1]
        };
    });

    return sortedLeaderboard;
}

function getUsedTransactions(): Transaction[] {
    const transactions: Transaction[] = [];

    const allKeys = Object.keys(localStorage);

    allKeys.forEach(key => {
        if (key === "trader" || key === "traders") {
            return;
        }

        const rawValue = localStorage.getItem(key);

        if (rawValue) {
            try {
                const parsedData: Transaction = JSON.parse(rawValue);
                transactions.push(parsedData);
            } catch (error) {
                console.error(`Error of parsing JSON key: ${key}`, error);
            }
        }
    });

    return transactions;
}

function calulateScore(){
    const usedTransactions = getUsedTransactions();
    const customerScores: Record<string, number> = {};

    for (const token of usedTransactions) {
        if(customerScores[token.customerData]) {
            customerScores[token.customerData] += token.points;
        }
        else {
            customerScores[token.customerData] = token.points;
        }
        
    }
    return getSortedScores(customerScores);
}

export function SupervisorRanking() {
    const navigate = useNavigate();
    const [topCustomers, setTopCustomers] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const customerScores = calulateScore();

        const top5Scores = customerScores.slice(0, 5);

        setTopCustomers(top5Scores);
    }, []);

    return (
        <div className="screen">
            <h1 className="title">TOP 5 CUSTOMERS</h1>

            <div className="leaderboardContainer">
                {topCustomers.length === 0 ? (
                    <p>Brak danych do wyświetlenia rankingu.</p>
                ) : (
                    <ol>
                        {topCustomers.map((customer, index) => (
                            <li key={customer.customerData} style={{ margin: "10px 0", fontSize: "1.2rem" }}>
                                <strong></strong> {customer.customerData} 
                                <span style={{ marginLeft: "15px", color: "gold" }}>
                                    {customer.points} pkt
                                </span>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
            <button className="button" onClick={() => navigate("/supervisor")}>
                    BACK
                </button>
        </div>
    );
}