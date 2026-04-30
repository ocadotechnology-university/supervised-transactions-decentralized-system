import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {generateId} from "../utils/crypto.ts";
import { Screen, Title, ButtonContainer, Button, Input, ErrorText } from "../styles.ts";

const CUSTOMER_KEY = "customerData";
const MAX_NAME_LENGTH = 20;

export default function CustomerRegistration() {
    const navigate = useNavigate();

    useEffect(() => {
        const customerData = localStorage.getItem(CUSTOMER_KEY);
        if (customerData) {
            navigate("/customer", { replace: true });
        }
    }, []);

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");


    function validate(trimmedName: string): boolean {
        if (!trimmedName) {
            setNameError("Customer name is required");
            return false;
        }
        if (trimmedName.length > MAX_NAME_LENGTH) {
            setNameError(`Max ${MAX_NAME_LENGTH} characters`);
            return false;
        }
        setNameError("");
        return true;
    }

    function handleRegister() {
        const trimmedName = name.trim();
        if (!validate(trimmedName)) {
            return;
        }

        const payload = {
            name: trimmedName.toUpperCase(),
            id: generateId(),
            timestamp: Date.now(),
        };

        localStorage.setItem(CUSTOMER_KEY, JSON.stringify(payload));
        navigate("/customer", { replace: true });
    }

    return (
        <Screen>
            <Title>CUSTOMER REGISTRATION</Title>

            <Input
                placeholder="ENTER YOUR NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            {nameError && <ErrorText>{nameError}</ErrorText>}

            <ButtonContainer>
                <Button onClick={handleRegister}>
                    OK
                </Button>

                <Button onClick={() => navigate("/", { replace: true })}>
                    BACK
                </Button>
            </ButtonContainer>
        </Screen>
    );
}