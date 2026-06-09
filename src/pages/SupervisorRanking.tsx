import { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";
import { getScore } from "../utils/leaderboard.ts";
import type { LeaderboardEntry } from "../utils/types.ts";
import {Screen, Title, Button, Paragraph, ButtonContainer} from "../styles/common.styles.ts";
import {LeaderboardContainer, LeaderboardList, LeaderboardItem, LeaderboardPoints} from "../styles/SupervisorRanking.styles.ts";

const EmptyStateMessage = () => (
    <Paragraph>There is no data available to display the ranking</Paragraph>
);

type LeaderboardProps = {
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
        const customerScores = getScore();

        const top10Scores = customerScores.slice(0, 10);

        setTopCustomers(top10Scores);
    }, []);

    const hasData = topCustomers.length > 0;

    return (
        <Screen>
            <Title>Top 10 customers</Title>

            <LeaderboardContainer>
                {hasData ? (
                    <LeaderboardDataList customers={topCustomers} />
                ) : (
                    <EmptyStateMessage />
                )}
            </LeaderboardContainer>

            <ButtonContainer>
                <Button className="button" onClick={() => navigate(-1)}>
                        Back
                </Button>
            </ButtonContainer>
        </Screen>
    );
}