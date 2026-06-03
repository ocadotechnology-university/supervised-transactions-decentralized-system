import { useNavigate } from "react-router-dom";
import {Screen, Title, ButtonContainer, Button, ErrorText} from "../styles/common.styles.ts";
import {useState} from "react";

export default function Home() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const errorMessage = "Your browser is not supported. Please update your browser."

    const hasCrypto = typeof window !== 'undefined' && !!window.crypto;
    const hasRandomValues = hasCrypto && typeof window.crypto.getRandomValues === 'function';
    const hasSubtleCrypto = hasCrypto && window.crypto.subtle !== undefined;
    const hasBase64Methods = typeof Uint8Array.prototype.toBase64 === 'function' && typeof Uint8Array.fromBase64 === 'function';

    const handleCustomerClick = () => {
        if (!hasRandomValues) {
            setError(errorMessage);
            return;
        }
        setError(null);
        navigate("/customer");
    };

    const handleTraderClick = () => {
        if (!hasSubtleCrypto || !hasBase64Methods) {
            setError(errorMessage);
            return;
        }
        setError(null);
        navigate("/trader");
    };

    const handleSupervisorClick = () => {
        if (!hasSubtleCrypto || !hasBase64Methods) {
            setError(errorMessage);
            return;
        }
        setError(null);
        navigate("/supervisor");
    };

    return (
        <Screen>
            <Title>WHO ARE YOU</Title>

            {error && (
                <ErrorText>{ error }</ErrorText>
            )}

            <ButtonContainer>
                <Button onClick={handleCustomerClick}>
                    CUSTOMER
                </Button>
                <Button onClick={handleTraderClick}>
                    TRADER
                </Button>
                <Button onClick={handleSupervisorClick}>
                    SUPERVISOR
                </Button>
            </ButtonContainer>
        </Screen>
    );
}