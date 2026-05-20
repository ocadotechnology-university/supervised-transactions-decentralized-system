import { useLocation, useNavigate } from "react-router-dom";
import { Button, ButtonContainer, Paragraph, Screen, Title } from "../styles/common.styles.ts";
import { PointsContainer, Circle, PointsValue, PointsLabel } from "../styles/points.styles.ts";

type ScanResultsProps = {
    title: string;
    subtitle?: string;
    points?: number;
    path: string;
}

export default function ScanResults() {
    const navigate = useNavigate();
    const location = useLocation();

    const resultsData: ScanResultsProps = location.state;

    if (!resultsData) {
        return (
            <Screen>
                <Title>NO DATA</Title>
                <ButtonContainer>
                    <Button onClick={() => navigate(-1)}>
                        BACK
                    </Button>
                </ButtonContainer>
            </Screen>
        );
    }

    return (
        <Screen>
            <Title>{resultsData.title}</Title>

            {resultsData.subtitle && (
                <Paragraph>{resultsData.subtitle}</Paragraph>
            )}

            {resultsData.points && (
                <PointsContainer>
                    <Circle>
                        <PointsValue>{resultsData.points}</PointsValue>
                    </Circle>
                    <PointsLabel>POINTS</PointsLabel>
                </PointsContainer>
            )}

            <ButtonContainer>
                <Button onClick={() => navigate(-1)}>
                    SCAN AGAIN
                </Button>

                <Button onClick={() => navigate(resultsData.path, { replace: true })}>
                    DONE
                </Button>
            </ButtonContainer>
        </Screen>
    );
}