import { useLocation, useNavigate } from "react-router-dom";
import GenerateQR from "../components/GenerateQR";
import { Screen, Button, ButtonContainer, Title } from "../styles.ts";

export default function CustomerCashoutQR() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    if (!data) {
        return (
            <Screen>
                <Title>NO DATA</Title>
                <ButtonContainer>
                    <Button
                        onClick={() => navigate("/customer", { replace: true })}
                    >
                        BACK
                    </Button>
                </ButtonContainer>
            </Screen>
        );
    }

    return (
        <Screen>
            <Title>SHOW QR TO SUPERVISOR</Title>

            <GenerateQR data={data} />

            <ButtonContainer>
                <Button
                    onClick={() => navigate("/customer/cashout", { replace: true })}
                >
                    CASHOUT AGAIN
                </Button>

                <Button
                    onClick={() => navigate("/customer", { replace: true })}
                >
                    DONE
                </Button>
            </ButtonContainer>
        </Screen>
    );
}