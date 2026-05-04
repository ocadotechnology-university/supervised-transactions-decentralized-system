import { useLocation, useNavigate } from "react-router-dom";
import GenerateQR from "../components/GenerateQR";
import { Button, ButtonContainer, Screen, Title } from "../styles.ts";

export default function TraderPointsQR() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    if (!data) {
        return (
            <Screen>
                <Title>NO DATA</Title>
                <ButtonContainer>
                    <Button
                        onClick={() => navigate("/trader", { replace: true })}
                    >
                        BACK
                    </Button>
                </ButtonContainer>
            </Screen>
        );
    }

    return (
        <Screen>
            <Title>SHOW QR TO CUSTOMER</Title>

            <GenerateQR data={data} />

            <ButtonContainer>
                <Button
                    onClick={() => navigate("/trader", { replace: true })}
                >
                    DONE
                </Button>
            </ButtonContainer>
        </Screen>
    );
}