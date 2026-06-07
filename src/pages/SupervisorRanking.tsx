import { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";
import { calculateScore } from "../utils/leaderboard.ts";
import type { LeaderboardEntry } from "../utils/types.ts";
import {Screen, Title, Button, Paragraph, ButtonContainer} from "../styles/common.styles.ts";
import {LeaderboardContainer, LeaderboardList, LeaderboardItem, LeaderboardPoints} from "../styles/SupervisorRanking.styles.ts";

const EmptyStateMessage = () => (
    <Paragraph>There is no data available to display the ranking</Paragraph>
);

interface LeaderboardProps {
    customers: LeaderboardEntry[];
}

const LeaderboardDataList = ({ customers }: LeaderboardProps) => (
    <LeaderboardList>
        {customers.map(({ customerData, points}) =>
            <LeaderboardItem key={customerData}>
                {customerData}
                <LeaderboardPoints>
                    {points} points
                </LeaderboardPoints>
            </LeaderboardItem>
        )}
    </LeaderboardList>
);

export default function SupervisorRanking() {
    const navigate = useNavigate();
    const [topCustomers, setTopCustomers] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const customerScores = calculateScore();

        const top5Scores = customerScores.slice(0, 5);

        setTopCustomers(top5Scores);
    }, []);

    const hasData = topCustomers.length > 0;

    return (
        <Screen>
            <Title>TOP 5 CUSTOMERS</Title>

            <LeaderboardContainer>
                {hasData ? (
                    <LeaderboardDataList customers={topCustomers} />
                ) : (
                    <EmptyStateMessage />
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