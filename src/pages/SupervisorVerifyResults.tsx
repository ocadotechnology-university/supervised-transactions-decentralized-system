import { useLocation, useNavigate } from "react-router-dom";
import { Button, ButtonContainer, Circle, PointsContainer, PointsLabel, PointsValue, Screen, Title } from "../styles/common.styles.ts";

export default function SupervisorVerifyResults() {
    const location = useLocation();
    const navigate = useNavigate();

    const data = location.state;

    if (!data) {
        return (
            <Screen>
                <Title>NO DATA</Title>
                <ButtonContainer>
                    <Button onClick={() => navigate("/supervisor", { replace: true })}>
                        BACK
                    </Button>
                </ButtonContainer>
            </Screen>
        );
    }

    return (
        <Screen>
            {data.success ? (
                <>
                    <Title>VERIFIED TOKEN</Title>
                    <PointsLabel>{data.customerData}</PointsLabel>

                    <PointsContainer>
                        <Circle>
                            <PointsValue>{data.transactionPoints}</PointsValue>
                        </Circle>
                        <PointsLabel>POINTS</PointsLabel>
                    </PointsContainer>
                </>
            ) : (
                <Title>INVALID TOKEN</Title>
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/supervisor/verify", { replace: true })}>
                    SCAN AGAIN
                </Button>

                <Button onClick={() => navigate("/supervisor", { replace: true })}>
                    DONE
                </Button>
            </ButtonContainer>
        </Screen>
    );
}