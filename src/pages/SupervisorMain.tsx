import { useNavigate } from "react-router-dom";
import { Screen, Title, ButtonContainer, Button } from "../styles/common.styles.ts";

export default function SupervisorMain() {
    const navigate = useNavigate();

    return (
        <Screen>
            <Title>CHOOSE ACTION</Title>

            <ButtonContainer>
                <Button onClick={() => navigate("/supervisor/register")}>
                    REGISTER A TRADER
                </Button>
                <Button onClick={() => navigate("/supervisor/verify")}>
                    VERIFY POINTS
                </Button>
                <Button onClick={() => navigate("/supervisor/ranking")}>
                    RANKING
                </Button>
            </ButtonContainer>
        </Screen>
    );
}
