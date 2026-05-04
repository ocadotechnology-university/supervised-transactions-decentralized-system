import { useLocation, useNavigate } from "react-router-dom";
import {useEffect} from "react";
import { ButtonContainer, PointsContainer, PointsLabel, PointsValue, Screen, Title, Button, Circle } from "../styles.ts";

export default function CustomerScanResults() {
    const navigate = useNavigate();

    useEffect(() => {
        const STORAGE_KEY = "customerData";
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            navigate("/customer/register", { replace: true });
            return;
        }
    }, []);

    const location = useLocation();
    const data = location.state;

    if (!data) {
        return (
            <Screen>
                <Title>NO DATA</Title>
                <ButtonContainer>
                    <Button onClick={() => navigate("/customer", { replace: true })}>
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
                    <Title>YOU GOT</Title>

                    <PointsContainer>
                        <Circle>
                            <PointsValue>{data.transactionPoints}</PointsValue>
                        </Circle>
                        <PointsLabel>POINTS</PointsLabel>
                    </PointsContainer>
                </>
            ) : (
                <>
                    <Title>TRANSACTION FAILED</Title>
                    {data.duplicate && (
                        <Title>DUPLICATE DETECTED</Title>
                    )}
                </>
            )}

            <ButtonContainer>
                <Button onClick={() => navigate("/customer/scan", { replace: true })}>
                    SCAN AGAIN
                </Button>

                <Button onClick={() => navigate("/customer", { replace: true })}>
                    DONE
                </Button>
            </ButtonContainer>
        </Screen>
    );
}

