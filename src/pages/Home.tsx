import { useNavigate } from "react-router-dom";
import { Screen, Title, ButtonContainer, Button } from "../styles.ts";

export default function Home() {
    const navigate = useNavigate();

    return (
        <Screen>
            <Title>WHO ARE YOU</Title>

            <ButtonContainer>
                <Button onClick={() => navigate("/customer")}>
                    CUSTOMER
                </Button>
                <Button onClick={() => navigate("/trader")}>
                    TRADER
                </Button>
                <Button onClick={() => navigate("/supervisor")}>
                    SUPERVISOR
                </Button>
            </ButtonContainer>
        </Screen>
    );
}