import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import {generateId} from "../utils/crypto.ts";
import type { CustomerEntry } from "../utils/types.ts";
import { Screen, Title, ButtonContainer, Button, Input, ErrorText } from "../styles/common.styles.ts";

const CUSTOMER_KEY = "customerData";
const MAX_NAME_LENGTH = 20;

export default function CustomerRegistration() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [, setCustomerData] = useLocalStorage<CustomerEntry | null>(CUSTOMER_KEY, null);

    const checkNameValidationError = (trimmedName: string): string | null => {
        if (!trimmedName) {
            return "Customer name is required";
        }
        if (trimmedName.length > MAX_NAME_LENGTH) {
            return `Max ${MAX_NAME_LENGTH} characters`;
        }
        return null;
    }

    const handleRegister = (): void => {
        const trimmedName = name.trim();
        const nameValidationError = checkNameValidationError(trimmedName);

        if (nameValidationError) {
            setNameError(nameValidationError);
            return;
        }

        setNameError("");

        const payload: CustomerEntry = {
            name: trimmedName.toUpperCase(),
            id: generateId(),
            timestamp: Date.now(),
        };

        setCustomerData(payload);
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