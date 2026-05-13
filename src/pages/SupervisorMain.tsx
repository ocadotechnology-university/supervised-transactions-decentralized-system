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
                <Button >
                    VERIFY POINTS
                </Button>
                <Button >
                    RANKING
                </Button>
            </ButtonContainer>
        </Screen>
    );
}
