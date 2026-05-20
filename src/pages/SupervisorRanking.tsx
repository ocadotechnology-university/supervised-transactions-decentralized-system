import { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";
import { Screen, Title, Button} from "../styles/common.styles.ts";
import { calculateScore } from "../utils/leaderboard.ts";
import type { LeaderboardEntry } from "../utils/types.ts";


export function SupervisorRanking() {
    const navigate = useNavigate();
    const [topCustomers, setTopCustomers] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const customerScores = calculateScore();

        const top5Scores = customerScores.slice(0, 5);

        setTopCustomers(top5Scores);
    }, []);

    return (
        <Screen>
            <Title>TOP 5 CUSTOMERS</Title>

            <div className="leaderboardContainer">
                {topCustomers.length === 0 ? (
                    <p>There is no data available to display the ranking.</p>
                ) : (
                    <ol>
                        {topCustomers.map((customer) => (
                            <li key={customer.customerData} style={{ margin: "10px 0", fontSize: "1.2rem" }}>
                                {customer.customerData} 
                                <span style={{ marginLeft: "15px", color: "black" }}>
                                    {customer.points} pkt
                                </span>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
            <Button className="button" onClick={() => navigate("/supervisor")}>
                    BACK
            </Button>
        </Screen>
    );
}