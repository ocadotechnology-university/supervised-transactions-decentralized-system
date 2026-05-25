import { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";
import { calculateScore } from "../utils/leaderboard.ts";
import type { LeaderboardEntry } from "../utils/types.ts";
import {Screen, Title, Button, Paragraph, ButtonContainer} from "../styles/common.styles.ts";
import {LeaderboardContainer, LeaderboardList, LeaderboardItem, LeaderboardPoints} from "../styles/SupervisorRanking.styles.ts";


export default function SupervisorRanking() {
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

            <LeaderboardContainer>
                {topCustomers.length === 0 ? (
                    <Paragraph>There is no data available to display the ranking.</Paragraph>
                ) : (
                    <LeaderboardList>
                        {topCustomers.map((customer) => (
                            <LeaderboardItem key={customer.customerData}>
                                {customer.customerData}
                                <LeaderboardPoints>
                                    {customer.points} pkt
                                </LeaderboardPoints>
                            </LeaderboardItem>
                        ))}
                    </LeaderboardList>
                )}
            </LeaderboardContainer>

            <ButtonContainer>
                <Button className="button" onClick={() => navigate(-1)}>
                        BACK
                </Button>
            </ButtonContainer>
        </Screen>
    );
}