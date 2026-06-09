import { useNavigate } from "react-router-dom";
import {Screen, Title, ButtonContainer, Button} from "../styles/common.styles.ts";

export default function SupervisorMain() {
    const navigate = useNavigate();

    return (
        <Screen>
            <Title>Choose action</Title>

            <ButtonContainer>
                <Button onClick={() => navigate("/supervisor/register")}>
                    Register traders
                </Button>
                <Button onClick={() => navigate("/supervisor/verify")}>
                    Verify points
                </Button>
                <Button onClick={() => navigate("/supervisor/ranking")}>
                    Ranking
                </Button>
            </ButtonContainer>
        </Screen>
    );
}
